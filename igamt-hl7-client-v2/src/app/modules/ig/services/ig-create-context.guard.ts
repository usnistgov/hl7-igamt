import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { Message, MessageType, UserMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { WorkspaceService } from './../../workspace/services/workspace.service';
import { DocumentLocationType, IDocumentLocation } from './../models/ig/ig-document.class';

export enum IgCreateContextType {
  PRIVATE_IG_LIST = 'PRIVATE_IG_LIST',
  WORKSPACE = 'WORKSPACE',
}

export interface IIgCreateContext {
  scope: IgCreateContextType;
  location?: IDocumentLocation[];
  error?: UserMessage<string>;
}

@Injectable({
  providedIn: 'root',
})
export class IgCreateContext implements Resolve<IIgCreateContext> {

  constructor(private workspaceService: WorkspaceService, private messageService: MessageService, private store: Store<any>, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IIgCreateContext> {
    if (route.queryParams.workspaceId && route.queryParams.folderId) {
      return this.workspaceService.getWorkspaceInfo(route.queryParams.workspaceId).pipe(
        flatMap((workspaceInfo) => {
          const folderInfo = workspaceInfo.folders.find((f) => f.id === route.queryParams.folderId);
          if (folderInfo) {
            return of({
              scope: IgCreateContextType.WORKSPACE,
              location: [{
                position: 1,
                type: DocumentLocationType.WORKSPACE,
                id: workspaceInfo.id,
                label: workspaceInfo.metadata.title,
              }, {
                position: 2,
                type: DocumentLocationType.FOLDER,
                id: folderInfo.id,
                label: folderInfo.metadata.title,
              }],
            });
          } else {
            return this.handleError(
              this.messageService.messageToAction(new Message<string>(MessageType.FAILED, 'Folder Not Found in Workspace "' + workspaceInfo.metadata.title + '"', '')),
            );
          }
        }),
        catchError((e) => {
          return this.handleError(
            this.messageService.actionFromError(e),
          );
        }),
      );
    } else {
      return of<IIgCreateContext>({
        scope: IgCreateContextType.PRIVATE_IG_LIST,
        location: [{
          position: 1,
          type: DocumentLocationType.SCOPE,
          id: 'PRIVATE_IG_LIST',
          label: 'Owned Implementation Guides',
        }],
      });
    }
  }

  handleError(messageAction: Action): Observable<IIgCreateContext> {
    this.store.dispatch(messageAction);
    this.router.navigate(['/', 'error']);
    return EMPTY;
  }
}
