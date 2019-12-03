import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/core/services/message.service';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import { Message, MessageType, UserMessage } from '../../../modules/core/models/message/message.class';
import { IGDisplayInfo, IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { IAddResourceFromFile, ICopyResourceResponse, ICreateCoConstraintGroupResponse } from '../../../modules/ig/models/toc/toc-operation.class';
import { IResource } from '../../../modules/shared/models/resource.interface';
import { ResourceService } from '../../../modules/shared/services/resource.service';
import { RxjsStoreHelperService } from '../../../modules/shared/services/rxjs-store-helper.service';
import { TurnOffLoader, TurnOnLoader } from '../../loader/loader.actions';
import { CreateCoConstraintGroup, CreateCoConstraintGroupFailure, CreateCoConstraintGroupSuccess } from './ig-edit.actions';
import {
  AddResourceFailure,
  AddResourceSuccess,
  CopyResource,
  CopyResourceFailure,
  CopyResourceSuccess,
  DeleteResource,
  DeleteResourceFailure,
  DeleteResourceSuccess,
  EditorSave,
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
  OpenEditor,
  OpenEditorFailure,
  OpenIgMetadataEditorNode,
  OpenNarrativeEditorNode,
  TableOfContentSave,
  TableOfContentSaveFailure,
  TableOfContentSaveSuccess,
  ToggleDelta,
  ToggleDeltaFailure,
  ToggleDeltaSuccess,
  ToolbarSave,
} from './ig-edit.actions';
import {
  selectIgDocument, selectIgId,
  selectSectionDisplayById,
  selectSectionFromIgById,
  selectTableOfContentChanged,
} from './ig-edit.selectors';

@Injectable()
export class IgEditEffects {

  @Effect()
  loadReferences$ = this.actions$.pipe(
    ofType(IgEditActionTypes.LoadResourceReferences),
    concatMap((action: LoadResourceReferences) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.store.select(selectIgId).pipe(
        take(1),
        mergeMap((igId) => {
          return this.resourceService.getResources(action.payload.id, action.payload.resourceType, igId).pipe(
            flatMap((resources: IResource[]) => {
              return [
                new TurnOffLoader(),
                new LoadResourceReferencesSuccess(resources),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new TurnOffLoader(),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.getIgInfo(action.id).pipe(
        flatMap((igInfo: IGDisplayInfo) => {
          return [
            new TurnOffLoader(),
            new IgEditResolverLoadSuccess(igInfo),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
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
    ofType(IgEditActionTypes.ToolbarSave),
    concatMap((action: ToolbarSave) => {
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
                  return of(new EditorSave({
                    tocSaveStatus: true,
                  }));
                },
                filter: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                  return tocSaveSuccess.igId === ig.id;
                },
              },
              [IgEditActionTypes.TableOfContentSaveFailure]: {
                do: (tocSaveFailure: TableOfContentSaveFailure) => {
                  return of(new EditorSave({
                    tocSaveStatus: false,
                  }));
                },
                filter: (tocSaveSuccess: TableOfContentSaveFailure) => {
                  return tocSaveSuccess.igId === ig.id;
                },
              },
            });

          } else {
            return of(new EditorSave({
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
        this.store.select(selectSectionDisplayById, { id: action.payload.id }),
        this.store.select(selectSectionFromIgById, { id: action.payload.id }))
        .pipe(
          take(1),
          flatMap(([elm, section]): Action[] => {
            if (!elm || !section || !elm.id || !section.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, 'Could not find section with ID ' + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
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
            return new OpenEditor({
              id: action.payload.id,
              element: this.igService.igToIDisplayElement(ig),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> = this.igService.addResource(action.payload).pipe(
        flatMap((response: Message<IGDisplayInfo>) => {
          return [
            new TurnOffLoader(),
            new AddResourceSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> = this.igService.importFromFile(action.documentId, action.resourceType, action.targetType, action.file).pipe(
        flatMap((response: Message<IAddResourceFromFile>) => {
          return [
            new TurnOffLoader(),
            new ImportResourceFromFileSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> = this.igService.copyResource(action.payload).pipe(
        flatMap((response: Message<ICopyResourceResponse>) => {
          return [
            new TurnOffLoader(),
            new CopyResourceSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.igService.deleteResource(action.payload.documentId, action.payload.element).pipe(
        flatMap((response: Message<any>) => {
          return [
            new TurnOffLoader(),
            new DeleteResourceSuccess(action.payload.element),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.igService.createCoConstraintGroup(action.payload).pipe(
        flatMap((response: Message<ICreateCoConstraintGroupResponse>) => {
          return [
            new TurnOffLoader(),
            new CreateCoConstraintGroupSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.igService.getDisplay(action.igId, action.delta).pipe(
        flatMap((igInfo: IGDisplayInfo) => {
          return [
            new ToggleDeltaSuccess(igInfo, action.delta),
            new TurnOffLoader(),

          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
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
                    new TurnOffLoader(),
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
    private actions$: Actions<IgEditActions>,
    private igService: IgService,
    private store: Store<any>,
    private message: MessageService,
    private resourceService: ResourceService,
  ) {
  }

}
