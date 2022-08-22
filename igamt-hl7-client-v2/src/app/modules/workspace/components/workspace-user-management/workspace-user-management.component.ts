import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { FroalaService } from 'src/app/modules/shared/services/froala.service';
import { EditorID } from '../../../shared/models/editor.enum';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';
import { IFolderInfo } from '../../models/models';
import { selectAllFolders } from '../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';

@Component({
  selector: 'app-workspace-user-management',
  templateUrl: './workspace-user-management.component.html',
  styleUrls: ['./workspace-user-management.component.scss'],
})
export class WorkspaceUserManagementComponent extends AbstractWorkspaceEditorComponent implements OnInit, OnDestroy {

  folders$: Observable<IFolderInfo[]>;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
    protected froalaService: FroalaService,
  ) {
    super({
      id: EditorID.WORKSPACE_USERS,
      title: 'Manage Access',
    }, actions$, store);
    this.folders$ = this.store.select(selectAllFolders);
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return of();
  }

  editorDisplayNode(): Observable<any> {
    return of();
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

}
