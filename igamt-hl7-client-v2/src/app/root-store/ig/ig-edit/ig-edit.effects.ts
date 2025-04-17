import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorReset } from 'src/app/modules/dam-framework/store/index';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IDocumentConfig } from 'src/app/modules/document/models/document/IDocument.interface';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { VerificationType } from 'src/app/modules/shared/models/verification.interface';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { Message, MessageType, UserMessage } from '../../../modules/dam-framework/models/messages/message.class';
import { RxjsStoreHelperService } from '../../../modules/dam-framework/services/rxjs-store-helper.service';
import { DamWidgetEffect } from '../../../modules/dam-framework/store/dam-widget-effect.class';
import { LoadPayloadData } from '../../../modules/dam-framework/store/data/dam.actions';
import { IG_EDIT_WIDGET_ID } from '../../../modules/ig/components/ig-edit-container/ig-edit-container.component';
import { IDocumentDisplayInfo, IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { selectLoadedDocumentInfo, selectWorkspaceActive } from '../../dam-igamt/igamt.selectors';
import { SetValue } from './../../../modules/dam-framework/store/data/dam.actions';
import {
  AddProfileComponentContext,
  AddProfileComponentContextFailure,
  AddProfileComponentContextSuccess,
  CreateCoConstraintGroup,
  CreateCoConstraintGroupFailure,
  CreateCoConstraintGroupSuccess, CreateCompositeProfile, CreateCompositeProfileFailure, CreateCompositeProfileSuccess,
  CreateProfileComponent,
  CreateProfileComponentFailure,
  CreateProfileComponentSuccess,
  DeleteProfileComponentContext, DeleteProfileComponentContextFailure,
  DeleteResources,
  DeleteResourcesFailure,
  DeleteResourcesSuccess,
  GroupValueSets,
  GroupValueSetsSuccess,
  OpenConformanceStatementSummaryEditorNode,
  OpenIgVerificationEditor,
  OpenValueSetsSummaryEditorNode,
  RefreshUpdateInfo,
  UpdateDocumentConfig,
  UpdateDocumentConfigFailure,
  UpdateDocumentConfigSuccess,
  UpdateSections,
  VerifyIg,
} from './ig-edit.actions';
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
  selectIgDocument,
  selectSectionFromIgById,
  selectTableOfContentChanged,
} from './ig-edit.selectors';

@Injectable()
export class IgEditEffects extends DamWidgetEffect {

