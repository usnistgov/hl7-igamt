import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { BehaviorSubject, combineLatest, from, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, flatMap, map, tap } from 'rxjs/operators';
import * as SockJS from 'sockjs-client/dist/sockjs';
import { IDocumentSessionId } from 'src/app/modules/ig/services/document-session-id.guard';
import { IActiveUser } from '../../shared/components/active-users-list/active-users-list.component';
import { selectDocumentSessionId } from './../../../root-store/ig/ig-edit/ig-edit.selectors';
export enum UserIgAction {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export class DocumentSessionMessageManager {
  activeUsers$: ReplaySubject<IActiveUser[]>;
  saveAction$: Subject<IActiveUser>;
  readonly LISTENER_URL = '/listeners/ig/';

  constructor(readonly client: CompatClient, private session: IDocumentSessionId) {
    this.activeUsers$ = new ReplaySubject(1);
    this.saveAction$ = new Subject();
    if (!client.connected || !client.active) {
      throw new Error('Client is not connected');
    }
  }

  sendOpenAndSubscribe() {
    this.client.subscribe(this.LISTENER_URL + this.session.documentId + '/users', (value) => {
      this.activeUsers$.next(JSON.parse(value.body));
    });
    this.client.subscribe(this.LISTENER_URL + this.session.documentId + '/save', (value) => {
      this.saveAction$.next(JSON.parse(value.body));
    });
    this.send(UserIgAction.OPEN);
  }

  getSessionId(): string {
    return this.session.uid;
  }

  getDocumentId(): string {
    return this.session.documentId;
  }

  private send(action: UserIgAction) {
    if (this.client.connected) {
      this.client.send('/ws-hook/ig/' + this.session.documentId + '/interact', {}, JSON.stringify(action));
    }
  }

  close() {
    if (this.client.connected) {
      this.send(UserIgAction.CLOSE);
      this.client.unsubscribe(this.LISTENER_URL + this.session.documentId + '/users');
      this.client.unsubscribe(this.LISTENER_URL + this.session.documentId + '/save');
    }
  }

  isConnected() {
    return this.client.connected;
  }

  getActiveUsers(): Observable<IActiveUser[]> {
    return this.activeUsers$;
  }

  getSaveAction(): Observable<IActiveUser> {
    return this.saveAction$;
  }

  kill(): Observable<void> {
    return from(this.client.deactivate());
  }

  match(session: IDocumentSessionId) {
    return session && session.uid === this.session.uid && this.session.documentId === session.documentId;
  }

}

@Injectable({
  providedIn: 'root',
})
export class DocumentSessionStompService {

  documentSessionManager: BehaviorSubject<DocumentSessionMessageManager>;

  constructor(private store: Store<any>) {
    this.documentSessionManager = new BehaviorSubject(undefined);
    combineLatest(
      this.store.select(selectDocumentSessionId),
      this.documentSessionManager.asObservable(),
    ).pipe(
      filter(([session, dsm]) => {
        return (session && session.uid && session.documentId) && (!dsm || !dsm.match(session));
      }),
      tap(([session, dsm]) => {

        if (!dsm) {
          this.connect(session).pipe(
            tap((updatedDSM) => {
              this.documentSessionManager.next(updatedDSM);
            }),
          ).subscribe();
        } else {
          dsm.kill().pipe(
            flatMap(() => {
              return this.connect(session).pipe(
                tap((updatedDSM) => {
                  this.documentSessionManager.next(updatedDSM);
                }),
              );
            }),
          ).subscribe();
        }
      }),
    ).subscribe();
  }

  getDocumentSessionManager(): Observable<DocumentSessionMessageManager> {
    return combineLatest(
      this.store.select(selectDocumentSessionId),
      this.documentSessionManager.asObservable(),
    ).pipe(
      filter(([session, dsm]) => {
        return dsm && dsm.match(session);
      }),
      map(([, dsm]) => {
        return dsm;
      }),
    );
  }

  private connect(session: IDocumentSessionId): Observable<DocumentSessionMessageManager> {
    const socket = new SockJS('/api/ig-ws', [], {
      sessionId: () => {
        return session.uid;
      },
    });
    const client = Stomp.over(socket);
    client.debug = () => { };
    return new Observable<DocumentSessionMessageManager>((observer) => {
      client.connect({}, () => {
        observer.next(new DocumentSessionMessageManager(client, session));
        observer.complete();
      });
    });
  }
}
