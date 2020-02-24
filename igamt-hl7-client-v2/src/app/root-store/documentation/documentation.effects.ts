import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import {Action, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {flatMap, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {Message, MessageType, UserMessage} from '../../modules/core/models/message/message.class';
import {MessageService} from '../../modules/core/services/message.service';
import {IDocumentation} from '../../modules/documentation/models/documentation.interface';
import {DocumentationService} from '../../modules/documentation/service/documentation.service';
import {IgEditActionTypes, OpenEditor, OpenEditorFailure, OpenNarrativeEditorNode} from '../ig/ig-edit/ig-edit.actions';
import {TurnOffLoader} from '../loader/loader.actions';
import {
  DocumentationActionTypes,
  DocumentationsActions,
  DocumentationToolBarSave,
  LoadDocumentations,
  LoadDocumentationsFailure,
  LoadDocumentationsSuccess,
  OpenDocumentationEditor,
  OpenDocumentationSection,
  ToggleEditMode,
  UpdateDocumentationState,
} from './documentation.actions';
import {selectDocumentationById, selectWorkspaceCurrent} from './documentation.reducer';

@Injectable()
export class DocumentationEffects {
  @Effect()
  loadDocumentations$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.LoadDocumentations),
    switchMap((action: LoadDocumentations) => {
      return this.documentationService.getAllDocumentations().pipe(
        take(1),
        flatMap((doc: IDocumentation[]) => {
          return [new TurnOffLoader(),
                   new LoadDocumentationsSuccess(doc)];
          },
        ),
      );
    }),
  );
  @Effect()
  loadDocumentationsSuccess$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.LoadDocumentationsSuccess),
    map((action: LoadDocumentationsSuccess) => {
      return this.message.messageToAction(new Message(MessageType.SUCCESS, 'Resource imported successfully ', null));
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
            if ( !section  || !section.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, 'Could not find section with ID ' + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenDocumentationEditor({
                  id: action.payload.id,
                  element: section,
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
  DocumentationToolBarSave$ = this.actions$.pipe(
    ofType(DocumentationActionTypes.DocumentationToolBarSave),
    switchMap((action: DocumentationToolBarSave) => {
      return this.store.select(selectWorkspaceCurrent).pipe(
        take(1),
          mergeMap( (obj: any) => {
            return  this.documentationService.save(obj.data).pipe(
              flatMap((doc: IDocumentation) => {
                  return [new TurnOffLoader(), new UpdateDocumentationState(doc), new ToggleEditMode(false)];
                },
              ),
            );
          }),
      );
    }),
  );

  constructor(private actions$: Actions<DocumentationsActions>, private documentationService: DocumentationService ,
              private store: Store<any>, private message: MessageService) {
  }

}
