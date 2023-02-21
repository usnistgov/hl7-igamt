import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { IWorkspaceInfo } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { selectAllFolders, selectIsWorkspaceAdmin, selectWorkspaceId } from '../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { IFolderInfo } from '../../models/models';
import { WorkspaceService } from '../../services/workspace.service';
import { FolderAddDialogComponent } from '../folder-add-dialog/folder-add-dialog.component';

@Component({
  selector: 'app-workspace-side-bar',
  templateUrl: './workspace-side-bar.component.html',
  styleUrls: ['./workspace-side-bar.component.scss'],
})
export class WorkspaceSideBarComponent implements OnInit {

  isAdmin$: Observable<boolean>;
  workspaceId$: Observable<string>;
  folders$: Observable<IFolderInfo[]>;

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
    private dialog: MatDialog,
  ) {
    this.isAdmin$ = this.store.select(selectIsWorkspaceAdmin);
    this.workspaceId$ = this.store.select(selectWorkspaceId);
    this.folders$ = this.store.select(selectAllFolders).pipe(
      map((folders) => {
        return folders ? folders.sort((a, b) => a.position - b.position) : [];
      }),
    );
  }

  editFolder(folder: IFolderInfo) {
    this.dialog.open(FolderAddDialogComponent, {
      data: {
        title: 'Update Folder : ' + folder.metadata.title,
        folder: {
          title: folder.metadata.title,
          description: folder.metadata.description,
        }
      }
    }).afterClosed().pipe(
      flatMap((data) => {
        if (data) {
          return this.workspaceId$.pipe(
            take(1),
            flatMap((id) => {
              return this.workspaceService.updateFolder(folder.workspaceId, folder.id, data).pipe(
                flatMap((message) => {
                  this.store.dispatch(this.messageService.messageToAction(message));
                  return this.updateWorkspaceState(id);
                }),
              );
            }),
          );
        }
      }),
    ).subscribe();
  }

  deleteFolder(folder: IFolderInfo) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete Folder',
        question: 'Are you sure you want to delete folder ' + folder.metadata.title + '? This action will delete all the Implementation Guides inside the folder',
      }
    }).afterClosed().pipe(
      flatMap((answer) => {
        if (answer) {
          return this.workspaceService.deleteFolder(folder).pipe(
            flatMap((message) => {
              this.store.dispatch(this.messageService.messageToAction(message));
              return this.updateWorkspaceState(folder.workspaceId);
            }),
          );
        }
        return of();
      })
    ).subscribe();

  }

  createFolder() {
    this.dialog.open(FolderAddDialogComponent, {
      data: {
        title: 'Create Folder',
      }
    }).afterClosed().pipe(
      flatMap((folder) => {
        if (folder) {
          return this.workspaceId$.pipe(
            take(1),
            flatMap((id) => {
              return this.workspaceService.addFolder(id, folder).pipe(
                flatMap((message) => {
                  this.store.dispatch(this.messageService.messageToAction(message));
                  return this.updateWorkspaceState(id);
                }),
              );
            }),
          );
        }
      }),
    ).subscribe();
  }

  updateWorkspaceState(id: string): Observable<IWorkspaceInfo> {
    return this.workspaceService.getWorkspaceInfo(id).pipe(
      tap((ws) => {
        this.workspaceService.getWorkspaceInfoUpdateAction(ws).forEach((action) => {
          this.store.dispatch(action);
        });
      }),
    );
  }

  ngOnInit() {
  }

}
