import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import {EditorReset} from 'src/app/modules/dam-framework/store/index';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { Message, MessageType, UserMessage } from '../../../modules/dam-framework/models/messages/message.class';
import { RxjsStoreHelperService } from '../../../modules/dam-framework/services/rxjs-store-helper.service';
import { DamWidgetEffect } from '../../../modules/dam-framework/store/dam-widget-effect.class';
import { LoadPayloadData } from '../../../modules/dam-framework/store/data/dam.actions';
import { IDocumentDisplayInfo } from '../../../modules/ig/models/ig/ig-document.class';
import {LIBRARY_EDIT_WIDGET_ID} from '../../../modules/library/components/library-edit-container/library-edit-container.component';
import {ILibrary} from '../../../modules/library/models/library.class';
import {LibraryService} from '../../../modules/library/services/library.service';
import { ResourceService } from '../../../modules/shared/services/resource.service';
import {selectSelectedResource} from '../../dam-igamt/igamt.selected-resource.selectors';
import {selectLoadedDocumentInfo} from '../../dam-igamt/igamt.selectors';
import {IgEditActionTypes} from '../../ig/ig-edit/ig-edit.actions';
import {
  DeactivateElements, DeactivateElementsFailure, DeactivateElementsSuccess,
  LibOpenNarrativeEditorNode, PublishLibrary, PublishLibraryFailure,
  UpdateSections,
} from './library-edit.actions';
import {
  AddResourceFailure,
  AddResourceSuccess,
  CopyResource,
  CopyResourceFailure,
  CopyResourceSuccess,
  DeleteResource,
  DeleteResourceFailure,
  DeleteResourceSuccess,
  ImportResourceFromFileFailure, LibraryEditActions,
  LibraryEditActionTypes,
  LibraryEditResolverLoad,
  LibraryEditResolverLoadFailure,
  LibraryEditResolverLoadSuccess,
  LibraryEditTocAddResource,
  OpenLibraryMetadataEditorNode,
  TableOfContentSave,
  TableOfContentSaveFailure,
  TableOfContentSaveSuccess,
} from './library-edit.actions';
import {
  selectLibrary, selectLibraryId,
  selectSectionFromLibraryById,
  selectTableOfContentChanged,
} from './library-edit.selectors';

@Injectable()
export class LibraryEditEffects extends DamWidgetEffect {

