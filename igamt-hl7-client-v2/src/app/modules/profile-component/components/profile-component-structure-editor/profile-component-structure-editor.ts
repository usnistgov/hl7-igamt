import {OnDestroy, OnInit, Type as CoreType} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {combineLatest, Observable, of, ReplaySubject, Subscription, throwError} from 'rxjs';
import {catchError, concatMap, filter, flatMap, map, mergeMap, take, tap, withLatestFrom} from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import {selectProfileComponentById} from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import {selectSelectedProfileComponent} from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import {getHl7ConfigState, selectBindingConfig} from '../../../../root-store/config/config.reducer';
import * as fromIgamtSelectors from '../../../../root-store/dam-igamt/igamt.selectors';
import {selectDerived, selectValueSetsNodes} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {Message} from '../../../dam-framework/models/messages/message.class';
import {MessageService} from '../../../dam-framework/services/message.service';
import {IStructureChanges} from '../../../segment/components/segment-structure-editor/segment-structure-editor.component';
import {HL7v2TreeColumnType} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {Type} from '../../../shared/constants/type.enum';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import {Hl7Config, IValueSetBindingConfigMap} from '../../../shared/models/config.class';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {IHL7EditorMetadata} from '../../../shared/models/editor.enum';
import {IProfileComponentContext, IProfileComponentItem, ItemProperty} from '../../../shared/models/profile.component';
import {IResource} from '../../../shared/models/resource.interface';
import {ChangeType, IChange, PropertyType} from '../../../shared/models/save-change';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {IBindingContext} from '../../../shared/services/structure-element-binding.service';
import {PCTreeMode, PcTreeService} from '../../services/pc-tree.service';
import {ProfileComponentService} from '../../services/profile-component.service';
import {AddProfileComponentItemComponent} from '../add-profile-component-item/add-profile-component-item.component';

export type BindingLegend = Array<{
  label: string,
  context: IBindingContext,
}>;

export abstract class ProfileComponentStructureEditor<T extends IProfileComponentContext> extends AbstractEditorComponent implements OnDestroy, OnInit {