  constructor(
    actions$: Actions<IgEditActions>,
    private igService: IgService,
    private store: Store<any>,
    private message: MessageService,
    private router: Router) {
    super(IG_EDIT_WIDGET_ID, actions$);
  }

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
  igEditResolverLoad$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoad),
    switchMap((action: IgEditResolverLoad) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.getIgInfo(action.id).pipe(
        take(1),
        flatMap((igInfo: IDocumentDisplayInfo<IgDocument>) => {
          return [
            new fromDAM.TurnOffLoader(),
            new fromDAM.LoadPayloadData({
              ...igInfo.ig,
            }),
            new fromDAM.SetValue({
              igLocation: {
                id: igInfo.ig.id,
                location: igInfo.documentLocation,
              },
              documentVersionSyncToken: igInfo.resourceVersionSyncToken,
            }),
            this.igService.loadRepositoryFromIgDisplayInfo(igInfo),
            new IgEditResolverLoadSuccess(igInfo),
            new VerifyIg({ id: action.id, resourceType: Type.IGDOCUMENT, verificationType: VerificationType.VERIFICATION }),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
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
  onSaveSuccess$ = this.actions$.pipe(
    ofType(
      fromDAM.DamActionTypes.EditorSaveSuccess,
      IgEditActionTypes.TableOfContentSaveSuccess,
      IgEditActionTypes.CopyResourceSuccess,
      IgEditActionTypes.AddResourceSuccess,
      IgEditActionTypes.DeleteResourceSuccess,
      IgEditActionTypes.CreateProfileComponentSuccess,
      IgEditActionTypes.ImportResourceFromFileSuccess,
      IgEditActionTypes.DeleteResourcesSuccess,
      IgEditActionTypes.CreateCoConstraintGroupSuccess,
      IgEditActionTypes.AddProfileComponentContextSuccess,
      IgEditActionTypes.CreateCompositeProfileSuccess,
      IgEditActionTypes.UpdateDocumentConfigSuccess),
    flatMap((action) => {
      return this.store.select(selectLoadedDocumentInfo).pipe(
        take(1),
        flatMap((doc) => {
          return this.igService.getUpdateInfo(doc.documentId).pipe(
            flatMap((v) => {
              return [
                new RefreshUpdateInfo(v),
                new VerifyIg({ id: doc.documentId, resourceType: Type.IGDOCUMENT, verificationType: VerificationType.VERIFICATION }),
              ];
            }),
          );
        }),
      );
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
  openConformanceStatementSummaryEditorNode$ = this.actions$.pipe(
    ofType(IgEditActionTypes.OpenConformanceStatementSummaryEditorNode),
    switchMap((action: OpenConformanceStatementSummaryEditorNode) => {
      return combineLatest(
        this.store.select(selectIgDocument),
        this.igService.getConformanceStatementSummary(action.payload.id))
        .pipe(
          take(1),
          map(([ig, cs]) => {
            return new fromDAM.OpenEditor({
              id: action.payload.id,
              display: this.igService.igToIDisplayElement(ig),
              editor: action.payload.editor,
              initial: {
                summary: cs,
                changes: {},
              },
            });
          }),
        );
    }),
  );

  @Effect()
  openValueSetsEditorNode$ = this.actions$.pipe(
    ofType(IgEditActionTypes.OpenValueSetsSummaryEditorNode),
    switchMap((action: OpenValueSetsSummaryEditorNode) => {
      return combineLatest(
        this.store.select(selectIgDocument))
        .pipe(
          take(1),
          map(([ig]) => {
            return new fromDAM.OpenEditor({
              id: action.payload.id,
              display: this.igService.igToIDisplayElement(ig),
              editor: action.payload.editor,
              initial: {
                summary: {},
                changes: {},
              },
            });
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
          map((ig: IgDocument) => {
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
                authorNotes: ig.authorNotes,
                customAttributes: ig.metadata.customAttributes ? ig.metadata.customAttributes : [],
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
      if (action.redirect) {
        this.router.navigate([action.url]);
      }
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
                this.igService.insertRepositoryFromIgDisplayInfo(response.data, ['datatypes', 'segments', 'valueSets', 'messages', 'coConstraintGroups']),
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
        this.store.select(selectWorkspaceActive),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, selected, ig]) => {
            const url = '/' + 'ig/' + ig.id;

            let redirect: boolean = selected && selected.display && selected.display.id === action.payload.element.id;
            // tslint:disable-next-line:no-collapsible-if
            if (action.payload.element.children && selected && selected.display && selected.display.id) {
              redirect = redirect || action.payload.element.children.filter((x) => x.id === selected.display.id).length > 0;
            }
            if (redirect) {
              return [
                new EditorReset(),
                new fromDAM.TurnOffLoader(),
                ...this.igService.deleteOneFromRepository(action.payload.element, ig),
                new DeleteResourceSuccess(action.payload.element, true, url),
              ];
            } else {
              return [
                new fromDAM.TurnOffLoader(),
                ...this.igService.deleteOneFromRepository(action.payload.element, ig),
                new DeleteResourceSuccess(action.payload.element, false, url),
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
              ...this.igService.insertRepositoryCopyResource(response.data.registry, response.data.display, ig),
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
  igCreateProfileComponent = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateProfileComponent),
    switchMap((action: CreateProfileComponent) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.igService.createProfileComponent(action.payload),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, ig]) => {
            return [
              new fromDAM.TurnOffLoader(),
              ...this.igService.insertRepositoryCopyResource(response.data.registry, response.data.display, ig),
              new CreateProfileComponentSuccess(response.data),
            ];
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              new fromDAM.TurnOffLoader(),
              new CreateProfileComponentFailure(error),
            );
          }),
        );
    }),
  );

  @Effect()
  createProfileComponentFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateProfileComponentFailure),
    map((action: CreateProfileComponentFailure) => {
      return this.message.actionFromError(action.payload);
    }),
  );

  @Effect()
  createProfileComponentSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateProfileComponentSuccess),
    map((action: CreateProfileComponentSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Profile Component Created Successfully', null));
    }),
  );
  @Effect()
  addProfileComponentContext = this.actions$.pipe(
    ofType(IgEditActionTypes.AddProfileComponentContext),
    switchMap((action: AddProfileComponentContext) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.igService.addProfileComponentContext(action.payload),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, ig]) => {
            return [
              new fromDAM.TurnOffLoader(),
              ...this.igService.insertRepositoryCopyResource(response.data.registry, response.data.display, ig),
              new AddProfileComponentContextSuccess(response.data),
            ];
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              new fromDAM.TurnOffLoader(),
              new AddProfileComponentContextFailure(error),
            );
          }),
        );
    }),
  );

  @Effect()
  addProfileComponentContextFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.AddProfileComponentContextFailure),
    map((action: CreateProfileComponentFailure) => {
      return this.message.actionFromError(action.payload);
    }),
  );

  @Effect()
  addProfileComponentContextSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.AddProfileComponentContextSuccess),
    map((action: CreateProfileComponentSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Profile Component Created Successfully', null));
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
        flatMap((igInfo: IDocumentDisplayInfo<IgDocument>) => {
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

  @Effect()
  deleteProfileComponentContext = this.actions$.pipe(
    ofType(IgEditActionTypes.DeleteProfileComponentContext),
    switchMap((action: DeleteProfileComponentContext) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.igService.deleteContext(action.payload.documentId, action.payload.element, action.payload.parent),
        this.store.select(selectWorkspaceActive),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, selected, ig]) => {
            const url = '/' + 'ig/' + ig.id + '/profilecomponent/' + response.id;
            const redirect: boolean = selected && selected.display && selected.display.id === action.payload.element.id;
            if (redirect) {
              return [
                new EditorReset(),
                new fromDAM.TurnOffLoader(),
                ...this.igService.insertRepositoryCopyResource(ig.profileComponentRegistry, response, ig),
                new DeleteResourceSuccess(action.payload.element, true, url),
              ];
            } else {
              return [
                new fromDAM.TurnOffLoader(),
                ...this.igService.insertRepositoryCopyResource(ig.profileComponentRegistry, response, ig),
                new DeleteResourceSuccess(action.payload.element, false, url),
              ];
            }
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              new fromDAM.TurnOffLoader(),
              new DeleteProfileComponentContextFailure(error),
            );
          }),
        );
    }),
  );

  @Effect()
  DeleteProfileComponentContextFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.DeleteProfileComponentContextFailure),
    map((action: DeleteProfileComponentContextFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  igCreateCompositeProfile = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateCompositeProfile),
    switchMap((action: CreateCompositeProfile) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.igService.createCompositeProfile(action.payload),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, ig]) => {
            return [
              new fromDAM.TurnOffLoader(),
              ...this.igService.insertRepositoryCopyResource(response.data.registry, response.data.display, ig),
              new CreateCompositeProfileSuccess(response.data),
            ];
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              new fromDAM.TurnOffLoader(),
              new CreateCompositeProfileFailure(error),
            );
          }),
        );
    }),
  );

  @Effect()
  igCreateCompositeProfileFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateCompositeProfileFailure),
    map((action: CreateCompositeProfileFailure) => {
      return this.message.actionFromError(action.payload);
    }),
  );

  @Effect()
  igCreateCompositeProfileSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CreateCompositeProfileSuccess),
    map((action: CreateProfileComponentSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Composite profile Created Successfully', null));
    }),
  );

  @Effect()
  igDeleteResources = this.actions$.pipe(
    ofType(IgEditActionTypes.DeleteResources),
    switchMap((action: DeleteResources) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.igService.deleteResources(action.payload.documentId, action.payload.ids, action.payload.type),
        this.store.select(selectWorkspaceActive),
        this.store.select(selectIgDocument).pipe(take(1))).pipe(
          take(1),
          flatMap(([response, selected, ig]) => {
            const url = '/' + 'ig/' + ig.id;

            const redirect: boolean = selected && selected.display && action.payload.ids.indexOf(selected.display.id) > -1;

            if (redirect) {
              return [
                new EditorReset(),
                new fromDAM.TurnOffLoader(),
                ...this.igService.deleteListFromRepository(action.payload.ids, ig, action.payload.type),
                new DeleteResourcesSuccess(action.payload.ids, true, url),
              ];
            } else {
              return [
                new fromDAM.TurnOffLoader(),
                ...this.igService.deleteListFromRepository(action.payload.ids, ig, action.payload.type),
                new DeleteResourcesSuccess(action.payload.ids, false, url),
              ];
            }
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              new fromDAM.TurnOffLoader(),
              new DeleteResourcesFailure(error),
            );
          }),
        );
    }),
  );

  @Effect()
  refreshUpdateInfo$ = this.actions$.pipe(
    ofType(IgEditActionTypes.RefreshUpdateInfo),
    flatMap((action: RefreshUpdateInfo) => {
      return this.store.select(selectIgDocument).pipe(
        take(1),
        flatMap((ig) => {
          return [
            new LoadPayloadData({ ...ig, updateDate: action.payload.updateDate }),
            new SetValue({ documentVersionSyncToken: action.payload.resourceVersionSyncToken }),
          ];
        }),
      );
    }),
  );

  @Effect()
  deleteResourcesSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.DeleteResourcesSuccess),
    map((act: DeleteResourcesSuccess) => {
      if (act.redirect) {
        this.router.navigate([act.url]);
      }
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Delete Resources Success', null));
    }),
  );

  @Effect()
  verifyIg = this.actions$.pipe(
    ofType(IgEditActionTypes.VerifiyIg),
    switchMap((action: VerifyIg) => {
      this.store.dispatch(new fromDAM.SetValue({ verificationStatus: { loading: true } }));

      return this.igService.verify(action.payload).pipe(
        flatMap((response) => {
          return [
            new fromDAM.SetValue({ verificationResult: response }),
            new fromDAM.SetValue({ verificationStatus: { loading: false, failed: false, failure: '' } }),
            new fromDAM.TurnOffLoader(),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.SetValue({ verificationStatus: { loading: false, failed: true, failure: this.message.fromError(error).message } }),
          );
        }),
      );
    }));

  @Effect()
  openVerificationEditor$ = this.actions$.pipe(
    ofType(IgEditActionTypes.OpenIgVerificationEditor),
    mergeMap((action: OpenIgVerificationEditor) => {
      return combineLatest(
        this.store.select(selectIgDocument),
      )
        .pipe(
          take(1),
          map(([ig]) => {
            return new fromDAM.OpenEditor({
              id: action.payload.id,
              display: this.igService.igToIDisplayElement(ig),
              editor: action.payload.editor,
              initial: {},
            });
          }),
        );
    }),
  );

  @Effect()
  UpdateConfig$ = this.actions$.pipe(
    ofType(IgEditActionTypes.UpdateDocumentConfig),
    switchMap((action: UpdateDocumentConfig) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.updateConfig(action.payload.id, action.payload.config).pipe(
        take(1),
        flatMap((config: IDocumentConfig) => {
          return [
            new fromDAM.TurnOffLoader(),
            new UpdateDocumentConfigSuccess(config),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new UpdateDocumentConfigFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  UpdateDocumentConfigSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.UpdateDocumentConfigSuccess),
    mergeMap((action: UpdateDocumentConfigSuccess) => {
      return this.store.select(fromDAM.selectPayloadData).pipe(
        take(1),
        map((ig) => {
          return new LoadPayloadData({ ...ig, documentConfig: action.payload });
        }),
      );
    }),
  );


  @Effect()
  GroupValueSets$ = this.actions$.pipe(
    ofType(IgEditActionTypes.GroupValueSets),
    switchMap((action: GroupValueSets) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.igService.groupValueSets(action.payload.id, action.payload.groups).pipe(
        take(1),
        flatMap((groups: any) => {
          return [
            new fromDAM.TurnOffLoader(),
            new GroupValueSetsSuccess(action.payload.groups),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
          );
        }),
      );
    }),
  );

  @Effect()
  GroupValueSetsSuccess$ = this.actions$.pipe(
    ofType(IgEditActionTypes.GroupValueSetsSuccess),
    mergeMap((action: GroupValueSetsSuccess) => {
      return this.store.select(fromDAM.selectPayloadData).pipe(
        take(1),
        map((ig) => {
          return new LoadPayloadData({ ... ig, valueSetRegistry: {...ig.valueSetRegistry , groupedData: action.payload}});
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

}
