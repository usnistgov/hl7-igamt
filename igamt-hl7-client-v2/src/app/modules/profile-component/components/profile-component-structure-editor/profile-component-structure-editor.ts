import { OnInit, Type as CoreType, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription, throwError, BehaviorSubject } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, take, tap, pluck } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { selectSelectedProfileComponent } from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { getHl7ConfigState, selectBindingConfig } from '../../../../root-store/config/config.reducer';
import * as fromIgamtSelectors from '../../../../root-store/dam-igamt/igamt.selectors';
import { selectValueSetsNodes } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Message, MessageType } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { HL7v2TreeColumnType, IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { Hl7Config, IValueSetBindingConfigMap } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { IProfileComponentContext, IProfileComponentItem, IPropertyBinding, IProfileComponentBinding } from '../../../shared/models/profile.component';
import { IResource } from '../../../shared/models/resource.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IBindingContext } from '../../../shared/services/structure-element-binding.service';
import { ProfileComponentService } from '../../services/profile-component.service';
import { AddProfileComponentItemComponent } from '../add-profile-component-item/add-profile-component-item.component';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import * as _ from 'lodash';
import { ProfileComponentItemList } from '../../services/profile-component-item.object';
import { IProfileComponentChange } from '../profile-component-structure-tree/profile-component-structure-tree.component';

export type BindingLegend = Array<{
  label: string,
  context: IBindingContext,
}>;

export abstract class ProfileComponentStructureEditor<T extends IProfileComponentContext> extends AbstractEditorComponent implements OnInit, OnDestroy {
  type = Type;
  profileComponentContext$: BehaviorSubject<T>;
  public datatypes: Observable<IDisplayElement[]>;
  public segments: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public bindingConfig: Observable<IValueSetBindingConfigMap>;
  public config: Observable<Hl7Config>;
  username: Observable<string>;
  workspace_s: Subscription;
  hasOrigin$: Observable<boolean>;
  resourceType: Type;
  derived$: Observable<boolean>;
  resource$: Observable<IResource>;
  nodes: IHL7v2TreeNode[];
  itemList$: Observable<IHL7v2TreeNode[]>;
  profileComponentId$: Observable<string>;
  profileComponentItemService: ProfileComponentItemList;
  structureValue$: Observable<{ items: IProfileComponentItem[], bindings: IProfileComponentBinding }>
  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IHL7EditorMetadata,
    public LoadAction: CoreType<Action>,
    public legend: BindingLegend,
    public columns: HL7v2TreeColumnType[],
    public hl7V2TreeService: Hl7V2TreeService,
    public pcService: ProfileComponentService,
    public dialog: MatDialog
  ) {
    super(editorMetadata, actions$, store);
    this.resourceType = editorMetadata.resourceType;
    this.hasOrigin$ = this.store.select(fromIgamtSelectedSelectors.selectedResourceHasOrigin);
    this.config = this.store.select(getHl7ConfigState);
    this.datatypes = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
    this.segments = this.store.select(fromIgamtDisplaySelectors.selectAllSegments);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.username = this.store.select(fromAuth.selectUsername);
    this.bindingConfig = this.store.select(selectBindingConfig);
    this.profileComponentContext$ = new BehaviorSubject(undefined);
    this._viewOnly$ = combineLatest(
      this.store.select(fromIgamtSelectors.selectViewOnly),
      this.store.select(fromIgamtSelectors.selectDelta)
    ).pipe(
      map(([vOnly, delta]) => {
        return vOnly || delta;
      }),
    );
    this.derived$ = of(false);
    this.profileComponentId$ = this.store.select(selectSelectedProfileComponent).pipe(
      pluck('id'),
    );

    this.workspace_s = this.currentSynchronized$.pipe(
      flatMap((current) => {
        this.profileComponentContext$.next(_.cloneDeep(current.resource));
        this.resource$ = this.store.select(this.resourceSelector(), { id: current.resource.sourceId });
        return this.resource$.pipe(
          take(1),
          tap((resource) => {
            this.hl7V2TreeService.getTree(resource, this.repository, true, true, (value) => {
              this.nodes = [
                {
                  data: {
                    id: resource.id,
                    pathId: resource.id,
                    name: resource.name,
                    type: resource.type,
                    rootPath: { elementId: resource.id },
                    position: 0,
                  },
                  children: [...value],
                  parent: undefined,
                },
              ];
            });
            this.profileComponentItemService = new ProfileComponentItemList(
              this.profileComponentContext$.getValue(),
              this.nodes,
              resource,
              this.repository,
              this.pcService
            );

            this.structureValue$ = this.profileComponentItemService.context$.pipe(
              map((context) => {
                return {
                  items: context.profileComponentItems,
                  bindings: context.profileComponentBindings,
                }
              })
            );
            this.profileComponentItemService.change$.pipe(
              map((val) => {
                console.log(val);
                this.change(val as T)
              })
            ).subscribe();
          })
        );
      }),
    ).subscribe();
  }

  removeItem(pathId: string) {
    this.profileComponentItemService.removeItem(pathId);
  }

  addItems() {
    this.dialog.open(
      AddProfileComponentItemComponent,
      {
        data: {
          structure: this.nodes,
          repository: this.repository,
          selectedPaths: this.profileComponentItemService.context$.getValue().profileComponentItems
            .map((elm) => {
              return elm.path;
            }),
        },
      }
    ).afterClosed().pipe(
      filter((x) => x !== undefined),
      tap((x: IHL7v2TreeNode[]) => {
        this.profileComponentItemService.addItem(x.map((elm) => ({
          path: elm.data.pathId,
          itemProperties: [],
        })))
      }),
    ).subscribe();
  }

  changeItemProperty(change: IProfileComponentChange) {
    this.profileComponentItemService.applyPropertyChange(change);
  }

  change(value: T) {
    this.editorChange(value, true);
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.current$, this.documentRef$, this.profileComponentId$).pipe(
      take(1),
      concatMap(([current, documentRef, pcId]) => {
        console.log(current);
        return this.pcService.saveContext(pcId, current.data).pipe(
          flatMap((value) => {
            return [
              this.messageService.messageToAction(new Message<any>(MessageType.SUCCESS, 'Context saved success!', null)),
              new fromDam.EditorUpdate({ value: { changes: {}, resource: value }, updateDate: false }),
              new fromDam.SetValue({ selected: value })
            ];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  abstract getResourceType(): Type;
  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;
  abstract resourceSelector(): MemoizedSelectorWithProps<object, { id: string; }, IResource>;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.workspace_s) {
      this.workspace_s.unsubscribe();
    }
  }

  onDeactivate() {
  }

}
