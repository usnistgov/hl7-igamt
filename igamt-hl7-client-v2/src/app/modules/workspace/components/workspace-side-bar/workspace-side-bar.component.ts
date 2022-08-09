import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  createFolder() {
    this.dialog.open(FolderAddDialogComponent, {}).afterClosed().pipe(
      flatMap((folder) => {
        if (folder) {
          return this.workspaceId$.pipe(
            take(1),
            flatMap((id) => {
              return this.workspaceService.addFolder(id, folder).pipe(
                flatMap((message) => {
                  this.store.dispatch(this.messageService.messageToAction(message));
                  return this.workspaceService.getWorkspaceInfo(id).pipe(
                    tap((ws) => {
                      this.workspaceService.getWorkspaceInfoUpdateAction(ws).forEach((action) => {
                        this.store.dispatch(action);
                      });
                    }),
                  );
                }),
              );
            }),
          );
        }
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
