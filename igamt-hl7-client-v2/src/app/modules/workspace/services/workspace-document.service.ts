import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { of, Subject, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, flatMap, take, tap } from 'rxjs/operators';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import { EditorUpdate } from '../../dam-framework/store';
import { Type } from '../../shared/constants/type.enum';
import { selectWorkspaceInfo } from './../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { ConfirmDialogComponent } from './../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { UserMessage } from './../../dam-framework/models/messages/message.class';
import { MessageService } from './../../dam-framework/services/message.service';
import { IgListItem } from './../../document/models/document/ig-list-item.class';
import { IgListService } from './../../ig/services/ig-list.service';
import { DeriveDialogComponent } from './../../shared/components/derive-dialog/derive-dialog.component';
import { IgPublisherComponent } from './../../shared/components/ig-publisher/ig-publisher.component';
import { CloneModeEnum } from './../../shared/constants/clone-mode.enum';
import { DocumentMoveDialogComponent } from './../components/document-move-dialog/document-move-dialog.component';
import { IFolderInfo, IWorkspaceInfo } from './../models/models';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceDocumentService {

  constructor(
    private dialog: MatDialog,
    private store: Store<any>,
    private igListService: IgListService,
    private igService: IgService,
    private messageService: MessageService,
    private workspaceService: WorkspaceService,
  ) {
  }

  readonly CLONE = (folder: IFolderInfo, igListItem: IgListItem): Observable<IWorkspaceInfo> => {
    return this.workspaceService.cloneToWorkspace({
      documentId: igListItem.id,
      documentType: Type.IGDOCUMENT,
      workspaceId: folder.workspaceId,
      folderId: folder.id,
      name: undefined,
      copyInfo: {
        mode: CloneModeEnum.CLONE,
      },
    });
  }

  readonly LOCK = (folder: IFolderInfo, item: IgListItem): Observable<IWorkspaceInfo> => {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to lock Implementation Guide "' + item.title + '" ?',
        action: 'Lock Implementation Guide',
      },
    }).afterClosed().pipe(
      flatMap((answer) => {
        if (answer) {
          return this.igListService.lockIG(item.id).pipe(
            flatMap(() => {
              return this.workspaceService.getWorkspaceInfo(folder.workspaceId);
            }),
          );
        }
        return of();
      }),
    );
  }

  readonly DERIVE = (folder: IFolderInfo, item: IgListItem): Observable<IWorkspaceInfo> => {
    return this.igService.loadTemplate().pipe(
      take(1),
      flatMap((templates) => {
        return this.dialog.open(DeriveDialogComponent, {
          data: {
            origin: item.title,
            templates,
          },
        }).afterClosed().pipe(
          flatMap((result) => {
            return this.workspaceService.cloneToWorkspace({
              documentId: item.id,
              documentType: Type.IGDOCUMENT,
              workspaceId: folder.workspaceId,
              folderId: folder.id,
              name: '',
              copyInfo: { inherit: result['inherit'], mode: CloneModeEnum.DERIVE, template: result.template },
            });
          }),
        );
      }),
    );
  }

  readonly PUBLISH = (folder: IFolderInfo, item: IgListItem): Observable<IWorkspaceInfo> => {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to publish Implementation Guide "' + item.title + '" ? Once published this Implementation is not going to be available in the workspace.',
        action: 'Publish Implementation Guide',
      },
    }).afterClosed().pipe(
      flatMap((answer) => {
        if (answer) {
          return this.dialog.open(IgPublisherComponent, {
            data: {
              ig: item,
            },
          }).afterClosed().pipe(
            flatMap((pinfo) => {
              if (pinfo) {
                return this.workspaceService.publishIg({
                  documentId: item.id,
                  documentType: Type.IGDOCUMENT,
                  workspaceId: folder.workspaceId,
                  folderId: folder.id,
                  info: { draft: pinfo.draft, info: pinfo.info },
                });
              }
              return of();
            }),
          );
        }
        return of();
      }),
    );
  }

  readonly DELETE = (folder: IFolderInfo, item: IgListItem): Observable<IWorkspaceInfo> => {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to delete Implementation Guide "' + item.title + '" ?',
        action: 'Delete Implementation Guide',
      },
    }).afterClosed().pipe(
      flatMap((answer) => {
        if (answer) {
          return this.workspaceService.deleteFromWorkspace(
            item.id,
            Type.IGDOCUMENT,
            folder.workspaceId,
            folder.id,
          );
        }
        return of();
      }),
    );
  }

  readonly MOVE = (folder: IFolderInfo, item: IgListItem): Observable<IWorkspaceInfo> => {
    return this.store.select(selectWorkspaceInfo).pipe(
      take(1),
      flatMap((workspace) => {
        return this.dialog.open(DocumentMoveDialogComponent, {
          minWidth: '900px',
          data: {
            workspace,
            folder,
            name: item.title,
          },
        }).afterClosed().pipe(
          flatMap((result) => {
            if (result) {
              return this.workspaceService.moveIg({
                documentId: item.id,
                documentType: Type.IGDOCUMENT,
                workspaceId: folder.workspaceId,
                sourceFolderId: folder.id,
                title: result.title,
                clone: result.clone,
                folderId: result.folderId,
              });
            }
            return of();
          }),
        );
      }),
    );
  }

  execute(action: (folder: IFolderInfo, igListItem: IgListItem) => Observable<IWorkspaceInfo>, folder$: Subject<IFolderInfo>, igListItem: IgListItem, success: UserMessage) {
    folder$.pipe(
      take(1),
      flatMap((folder) => {
        return action(folder, igListItem).pipe(
          flatMap((ws) => {
            return this.workspaceService.getWorkspaceFolderContent(folder.workspaceId, folder.id).pipe(
              flatMap((folderContent) => {
                folder$.next(folderContent);
                return [
                  ...this.workspaceService.getWorkspaceInfoUpdateAction(ws),
                  new EditorUpdate({ value: folderContent, updateDate: false }),
                  this.messageService.userMessageToAction(success),
                ];
              }),
              tap((a) => {
                this.store.dispatch(a);
              }),
            );
          }),
          catchError((err) => {
            this.store.dispatch(this.messageService.actionFromError(err));
            return throwError(err);
          }),
        );
      }),
    ).subscribe();
  }

}
