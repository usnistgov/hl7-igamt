import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, mergeMap, take, tap } from 'rxjs/operators';
import { IVerificationEnty } from 'src/app/modules/dam-framework';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { EditorVerificationResult, EditorVerify } from 'src/app/modules/dam-framework/store/index';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { CoConstraintEntityService } from '../../../co-constraints/services/co-constraint-entity.service';
import { MessageService } from '../../../dam-framework/services/message.service';
import { ICoConstraintBindingContext } from '../../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { PathService } from '../../../shared/services/path.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintEditorService } from '../../services/co-constraint-editor.service';
import { ConformanceProfileService } from '../../services/conformance-profile.service';

@Component({
  selector: 'app-co-constraints-binding-editor',
  templateUrl: './co-constraints-binding-editor.component.html',
  styleUrls: ['./co-constraints-binding-editor.component.scss'],
})
export class CoConstraintsBindingEditorComponent extends CoConstraintEditorService implements OnInit, OnDestroy {

  s_workspace: Subscription;
  s_tree: Subscription;

  constructor(
    actions$: Actions,
    dialog: MatDialog,
    store: Store<any>,
    repository: StoreResourceRepositoryService,
    private conformanceProfileService: ConformanceProfileService,
    private bindingsService: BindingService,
    private messageService: MessageService,
    private treeService: Hl7V2TreeService,
    pathService: PathService,
    protected ccService: CoConstraintEntityService) {
    super(
      actions$,
      dialog,
      store,
      repository,
      pathService,
      ccService,
      {
        id: EditorID.CP_CC_BINDING,
        title: 'Co-Constraints Binding',
        resourceType: Type.CONFORMANCEPROFILE,
      },
    );

    this.s_workspace = this.currentSynchronized$.pipe(
      tap((data) => {

        // -- Set CP
        this.conformanceProfile.next(data.resource);

        // -- Set Tree
        this.s_tree = this.treeService.getTree(data.resource, this.repository, true, true, (value) => {
          this.structure = [
            {
              data: {
                id: data.resource.id,
                pathId: data.resource.id,
                name: data.resource.name,
                type: data.resource.type,
                rootPath: { elementId: data.resource.id },
                position: 0,
              },
              expanded: true,
              children: [...value],
              parent: undefined,
            },
          ];
        });

        if (data.value && data.value.length > 0) {
          this.openPanel(data.value[0].context.pathId);
        }

        // -- Set bindings value
        this.bindings.next(data.value || []);
        this.bindingsSync.next(_.cloneDeep(data.value) || []);
      }),
    ).subscribe();
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.current$, this.initial$).pipe(
      take(1),
      concatMap(([id, documentRef, current, initial]) => {
        return this.conformanceProfileService.saveChanges(id, documentRef, [
          {
            location: id,
            propertyType: PropertyType.COCONSTRAINTBINDINGS,
            oldPropertyValue: initial.value,
            propertyValue: current.data.value,
            changeType: ChangeType.UPDATE,
          },
        ]).pipe(
          mergeMap((message) => {
            return this.conformanceProfileService.getById(id).pipe(
              flatMap((resource) => {
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { value: resource.coConstraintsBindings, resource }, updateDate: false }), new fromDam.SetValue({ selected: resource })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  onEditorVerify(action: EditorVerify): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$).pipe(
      take(1),
      concatMap(([id, documentRef]) => {
        return this.bindingsService.getVerifyResourceBindings(Type.CONFORMANCEPROFILE, id).pipe(
          flatMap((entries) => {
            return [
              new EditorVerificationResult({
                supported: true,
                entries: entries.map((entry) => ({
                  code: entry.code,
                  message: entry.description,
                  location: entry.locationInfo.name,
                  pathId: entry.locationInfo.pathId,
                  property: entry.locationInfo.property,
                  severity: entry.severity,
                  targetId: entry.target,
                  targetType: entry.targetType,
                }) as IVerificationEnty).filter((entry) => {
                  return [
                    PropertyType.COCONSTRAINTBINDINGS,
                    PropertyType.COCONSTRAINTBINDING_CONTEXT,
                    PropertyType.COCONSTRAINTBINDING_SEGMENT,
                    PropertyType.COCONSTRAINTBINDING_CONDITION,
                    PropertyType.COCONSTRAINTBINDING_TABLE,
                    PropertyType.COCONSTRAINTBINDING_HEADER,
                    PropertyType.COCONSTRAINTBINDING_GROUP,
                    PropertyType.COCONSTRAINTBINDING_ROW,
                    PropertyType.COCONSTRAINTBINDING_CELL,
                  ].includes(entry.property as PropertyType);
                }),
              }),
            ];
          }),
        );
      }),
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(fromIgamtDisplaySelectors.selectMessagesById, { id });
      }),
    );
  }

  emitEditorChange(value: ICoConstraintBindingContext[]): void {
    this.conformanceProfile.pipe(
      take(1),
      tap((cp) => {
        this.editorChange({
          value,
          resource: cp,
        }, true);
      }),
    ).subscribe();
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
