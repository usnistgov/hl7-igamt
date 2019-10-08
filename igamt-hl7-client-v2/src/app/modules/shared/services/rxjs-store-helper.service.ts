import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, flatMap, mergeMap, take } from 'rxjs/operators';
import { TurnOffLoader } from 'src/app/root-store/loader/loader.actions';
import { ClearAll } from 'src/app/root-store/page-messages/page-messages.actions';
import { Message, UserMessage } from './../../core/models/message/message.class';
import { MessageService } from './../../core/services/message.service';

@Injectable({
  providedIn: 'root',
})
export class RxjsStoreHelperService {

  static listenAndReact(actions$: Observable<Action>, map: IActionMap): Observable<Action> {
    return actions$.pipe(
      ofType(...Object.keys(map)),
      filter((action: Action) => {
        return !map[action.type].filter || map[action.type].filter(action);
      }),
      take(1),
      mergeMap((action: Action) => {
        return map[action.type].do(action);
      }),
    );
  }

  constructor(private messageService: MessageService) { }

  static actionChain(actions$: Observable<Action>, store: Store<any>, endWith: Action, chain: Array<{ send: Action, listen: string }>) {
    if (chain && chain.length > 0) {
      store.dispatch(chain[0].send);
      this.listenAndReact(actions$, {
        [chain[0].listen]: {
          do: (action: Action) => {
            this.actionChain(actions$, store, endWith, chain.slice(1));
            return of();
          },
        },
      });
    } else {
      store.dispatch(endWith);
    }
  }

  finalize<E extends any, T extends Messageable = Message>(options: IFinalize<E, T>):
    (source: Observable<E>) => Observable<Action> {
    const actions: Action[] = [
      ...(options.turnOffLoader ? [new TurnOffLoader()] : []),
      ...(options.clearMessages ? [new ClearAll()] : []),
    ];

    return flatMap((action: E) => {
      return [
        ...actions,
        ...(options.message ? [this.payloadToAction(options.message(action))] : []),
        ...(options.handler ? options.handler(action) : []),
      ];
    });
  }

  private payloadToAction<T extends Messageable>(payload: T): Action {
    if (this.messageService.messageTypeGuard(payload)) {
      return this.messageService.messageToAction(payload as Message);
    } else if (payload instanceof UserMessage) {
      return this.messageService.userMessageToAction(payload);
    } else if (payload instanceof HttpErrorResponse) {
      return this.messageService.actionFromError(payload);
    }
  }
}

export interface IFinalize<E extends any, T extends Messageable> {
  turnOffLoader?: boolean;
  clearMessages?: boolean;
  message?: (payload: E) => T;
  handler?: (payload: E) => Action[];
}

export type Messageable = UserMessage | Message | HttpErrorResponse;

export interface IActionMap {
  [key: string]: {
    do: (action: Action) => Observable<Action>;
    filter?: (action: Action) => boolean;
  };
}