  @Effect()
  UpdateSections$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.UpdateSections),
    concatMap((action: UpdateSections) => {
      return this.store.select(selectLibrary).pipe(
        take(1),
        flatMap((lib) => {
          return this.libraryService.updateSections(action.payload, lib);
        }),
      );
    }),
  );
  @Effect()
  libraryEditResolverLoad$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.LibraryEditResolverLoad),
    switchMap((action: LibraryEditResolverLoad) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.libraryService.getDisplayInfo(action.id).pipe(
        take(1),
        flatMap((libInfo: IDocumentDisplayInfo<ILibrary>) => {
          return [
            new fromDAM.TurnOffLoader(),
            new fromDAM.LoadPayloadData(libInfo.ig),
            this.libraryService.loadRepositoryFromDisplayInfo(libInfo),
            new LibraryEditResolverLoadSuccess(libInfo),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return of(
            new fromDAM.TurnOffLoader(),
            new LibraryEditResolverLoadFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  igEditResolverLoadFailure$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.LibraryEditResolverLoadFailure),
    map((action: LibraryEditResolverLoadFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );
  @Effect()
  publishLibraryFailure = this.actions$.pipe(
    ofType(LibraryEditActionTypes.PublishLibraryFailure),
    map((action: LibraryEditResolverLoadFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  igEditToolbarSave$ = this.actions$.pipe(
    ofType(fromDAM.DamActionTypes.GlobalSave),
    concatMap((action: fromDAM.GlobalSave) => {
      return combineLatest(
        this.store.select(selectTableOfContentChanged),
        this.store.select(selectLibrary),
      ).pipe(
        take(1),
        mergeMap(([changed, ig]) => {
          if (changed) {
            this.store.dispatch(new TableOfContentSave({
              sections: ig.content,
              id: ig.id,
            }));

            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [LibraryEditActionTypes.TableOfContentSaveSuccess]: {
                do: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                  return of(new fromDAM.EditorSave({
                    tocSaveStatus: true,
                  }));
                },
                filter: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                  return tocSaveSuccess.igId === ig.id;
                },
              },
              [LibraryEditActionTypes.TableOfContentSaveFailure]: {
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
    ofType(LibraryEditActionTypes.TableOfContentSave),
    concatMap((action: TableOfContentSave) => {
      return this.store.select(selectLibrary).pipe(
        take(1),
        mergeMap((ig: ILibrary) => {
          return this.libraryService.saveTextSections(ig.id, ig.content).pipe(
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
  libEditOpenNarrativeNode$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.LibOpenNarrativeEditorNode),
    switchMap((action: LibOpenNarrativeEditorNode) => {
      return combineLatest(
        this.store.select(fromIgamtDisplaySelectors.selectSectionDisplayById, { id: action.payload.id }),
        this.store.select(selectSectionFromLibraryById, { id: action.payload.id }))
        .pipe(
          tap((x) => { console.log(x); }),
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
  libEditOpenIgMetadataNode$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.OpenLibraryMetadataEditorNode),
    switchMap((action: OpenLibraryMetadataEditorNode) => {
      return this.store.select(selectLibrary)
        .pipe(
          take(1),
          map((library) => {
            return new fromDAM.OpenEditor({
              id: action.payload.id,
              display: this.libraryService.libraryToIDisplayElement(library),
              editor: action.payload.editor,
              initial: {
                coverPicture: library.metadata.coverPicture,
                title: library.metadata.title,
                subTitle: library.metadata.subTitle,
                version: library.metadata.version,
                organization: library.metadata.orgName,
                authors: library.authors,
                hl7Versions: library.metadata.hl7Versions,
                status: library.status,
                authorNotes: library.authorNotes,
              },
            });
          }),
        );
    }),
  );

  @Effect()
  igAddResourceFailure$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.AddResourceFailure),
    map((action: AddResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  copyResourceFailure$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.CopyResourceFailure),
    map((action: CopyResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  copyResourceSuccess$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.CopyResourceSuccess),
    map((action: CopyResourceSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Resource copied successfully ', null));
    }),
  );
  @Effect()
  deleteResourceFailure$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.DeleteResourceFailure),
    map((action: DeleteResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  importResourceFromFileFailure$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.ImportResourceFromFileFailure),
    map((action: ImportResourceFromFileFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  deleteResourceSuccess$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.DeleteResourceSuccess),
    concatMap((action: DeleteResourceSuccess) => {
      return combineLatest(
        this.store.select(selectLoadedDocumentInfo),
        this.store.select(selectSelectedResource),
      ).pipe(
        take(1),
        map(([libInfo, selected]) => {
          if (selected && selected.id === action.payload.id) {
            this.router.navigate(['/' + 'datatype-library/' + libInfo.documentId] );
          }
          return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Delete Success', null));
        }),
      );
    }),
  );

  @Effect()
  LibraryEditTocAddResource$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.LibraryEditTocAddResource),
    switchMap((action: LibraryEditTocAddResource) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> =
        combineLatest(
          this.libraryService.addResource(action.payload),
          this.store.select(selectLibrary).pipe(take(1))).pipe(
          flatMap(([response, lib]) => {
            return [
              new fromDAM.TurnOffLoader(),
              new LoadPayloadData({
                ...lib,
                datatypeRegistry: response.data.ig.datatypeRegistry,
                valueSetRegistry: response.data.ig.valueSetRegistry,
                content: lib.content,
              }),
              this.libraryService.insertRepositoryFromDisplayInfo(response.data, ['datatypes', 'valueSets']),
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
  libCopyResource$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.CopyResource),
    switchMap((action: CopyResource) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      const doAdd: Observable<Action> =
        combineLatest(
          this.libraryService.copyResource(action.payload),
          this.store.select(selectLibrary).pipe(take(1))).pipe(
          flatMap(([response, lib]) => {
            return [
              new fromDAM.TurnOffLoader(),
              ...this.libraryService.insertRepositoryCopyResource(response.data.reg, response.data.display, lib),
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
  libDeleteResource = this.actions$.pipe(
    ofType(LibraryEditActionTypes.DeleteResource),
    switchMap((action: DeleteResource) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.libraryService.deleteResource(action.payload.documentId, action.payload.element),
        this.store.select(selectSelectedResource),
        this.store.select(selectLibrary).pipe(take(1))).pipe(
        take(1),
        flatMap(([response, selected , lib]) => {
            if (selected && selected.id === action.payload.element.id) {
              return [
                new EditorReset(),
                new fromDAM.TurnOffLoader(),
                ...this.libraryService.deleteOneFromRepository(action.payload.element, lib),
                new DeleteResourceSuccess(action.payload.element),
              ];
            } else {
              return [
                new fromDAM.TurnOffLoader(),
                ...this.libraryService.deleteOneFromRepository(action.payload.element, lib),
                new DeleteResourceSuccess(action.payload.element),
              ];
            }
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
  DeactivateElements = this.actions$.pipe(
    ofType(LibraryEditActionTypes.DeactivateElements),
    switchMap((action: DeactivateElements) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.libraryService.deactivateElements(action.documentId, action.elements),
        this.store.select(selectLibrary).pipe(take(1))).pipe(
        take(1),
        flatMap(([response , lib]) => {
          return [
            new fromDAM.TurnOffLoader(),
            this.message.messageToAction(new Message(MessageType.SUCCESS, 'Resource Deactivated ', null)),
            new LibraryEditResolverLoad(lib.id),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new DeactivateElementsFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  libraryPublish$ = this.actions$.pipe(
    ofType(LibraryEditActionTypes.PublishLibrary),
    switchMap((action: PublishLibrary) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.libraryService.publish(action.libId, action.publicationResult).pipe(
        take(1),
        flatMap((response: Message<string>) => {
          return [
            new fromDAM.TurnOffLoader(),
            this.message.messageToAction(new Message(MessageType.SUCCESS, 'Library Publish Success', null)),
            new LibraryEditResolverLoad(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new PublishLibraryFailure(error),
          );
        }),
      );
    }),
  );
  finalizeAdd(toDoo: Observable<Action>) {
    return combineLatest(
      this.store.select(selectTableOfContentChanged),
      this.store.select(selectLibrary)).pipe(
      take(1),
      mergeMap(([changed, ig]) => {
        if (changed) {
          this.store.dispatch(new TableOfContentSave({
            sections: ig.content,
            id: ig.id,
          }));

          return RxjsStoreHelperService.listenAndReact(this.actions$, {
            [LibraryEditActionTypes.TableOfContentSaveSuccess]: {
              do: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                return toDoo;
              },
              filter: (tocSaveSuccess: TableOfContentSaveSuccess) => {
                return tocSaveSuccess.igId === ig.id;
              },
            },
            [LibraryEditActionTypes.TableOfContentSaveFailure]: {
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
    actions$: Actions<LibraryEditActions>,
    private libraryService: LibraryService,
    private store: Store<any>,
    private message: MessageService,
    private router: Router,
    private resourceService: ResourceService,
  ) {
    super(LIBRARY_EDIT_WIDGET_ID, actions$);
  }

}
