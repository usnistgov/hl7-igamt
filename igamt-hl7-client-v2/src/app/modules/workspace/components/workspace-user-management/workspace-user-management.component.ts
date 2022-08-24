import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { FroalaService } from 'src/app/modules/shared/services/froala.service';
import { selectAllFolders } from '../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { EditorID } from '../../../shared/models/editor.enum';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-workspace-user-management',
  templateUrl: './workspace-user-management.component.html',
  styleUrls: ['./workspace-user-management.component.scss'],
})
export class WorkspaceUserManagementComponent extends AbstractWorkspaceEditorComponent implements OnInit, OnDestroy {

  filter = {
    pending: false,
  };
  username: string;
  active: boolean;
  constructor(
    actions$: Actions,
    store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
    private dialog: MatDialog,
    protected froalaService: FroalaService,
  ) {
    super({
      id: EditorID.WORKSPACE_USERS,
      title: 'Manage Access',
    }, actions$, store);
  }

  filterTextChanged(username) {

  }

  inviteUser() {
    combineLatest(
      this.store.select(selectAllFolders),
    ).pipe(
      take(1),
      map(([folders, roles]) => {
        this.dialog.open(AddUserDialogComponent, {
          data: {
            folders,
          },
        });
      }),
    ).subscribe();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return of();
  }

  editorDisplayNode(): Observable<any> {
    return of();
  }

  onOpenChange(state) {

  }

  apply() {

  }

  clear() {

  }
  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

}
