import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { Message, MessageType, UserMessage } from '../../../modules/dam-framework/models/messages/message.class';
import { DamWidgetEffect } from '../../../modules/dam-framework/store/dam-widget-effect.class';
import { LoadPayloadData } from '../../../modules/dam-framework/store/data/dam.actions';
import { IG_EDIT_WIDGET_ID } from '../../../modules/ig/components/ig-edit-container/ig-edit-container.component';
import { IGDisplayInfo, IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { IResource } from '../../../modules/shared/models/resource.interface';
import { ResourceService } from '../../../modules/shared/services/resource.service';
import { RxjsStoreHelperService } from '../../../modules/shared/services/rxjs-store-helper.service';
import { CreateCoConstraintGroup, CreateCoConstraintGroupFailure, CreateCoConstraintGroupSuccess, UpdateSections } from './ig-edit.actions';
import {
  AddResourceFailure,
  AddResourceSuccess,
  CopyResource,
  CopyResourceFailure,
  CopyResourceSuccess,
  DeleteResource,
  DeleteResourceFailure,
  DeleteResourceSuccess,
  IgEditActions,
  IgEditActionTypes,
  IgEditResolverLoad, IgEditResolverLoadFailure,
  IgEditResolverLoadSuccess,
  IgEditTocAddResource,
  ImportResourceFromFile,
  ImportResourceFromFileFailure,
  ImportResourceFromFileSuccess,
  LoadResourceReferences,
  LoadResourceReferencesFailure,
  LoadResourceReferencesSuccess,
  OpenIgMetadataEditorNode,
  OpenNarrativeEditorNode,
  TableOfContentSave,
  TableOfContentSaveFailure,
  TableOfContentSaveSuccess,
  ToggleDelta,
  ToggleDeltaFailure,
  ToggleDeltaSuccess,
} from './ig-edit.actions';
import {
  selectIgDocument, selectIgId,
  selectSectionFromIgById,
  selectTableOfContentChanged,
} from './ig-edit.selectors';

@Injectable()
export class IgEditEffects extends DamWidgetEffect {

  @Effect()
  UpdateSections$ = this.actions$.pipe(
    ofType(IgEditActionTypes.UpdateSections),
    concatMap((action: UpdateSections) => {
      return this.store.select(selectIgDocument).pipe(
        take(1),
        flatMap((ig) => {
          return this.igService.updateSections(action.payload, ig);
        }),
      );
    }),
  );

  @Effect()
  loadReferences$ = this.actions$.pipe(
    ofType(IgEditActionTypes.LoadResourceReferences),
    concatMap((action: LoadResourceReferences) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.store.select(selectIgId).pipe(
        take(1),
        mergeMap((igId) => {
          return this.resourceService.getResources(action.payload.id, action.payload.resourceType, igId).pipe(
            take(1),
            flatMap((resources: IResource[]) => {
              return [
                new fromDAM.TurnOffLoader(),
                new fromDAM.InsertResourcesInRepostory({
                  collections: [{
                    key: 'resources',
                    values: resources,
                  }],
                }),
                new LoadResourceReferencesSuccess(resources),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new fromDAM.TurnOffLoader(),
                new LoadResourceReferencesFailure(error),
              );
            }),
          );
        }),
      );
    }));

  @Effect()
  loadReferencesFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.LoadResourceReferencesFailure),
    map((action: LoadResourceReferencesFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );
  @Effect()
  igEditResolverLoad$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoad),
    switchMap((action: IgEditResolverLoad) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.getIgInfo(action.id).pipe(
        take(1),
        flatMap((igInfo: IGDisplayInfo) => {
          return [
            new fromDAM.TurnOffLoader(),
            new fromDAM.LoadPayloadData(igInfo.ig),
            this.igService.loadRepositoryFromIgDisplayInfo(igInfo),
            new IgEditResolverLoadSuccess(igInfo),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return of(
            new fromDAM.TurnOffLoader(),
            new IgEditResolverLoadFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  igEditResolverLoadFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoadFailure),
    map((action: IgEditResolverLoadFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  igEditToolbarSave$ = this.actions$.pipe(
    ofType(fromDAM.DamActionTypes.GlobalSave),
    concatMap((action: fromDAM.GlobalSave) => {
      return combineLatest(
        this.store.select(selectTableOfContentChanged),
        this.store.select(selectIgDocument),
      ).pipe(
        take(1),
        mergeMap(([changed, ig]) => {
          if (changed) {
            this.store.dispatch(new TableOfContentSave({
              sections: ig.content,
              id: ig.id,
            }));

            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [IgEditActionTypes.TableOfContentSaveSuccess]: {
                do: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                  return of(new fromDAM.EditorSave({
                    tocSaveStatus: true,
                  }));
                },
                filter: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                  return tocSaveSuccess.igId === ig.id;
                },
              },
              [IgEditActionTypes.TableOfContentSaveFailure]: {
                do: (tocSaveFailure: TableOfContentSaveFailure) => {
                  return of(new fromDAM.EditorSave({
                    tocSaveStatus: false,
                  }));
                },
                filter: (tocSaveSuccess: TableOfContentSaveFailure) => {
                  return tocSaveSuccess.igId === ig.id;
                },
              },
            });

          } else {
            return of(new fromDAM.EditorSave({
              tocSaveStatus: true,
            }));
          }
        }),
      );
    }),
  );
  @Effect()
  igEditSaveTOC$ = this.actions$.pipe(
    ofType(IgEditActionTypes.TableOfContentSave),
    concatMap((action: TableOfContentSave) => {
      return this.store.select(selectIgDocument).pipe(
        take(1),
        mergeMap((ig: IgDocument) => {
          return this.igService.saveTextSections(ig.id, ig.content).pipe(
            flatMap((message) => {
              return [
                this.message.messageToAction(message),
                new fromDAM.SetValue({
                  tableOfContentEdit: {
                    changed: false,
                  },
                }),
                new TableOfContentSaveSuccess(ig.id),
              ];
            }),
            catchError((error) => {
              return of(this.message.actionFromError(error), new TableOfContentSaveFailure(ig.id));
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  igEditOpenNarrativeNode$ = this.actions$.pipe(
    ofType(IgEditActionTypes.OpenNarrativeEditorNode),
    switchMap((action: OpenNarrativeEditorNode) => {
      return combineLatest(
        this.store.select(fromIgamtDisplaySelectors.selectSectionDisplayById, { id: action.payload.id }),
        this.store.select(selectSectionFromIgById, { id: action.payload.id }))
        .pipe(
          take(1),
          flatMap(([elm, section]): Action[] => {
            if (!elm || !section || !elm.id || !section.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, 'Could not find section with ID ' + action.payload.id)),
                new fromDAM.OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new fromDAM.OpenEditor({
                  id: action.payload.id,
                  display: elm,
                  editor: action.payload.editor,
                  initial: {
                    id: section.id,
                    label: section.label,
                    description: section.description,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );

  @Effect()
  igEditOpenIgMetadataNode$ = this.actions$.pipe(
    ofType(IgEditActionTypes.OpenIgMetadataEditorNode),
    switchMap((action: OpenIgMetadataEditorNode) => {
      return this.store.select(selectIgDocument)
        .pipe(
          take(1),
          map((ig) => {
            return new fromDAM.OpenEditor({
              id: action.payload.id,
              display: this.igService.igToIDisplayElement(ig),
              editor: action.payload.editor,
              initial: {
                coverPicture: ig.metadata.coverPicture,
                title: ig.metadata.title,
                subTitle: ig.metadata.subTitle,
                version: ig.metadata.version,
                organization: ig.metadata.orgName,
                authors: ig.authors,
                hl7Versions: ig.metadata.hl7Versions,
                status: ig.status,
                implementationNotes: ig.authorNotes,
              },
            });
          }),
        );
    }),
  );

  @Effect()
  igAddResourceFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.AddResourceFailure),
    map((action: AddResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  copyResourceFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CopyResourceFailure),
    map((action: CopyResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  copyResourceSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CopyResourceSuccess),
    map((action: CopyResourceSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Resource copied successfully ', null));
    }),
  );

  @Effect()
  importResourceFromFileSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.ImportResourceFromFileSuccess),
    map((action: ImportResourceFromFileSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Resource imported successfully ', null));
    }),
  );

  @Effect()
  deleteResourceFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.DeleteResourceFailure),
    map((action: DeleteResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  importResourceFromFileFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.ImportResourceFromFileFailure),
    map((action: ImportResourceFromFileFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  deleteResourceSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.DeleteResourceSuccess),
    map((action: DeleteResourceSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Delete Success', null));
    }),
  );

  @Effect()
  IgEditTocAddResource$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditTocAddResource),
    switchMap((action: IgEditTocAddResource) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> =
        combineLatest(
          this.igService.addResource(action.payload),
          this.store.select(selectIgDocument).pipe(take(1))).pipe(
            flatMap(([response, ig]) => {
              return [
                new fromDAM.TurnOffLoader(),
                new LoadPayloadData({
                  ...ig,
                  conformanceProfileRegistry: response.data.ig.conformanceProfileRegistry,
                  datatypeRegistry: response.data.ig.datatypeRegistry,
                  segmentRegistry: response.data.ig.segmentRegistry,
                  valueSetRegistry: response.data.ig.valueSetRegistry,
                  coConstraintGroupRegistry: response.data.ig.coConstraintGroupRegistry,
                  content: ig.content,
                }),
                this.igService.loadRepositoryFromIgDisplayInfo(response.data, ['datatypes', 'segments', 'valueSets', 'messages', 'coConstraintGroups']),
                new AddResourceSuccess(response.data),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new fromDAM.TurnOffLoader(),
                new AddResourceFailure(error),
              );
            }),
          );
      return this.finalizeAdd(doAdd);
    }),
  );

  @Effect()
  CopyResourceSuccess = this.actions$.pipe(
    ofType(IgEditActionTypes.ImportResourceFromFile),
    switchMap((action: ImportResourceFromFile) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> =
        combineLatest(
          this.igService.importFromFile(action.documentId, action.resourceType, action.targetType, action.file),
          this.store.select(selectIgDocument).pipe(take(1)))
          .pipe(
            flatMap(([response, ig]) => {
              return [
                new fromDAM.TurnOffLoader(),
                ...this.igService.insertRepositoryCopyResource(response.data.reg, response.data.display, ig),
                new ImportResourceFromFileSuccess(response.data),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new fromDAM.TurnOffLoader(),
                new ImportResourceFromFileFailure(error),
              );
            }),
          );
      return this.finalizeAdd(doAdd);
    }),
  );

  @Effect()
  IgCopyResource$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CopyResource),
    switchMap((action: CopyResource) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> =
        combineLatest(
          this.igService.copyResource(action.payload),
          this.store.select(selectIgDocument).pipe(take(1))).pipe(
            flatMap(([response, ig]) => {
              return [
                new fromDAM.TurnOffLoader(),
                ...this.igService.insertRepositoryCopyResource(response.data.reg, response.data.display, ig),
                new CopyResourceSuccess(response.data),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new fromDAM.TurnOffLoader(),
                new CopyResourceFailure(error),
              );
            }),
          );
      return this.finalizeAdd(doAdd);
    }),
  );

  @Effect()
  igDeleteResource = this.actions$.pipe(
    ofType(IgEditActionTypes.DeleteResource),
    switchMap((action: DeleteResource) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.igService.deleteResource(action.payload.documentId, action.payload.element),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, ig]) => {
            return [
              new fromDAM.TurnOffLoader(),
              ...this.igService.deleteOneFromRepository(action.payload.element, ig),
              new DeleteResourceSuccess(action.payload.element),
            ];
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              new fromDAM.TurnOffLoader(),
              new DeleteResourceFailure(error),
            );
          }),
        );
    }),
  );

  @Effect()
  igCreateCoConstraintGroup = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateCoConstraintGroup),
    switchMap((action: CreateCoConstraintGroup) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.igService.createCoConstraintGroup(action.payload),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, ig]) => {
            return [
              new fromDAM.TurnOffLoader(),
              this.igService.insertRepositoryCopyResource(response.data.registry, response.data.display, ig),
              new CreateCoConstraintGroupSuccess(response.data),
            ];
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              new fromDAM.TurnOffLoader(),
              new CreateCoConstraintGroupFailure(error),
            );
          }),
        );
    }),
  );

  @Effect()
  coConstraintGroupFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateCoConstraintGroupFailure),
    map((action: CreateCoConstraintGroupFailure) => {
      return this.message.actionFromError(action.payload);
    }),
  );

  @Effect()
  coConstraintGroupSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateCoConstraintGroupSuccess),
    map((action: CreateCoConstraintGroupSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'CoConstraint Group Created Successfully', null));
    }),
  );

  @Effect()
  displayDelta$ = this.actions$.pipe(
    ofType(IgEditActionTypes.ToggleDelta),
    switchMap((action: ToggleDelta) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.igService.getDisplay(action.igId, action.delta).pipe(
        flatMap((igInfo: IGDisplayInfo) => {
          return [
            this.igService.loadRepositoryFromIgDisplayInfo(igInfo),
            new fromDAM.SetValue({
              delta: action.delta,
            }),
            new ToggleDeltaSuccess(igInfo, action.delta),
            new fromDAM.TurnOffLoader(),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new ToggleDeltaFailure(error),
          );
        }),
      );
    }),
  );

  finalizeAdd(toDoo: Observable<Action>) {
    return combineLatest(
      this.store.select(selectTableOfContentChanged),
      this.store.select(selectIgDocument)).pipe(
        take(1),
        mergeMap(([changed, ig]) => {
          if (changed) {
            this.store.dispatch(new TableOfContentSave({
              sections: ig.content,
              id: ig.id,
            }));

            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [IgEditActionTypes.TableOfContentSaveSuccess]: {
                do: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                  return toDoo;
                },
                filter: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                  return tocSaveSuccess.igId === ig.id;
                },
              },
              [IgEditActionTypes.TableOfContentSaveFailure]: {
                do: (tocSaveFailure: TableOfContentSaveFailure) => {
                  return of(
                    new fromDAM.TurnOffLoader(),
                    this.message.userMessageToAction(new UserMessage(MessageType.FAILED, 'Could not add resources due to failure to save table of content')),
                  );
                },
                filter: (tocSaveSuccess: TableOfContentSaveFailure) => {
                  return tocSaveSuccess.igId === ig.id;
                },
              },
            });
          } else {
            return toDoo;
          }
        }),
      );
  }

  constructor(
    actions$: Actions<IgEditActions>,
    private igService: IgService,
    private store: Store<any>,
    private message: MessageService,
    private resourceService: ResourceService,
  ) {
    super(IG_EDIT_WIDGET_ID, actions$);
  }

}
