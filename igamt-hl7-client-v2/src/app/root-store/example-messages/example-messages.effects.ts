import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, take } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import * as fromRouterSelector from '../../modules/dam-framework/store/router/router.selectors';
import { DamWidgetEffect } from '../../modules/dam-framework/store/dam-widget-effect.class';
import { Type } from '../../modules/shared/constants/type.enum';
import { ExampleMessagesActionTypes, LoadExampleMessages, LoadExampleMessagesSuccess, OpenExampleMessageEditor, OpenExampleSnippetEditor } from './example-messages.actions';
import { EXAMPLE_MESSAGES_WIDGET_ID } from 'src/app/modules/example-messages/components/example-messages-container/example-messages-container.component';
import { ExampleMessagesService } from 'src/app/modules/example-messages/services/example-messages.service';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { selectIgExampleMessages } from './example-messages.reducer';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';

@Injectable()
export class ExampleMessagesEffects extends DamWidgetEffect {

  @Effect()
  loadExampleMessages$ = this.actions$.pipe(
    ofType(ExampleMessagesActionTypes.LoadExampleMessages),
    concatMap((action: LoadExampleMessages) => {
      console.log("LOAD MESSAGES", action.id);
      return this.exampleMessagesService.getIgExampleMessages(action.id).pipe(
        mergeMap((igExampleMessages) => {
          return of(
            new fromDAM.LoadPayloadData({
              type: Type.EXAMPLEMESSAGES,
              ...igExampleMessages,
            }),
            new LoadExampleMessagesSuccess(),
          )
        })
      )
    }),
  );

  @Effect()
  openMessageEditor$ = this.actions$.pipe(
    ofType(ExampleMessagesActionTypes.OpenExampleMessageEditor),
    concatMap((action: OpenExampleMessageEditor) => {
      return this.store.select(selectIgExampleMessages).pipe(
        take(1),
        mergeMap((data) => {
          return this.exampleMessagesService.getExampleMessage(data.id, action.payload.id).pipe(
            map((message) => {
              return new fromDamActions.OpenEditor({
                id: action.payload.id,
                editor: {
                  id: EditorID.EXAMPLE_MESSAGE,
                  title: 'Message',
                },
                display: {},
                initial: message,
              });
            }),
            catchError((err) => {
              return of(
                this.messageService.actionFromError(err),
                new fromDamActions.OpenEditorFailure({ id: action.payload.id })
              );
            })
          )
        })
      )
    })
  );

  @Effect()
  openSnippetEditor$ = this.actions$.pipe(
    ofType(ExampleMessagesActionTypes.OpenExampleSnippetEditor),
    concatMap((action: OpenExampleSnippetEditor) => {
      return combineLatest(
        this.store.select(selectIgExampleMessages),
        this.store.select(fromRouterSelector.selectRouteParams),
      ).pipe(
        take(1),
        mergeMap(([data, routeParams]) => {
          const snippetId = action.payload.id;
          const messageId = routeParams['messageId'];
          return this.exampleMessagesService.renderSnippet(data.id, messageId, snippetId).pipe(
            map((renderResult) => {
              return new fromDamActions.OpenEditor({
                id: action.payload.id,
                editor: {
                  id: EditorID.EXAMPLE_SNIPPET,
                  title: 'Snippet',
                },
                display: {},
                initial: {
                  ...renderResult,
                  igId: data.id,
                },
              });
            }),
            catchError((err) => {
              return of(
                this.messageService.actionFromError(err),
                new fromDamActions.OpenEditorFailure({ id: action.payload.id })
              );
            })
          );
        })
      );
    })
  );

  @Effect()
  toolbarSave$ = this.actions$.pipe(
    ofType(fromDamActions.DamActionTypes.GlobalSave),
    map((action: fromDamActions.GlobalSave) => {
      return new fromDamActions.EditorSave();
    }),
  );

  constructor(
    actions$: Actions<ExampleMessagesActionTypes>,
    private store: Store<any>,
    private exampleMessagesService: ExampleMessagesService,
    private messageService: MessageService
  ) {
    super(EXAMPLE_MESSAGES_WIDGET_ID, actions$);
  }

}