  type = Type;
  resourceSubject: ReplaySubject<T>;
  public datatypes: Observable<IDisplayElement[]>;
  public segments: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public bindingConfig: Observable<IValueSetBindingConfigMap>;
  public config: Observable<Hl7Config>;
  changes: ReplaySubject<IStructureChanges>;
  username: Observable<string>;
  context$: Observable<T>;
  workspace_s: Subscription;
  hasOrigin$: Observable<boolean>;
  resourceType: Type;
  derived$: Observable<boolean>;
  resource$: Observable<IResource>;
  profileComponentId$: Observable<string>;
  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IHL7EditorMetadata,
    public LoadAction: CoreType<Action>,
    public legend: BindingLegend,
    public columns: HL7v2TreeColumnType[], public hl7V2TreeService: PcTreeService, public pcService: ProfileComponentService,  public dialog: MatDialog) {
    super(editorMetadata, actions$, store);
    this.resourceType = editorMetadata.resourceType;
    this.hasOrigin$ = this.store.select(fromIgamtSelectedSelectors.selectedResourceHasOrigin);
    this.config = this.store.select(getHl7ConfigState);
    this.datatypes = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
    this.segments = this.store.select(fromIgamtDisplaySelectors.selectAllSegments);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.username = this.store.select(fromAuth.selectUsername);
    this.bindingConfig = this.store.select(selectBindingConfig);
    this.bindingConfig.subscribe();
    this.resourceSubject = new ReplaySubject<T>(1);
    this.changes = new ReplaySubject<IStructureChanges>(1);
    this._viewOnly$ = combineLatest(
      this.store.select(fromIgamtSelectors.selectViewOnly),
      this.store.select(fromIgamtSelectors.selectDelta)).pipe(
      map(([vOnly, delta]) => {
        return vOnly || delta;
      }),
    );
    this.derived$ = combineLatest(this.store.select(selectDerived), this.hasOrigin$).pipe(
      map(([derivedIg, elmHadOrigin]) => {
        return derivedIg && elmHadOrigin;
      }),
    );
    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next({ ...current.resource });
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();

    this.context$ = this.resourceSubject.asObservable();
    this.resource$ = this.getContextResource();
    this.profileComponentId$ = this.store.select(selectSelectedProfileComponent).pipe(
      take(1),
      map((x) => x.id),
    );
  }

  ngOnDestroy(): void {
    this.workspace_s.unsubscribe();
  }
  addItems() {
    this.resource$.pipe(
      take(1),
      withLatestFrom(this.context$),
      tap(([resource, context]) => {
        take(1),
        this.hl7V2TreeService.getTree(resource, (context as IProfileComponentContext), PCTreeMode.SELECT, this.repository, true, true, (value) => {
          const structure = [
            {
              data: {
                id: resource.id,
                pathId: resource.id,
                name: resource.name,
                type: resource.type,
                rootPath: { elementId: resource.id },
                position: 0,
              },
              expanded: true,
              children: [...value],
              parent: undefined,
            },
          ];
          const ref = this.dialog.open(AddProfileComponentItemComponent
            , {
              data: {
                context,
                tree: structure,
                repository: this.repository,
              },
            });
          ref.afterClosed().pipe(
            filter((x) => x !== undefined),
            map((x) => {
              const res: IProfileComponentContext = {...(context as IProfileComponentContext) , profileComponentItems : [...context.profileComponentItems ? context.profileComponentItems : [] , ...this.createNewContext(x)]};
              this.resourceSubject.next(res as T);
              this.editorChange({ changes: {}, resource: res}, true);
            }),
          ).subscribe();
        });
      }),
    ).subscribe();
  }

  createNewContext(paths: string[]): IProfileComponentItem[] {
    return paths.map((x) => ({ path: x, itemProperties: []}) );
  }

  onDeactivate() {
  }

  changeIsStruct(change: IChange) {
    return change.propertyType === PropertyType.STRUCTSEGMENT || change.propertyType === PropertyType.FIELD;
  }

  getChangeLocation(change: IChange): string {
    return [
      ...(change.location && change.location !== '' ? [change.location] : []),
      ...(this.changeIsStruct(change) ? [change.propertyValue.id] : []),
    ].join('-');
  }

  changeLocationAndPropHasType(changes: IStructureChanges, prop: PropertyType, location: string, type: ChangeType): boolean {
    return changes[location] && changes[location][prop] && changes[location][prop].changeType === type;
  }

  mergeStructChange(change: IChange, changes: IStructureChanges): IStructureChanges {
    const edits = {
      ...changes,
    };

    const changeLocation = this.getChangeLocation(change);

    // Is it structure delete
    const isStruct = this.changeIsStruct(change);
    const isStructRm = isStruct && change.changeType === ChangeType.DELETE;
    // TODO const isStructAd = isStruct && change.changeType === ChangeType.ADD;
    // TODO const isStructUp = isStruct && change.changeType === ChangeType.UPDATE;
    const hasStructAdd = isStruct && changes[changeLocation] && changes[changeLocation][change.propertyType] && changes[changeLocation][change.propertyType].changeType === ChangeType.ADD;

    // If it is a structure delete, clean other changes
    // If it was added and removed before save clean all
    edits[changeLocation] = {
      ...(isStructRm ? {} : edits[changeLocation]),
      ...(hasStructAdd && isStructRm ? {} : { [change.propertyType]: change }),
    };

    return edits;
  }

  change(change: IChange) {
    combineLatest(this.changes.asObservable(), this.context$).pipe(
      take(1),
      map(([changes, resource]) => {
        this.pcService.applyChange(change, resource);
        this.changes.next({});
        this.resourceSubject.next({ ... resource as IProfileComponentContext } as T);
        this.editorChange({ changes, resource }, true);
      }),
    ).subscribe();
  }
  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.context$,  this.documentRef$, this.profileComponentId$).pipe(
      take(1),
      concatMap(([context, documentRef, pcId]) => {
        return this.pcService.saveContext(pcId, context).pipe(
          mergeMap((message) => {
            return this.pcService.getChildById(pcId, context.id).pipe(
              flatMap((pcContext: IProfileComponentContext) => {
                this.changes.next({});
                this.resourceSubject.next(pcContext as T);
                // new LoadResourceReferences({ resourceType: this.editor.resourceType, id }),
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { changes: {}, resource : pcContext }, updateDate: false }), new fromDam.SetValue({ selected: pcContext })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  abstract saveChanges(id: string, documentRef: IDocumentRef, pcId: string): Observable<Message>;
  abstract getById(id: string): Observable<IProfileComponentContext>;
  abstract getResourceType(): Type;

  convert(changes: IStructureChanges): IChange[] {
    let c = [];
    Object.keys(changes).forEach((id) => {
      c = c.concat(Object.keys(changes[id]).map((prop) => {
        return changes[id][prop];
      }));
    });
    return c;
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;
  abstract resourceSelector(): MemoizedSelectorWithProps<object, { id: string; }, IResource> ;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id }).pipe(
          tap((x) => console.log(x)),
        );
      }),
    );
  }

  ngOnInit() {
  }

  private getContextResource(): Observable<IResource> {
    return this.context$.pipe(
      concatMap((context) => {
        return this.store.select(this.resourceSelector(), { id: context.sourceId });
      }),
    );
  }
}
