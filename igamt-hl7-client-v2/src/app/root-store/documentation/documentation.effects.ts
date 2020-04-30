import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { flatMap, map, switchMap, take } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { MessageType, UserMessage } from '../../modules/dam-framework/models/messages/message.class';
import { MessageService } from '../../modules/dam-framework/services/message.service';
import { DamWidgetEffect } from '../../modules/dam-framework/store/dam-widget-effect.class';
import { DOC_WIDGET_ID } from '../../modules/documentation/components/documentation-container/documentation-contrainer.component';
import { IDocumentation } from '../../modules/documentation/models/documentation.interface';
import { DocumentationService } from '../../modules/documentation/service/documentation.service';
import {
  AddDocument, AddDocumentationState, AddDocumentSuccess,
  DeleteDocument, DeleteDocumentationState,
  DocumentationActionTypes,
  DocumentationsActions,
  LoadDocumentations,
  LoadDocumentationsFailure,
  LoadDocumentationsSuccess,
  OpenDocumentationSection, OpenDocumentationSectionFailure,
  ToggleEditMode, UpdateDocumentationList, UpdateDocumentationListSuccess,
} from './documentation.actions';
import { documentationEntityAdapter, selectDocumentationById, selectDocumentations } from './documentation.reducer';

function getUpdates(list: IDocumentation[]) {
  return list.map((x) => {
    return { id: x.id, changes: { ...x } };
  },
  );
}

@Injectable()
export class DocumentationEffects extends DamWidgetEffect {

  @Effect()
  toggleEdit$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.ToggleEditMode),
    map((action: ToggleEditMode) => {
      return new fromDAM.SetValue({ editMode: action.payload });
    }),
  );

  @Effect()
  loadDocumentations$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.LoadDocumentations),
    switchMap((action: LoadDocumentations) => {
      return this.documentationService.getAllDocumentations().pipe(
        take(1),
        flatMap((doc: IDocumentation[]) => {
          return [
            new fromDAM.TurnOffLoader(),
            new fromDAM.LoadPayloadData(documentationEntityAdapter.addAll(doc, documentationEntityAdapter.getInitialState())),
            new LoadDocumentationsSuccess(doc),
          ];
        },
        ),
      );
    }),
  );

  @Effect()
  loadDocumentationsFailure$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.LoadDocumentationsFailure),
    map((action: LoadDocumentationsFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  openDocumentationNode$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.OpenDocumentationSection),
    switchMap((action: OpenDocumentationSection) => {
      return this.store.select(selectDocumentationById, { id: action.payload.id }).pipe(
        take(1),
        flatMap((section): Action[] => {
          if (!section || !section.id) {
            return [
              this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, 'Could not find section with ID ' + action.payload.id)),
              new OpenDocumentationSectionFailure({ id: action.payload.id }),
            ];
          } else {
            return [
              new fromDAM.OpenEditor({
                id: action.payload.id,
                display: section,
                editor: action.payload.editor,
                initial: {
                  ...section,
                },
              }),
            ];
          }
        }),
      );
    }),
  );

  @Effect()
  toolbarSave$ = this.actions$.pipe(
    ofType(fromDamActions.DamActionTypes.GlobalSave),
    map((action: fromDamActions.GlobalSave) => {
      console.log('DOCUMENTATION SAVE');
      return new fromDamActions.EditorSave();
    }),
  );

  @Effect()
  updateDocumentations$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.UpdateDocumentationList),
    switchMap((action: UpdateDocumentationList) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.documentationService.updateList(action.list),
        this.store.select(selectDocumentations)).pipe(
          take(1),
          flatMap(([doc, state]) => {
            return [
              new fromDAM.TurnOffLoader(),
              new fromDAM.LoadPayloadData(documentationEntityAdapter.updateMany(getUpdates(action.list), state)),
              new ToggleEditMode(false),
              new UpdateDocumentationListSuccess(doc),
            ];
          },
          ),
        );
    }),
  );

  @Effect()
  delete = this.actions$.pipe(
    ofType(DocumentationActionTypes.DeleteDocument),
    switchMap((action: DeleteDocument) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.documentationService.delete(action.id, action.list),
        this.store.select(selectDocumentations)).pipe(
          take(1),
          flatMap(([doc, state]) => {
            const documentation = documentationEntityAdapter.removeOne(action.id, documentationEntityAdapter.updateMany(getUpdates(action.list), state));
            return [
              new fromDAM.TurnOffLoader(),
              new fromDAM.LoadPayloadData(documentation),
              new UpdateDocumentationListSuccess(doc),
              new DeleteDocumentationState(action.id),
              this.message.userMessageToAction(new UserMessage<never>(MessageType.SUCCESS, 'Section Deleted Successfully ')),
            ];
          },
          ),
        );
    }),
  );

  @Effect()
  add = this.actions$.pipe(
    ofType(DocumentationActionTypes.AddDocument),
    switchMap((action: AddDocument) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return combineLatest(
        this.documentationService.add(action.documentationType, action.index),
        this.store.select(selectDocumentations)).pipe(
          take(1),
          flatMap(([doc, state]) => {
            return [
              new fromDAM.TurnOffLoader(),
              new fromDAM.LoadPayloadData(documentationEntityAdapter.upsertOne(doc, state)),
              new AddDocumentSuccess(doc),
            ];
          },
          ),
        );
    }),
  );
  @Effect()
  addDocumentSuccess$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.AddDocumentSuccess),
    flatMap(
      (action: AddDocumentSuccess) => {
        return [
          new fromDAM.TurnOffLoader(),

          new AddDocumentationState(action.documentation),
          new ToggleEditMode(true),
        ];
      }),
  );
  constructor(
    actions$: Actions<DocumentationsActions>,
    private documentationService: DocumentationService,
    private store: Store<any>,
    private message: MessageService) {
    super(DOC_WIDGET_ID, actions$);
  }

}
