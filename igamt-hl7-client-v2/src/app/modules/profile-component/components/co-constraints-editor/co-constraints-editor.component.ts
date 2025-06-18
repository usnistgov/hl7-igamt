import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, pluck, take, tap } from 'rxjs/operators';
import { CoConstraintEntityService } from 'src/app/modules/co-constraints/services/co-constraint-entity.service';
import { CoConstraintEditorService } from 'src/app/modules/conformance-profile/services/co-constraint-editor.service';
import { Message, MessageType } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IHL7v2TreeNode } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { ICoConstraintBindingContext } from 'src/app/modules/shared/models/co-constraint.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import { PathService } from 'src/app/modules/shared/services/path.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { selectContextById } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { selectProfileComponentContext, selectSelectedProfileComponent } from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { ProfileComponentService } from '../../services/profile-component.service';

export const PC_CC_EDITOR_METADATA = {
  id: EditorID.PC_CONFP_CTX_CC,
  title: 'Co-Constraints',
  resourceType: Type.MESSAGECONTEXT,
};

@Component({
  selector: 'app-co-constraints-editor',
  templateUrl: './co-constraints-editor.component.html',
  styleUrls: ['./co-constraints-editor.component.scss'],
})
export class CoConstraintsEditorComponent extends CoConstraintEditorService implements OnInit, OnDestroy {

  profileComponentBindings$: Observable<ICoConstraintBindingContext[]>;
  profileComponentBindings: ReplaySubject<ICoConstraintBindingContext[]>;
  profileComponentActive$: BehaviorSubject<boolean>;
  profileComponentId$: Observable<string>;

  s_workspace: Subscription;
  s_tree: Subscription;
  editable$: Observable<boolean>;

  constructor(
    actions$: Actions,
    dialog: MatDialog,
    store: Store<any>,
    repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    private treeService: Hl7V2TreeService,
    pathService: PathService,
    private pcService: ProfileComponentService,
    protected ccService: CoConstraintEntityService) {
    super(
      actions$,
      dialog,
      store,
      repository,
      pathService,
      ccService,
      PC_CC_EDITOR_METADATA,
    );

    this.profileComponentActive$ = new BehaviorSubject<boolean>(false);
    this.editable$ = combineLatest(
      this.viewOnly$,
      this.profileComponentActive$,
    ).pipe(
      map(([vOnly, active]) => {
        return !vOnly && active;
      }),
    );

    this.profileComponentId$ = this.store.select(selectSelectedProfileComponent).pipe(
      pluck('id'),
    );

    this.s_workspace = this.currentSynchronized$.pipe(
      mergeMap((data) => {
        return this.store.select(selectProfileComponentContext).pipe(
          take(1),
          tap((profileComponentContext) => {
            const resource: IConformanceProfile = data.resource;
            const profileComponent: ICoConstraintBindingContext[] = data.profileComponent;
            this.profileComponentContext = profileComponentContext;
            this.transformer = this.pcService.getProfileComponentItemTransformer(profileComponentContext);
            this.referenceChangeMap = this.pcService.getRefChangeMap(profileComponentContext);

            // -- Set CP
            this.conformanceProfile.next(resource);

            // -- Set Tree
            this.s_tree = this.treeService.getTree(resource, this.repository, true, true, (value) => {
              this.pcService.applyTransformer(value, this.transformer).pipe(
                take(1),
                tap((nodes: IHL7v2TreeNode[]) => {
                  this.structure = [
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
                      children: [...nodes],
                      parent: undefined,
                    },
                  ];
                }),
              ).subscribe();
            });

            if (profileComponent) {
              if (profileComponent.length > 0) {
                this.openPanel(profileComponent[0].context.pathId);
              }
              this.profileComponentActive$.next(true);
              this.bindings.next(profileComponent);
              this.bindingsSync.next(profileComponent);
            } else {
              this.pickResourceBindings(resource, false);
            }
          }),
        );
      }),
    ).subscribe();
  }

  pickResourceBindings(resource: IConformanceProfile, active: boolean): ICoConstraintBindingContext[] {
    if (resource.coConstraintsBindings && resource.coConstraintsBindings.length > 0) {
      this.openPanel(resource.coConstraintsBindings[0].context.pathId);
    }
    this.profileComponentActive$.next(active);
    this.bindings.next(resource.coConstraintsBindings || []);
    this.bindingsSync.next(_.cloneDeep(resource.coConstraintsBindings) || []);
    return resource.coConstraintsBindings;
  }

  setProfileComponent(activate: boolean) {
    this.profileComponentActive$.pipe(
      take(1),
      flatMap((active) => {
        if (active !== activate) {
          return this.conformanceProfile.pipe(
            take(1),
            map((resource) => {
              const bindings = this.pickResourceBindings(resource, activate);
              this.emitEditorChange(activate ? bindings : undefined);
            }),
          );
        }
      }),
    ).subscribe();
  }

  emitEditorChange(value: ICoConstraintBindingContext[]): void {
    this.conformanceProfile.pipe(
      take(1),
      tap((cp) => {
        this.editorChange({
          profileComponent: value,
          resource: cp,
        }, true);
      }),
    ).subscribe();
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectContextById, { id });
      }),
    );
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.profileComponentId$, this.current$).pipe(
      take(1),
      concatMap(([id, pcId, current]) => {
        const save = current.data.profileComponent ? this.pcService.saveCoConstraintBindings(pcId, id, {
          propertyKey: PropertyType.COCONSTRAINTBINDINGS,
          bindings: current.data.profileComponent,
        }) : this.pcService.removeCoConstraintBindings(pcId, id);

        return save.pipe(
          flatMap((context) => {
            return [
              this.messageService.messageToAction(new Message<any>(MessageType.SUCCESS, 'Co-Constraints saved successfully!', null)),
              new fromDam.EditorUpdate({ value: current.data, updateDate: false }),
              new fromDam.SetValue({ context }),
            ];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.s_workspace.unsubscribe();
    this.s_changes.unsubscribe();
    if (this.s_tree) {
      this.s_tree.unsubscribe();
    }
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
