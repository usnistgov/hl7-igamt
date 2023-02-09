import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { FroalaService } from 'src/app/modules/shared/services/froala.service';
import { selectAllFolders } from '../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { EditorID } from '../../../shared/models/editor.enum';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { EditorUpdate } from './../../../dam-framework/store/data/dam.actions';
import { IFolderInfo, InvitationStatus, IWorkspacePermissions, IWorkspaceUser, WorkspacePermissionType } from './../../models/models';

export enum UserTableColumn {
  USERNAME = 'USERNAME',
  STATUS = 'STATUS',
  ADDED = 'ADDED',
  JOINED = 'JOINED',
  ADDEDBY = 'ADDEDBY',
  PERMISSIONS = 'PERMISSIONS',
}
export enum PermissionType {
  GLOBAL = 'GLOBAL',
  ADMIN = 'ADMIN',
  FOLDER = 'FOLDER',
}

export interface IPermissionsDetails {
  type: PermissionType;
  perm?: WorkspacePermissionType;
  label: string;
}

@Pipe({ name: 'perms' })
export class PermsPipe implements PipeTransform {
  folders$: Observable<IFolderInfo[]>;

  constructor(private store: Store<any>) {
    this.folders$ = this.store.select(selectAllFolders);
  }

  // tslint:disable-next-line: cognitive-complexity
  transform(permissions: IWorkspacePermissions): Observable<IPermissionsDetails[]> {
    if (permissions.admin) {
      return of([{ type: PermissionType.ADMIN, label: 'Admin' }]);
    } else {
      if (permissions.global === WorkspacePermissionType.EDIT) {
        return of([{ type: PermissionType.GLOBAL, label: 'Global', perm: WorkspacePermissionType.EDIT }]);
      } else {
        return combineLatest(
          this.folders$,
          permissions.global === WorkspacePermissionType.VIEW ? of({ type: PermissionType.GLOBAL, label: 'Global', perm: WorkspacePermissionType.VIEW }) : of(undefined),
        ).pipe(
          map(([folders, global]) => {
            return Object.keys(permissions.byFolder || {}).reduce((acc, id) => {
              const folder = folders.find((f) => f.id === id);
              if (folder) {
                return [
                  ...acc,
                  { type: 'FOLDER', label: folder.metadata.title, perm: permissions.byFolder[id] },
                ];
              } else {
                return [
                  ...acc,
                  { type: 'FOLDER', label: '[DELETED]', perm: permissions.byFolder[id] },
                ];
              }
            }, [...global ? [global] : []]);
          }),
        );
      }
    }
  }
}

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
  workspaceUsers$: BehaviorSubject<IWorkspaceUser[]>;
  filterText$: BehaviorSubject<string>;
  status$: BehaviorSubject<InvitationStatus>;
  filteredUserList$: Observable<IWorkspaceUser[]>;
  statusOptions = [{
    label: 'Pending',
    value: InvitationStatus.PENDING,
  }, {
    label: 'Accepted',
    value: InvitationStatus.ACCEPTED,
  }, {
    label: 'Declined',
    value: InvitationStatus.DECLINED,
  }];
  statusFilter: InvitationStatus;
  columns: UserTableColumn[] = [
    UserTableColumn.USERNAME,
    UserTableColumn.STATUS,
    UserTableColumn.ADDED,
    UserTableColumn.JOINED,
    UserTableColumn.ADDEDBY,
    UserTableColumn.PERMISSIONS,
  ];

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
    this.workspaceUsers$ = new BehaviorSubject([]);
    this.filterText$ = new BehaviorSubject('');
    this.status$ = new BehaviorSubject(undefined);

    this.currentSynchronized$.pipe(
      tap((current) => {
        this.workspaceUsers$.next([...(current.users || [])]);
      }),
    ).subscribe();

    this.filteredUserList$ = combineLatest(
      this.workspaceUsers$,
      this.filterText$,
      this.status$,
    ).pipe(
      map(([users, text, status]) => {
        return users.filter((user) => {
          const mtxt = !text || user.username.toLowerCase().includes(text.toLowerCase());
          const mstatus = !status || user.status === status;
          return mtxt && mstatus;
        });
      }),
    );
  }

  filterTextChanged(username) {
    this.filterText$.next(username);
  }

  statusChanged(status) {
    this.status$.next(status);
  }

  removeUser(user: IWorkspaceUser) {
    this.elementId$.pipe(
      take(1),
      switchMap((id) => {
        return this.workspaceService.removeUser(id, user.username).pipe(
          map((response) => {
            this.store.dispatch(this.messageService.messageToAction(response));
            this.reloadWorkspaceUsers();
          }),
          catchError((err) => {
            this.store.dispatch(this.messageService.actionFromError(err));
            return throwError(err);
          }),
        );
      }),
    ).subscribe();
  }

  editUser(user: IWorkspaceUser) {
    combineLatest(
      this.store.select(selectAllFolders),
    ).pipe(
      take(1),
      flatMap(([folders]) => {
        return this.dialog.open(AddUserDialogComponent, {
          data: {
            folders,
            edit: true,
            username: user.username,
            permissions: user.permissions,
          },
        }).afterClosed().pipe(
          flatMap((updated) => {
            if (updated) {
              return this.elementId$.pipe(
                take(1),
                switchMap((id) => {
                  return this.workspaceService.updateUser(id, user.username, updated.permissions).pipe(
                    map((response) => {
                      this.store.dispatch(this.messageService.messageToAction(response));
                      this.reloadWorkspaceUsers();
                    }),
                    catchError((err) => {
                      this.store.dispatch(this.messageService.actionFromError(err));
                      return throwError(err);
                    }),
                  );
                }),
              );
            } else {
              return of();
            }
          }),
        );
      }),
    ).subscribe();
  }

  reInvite(user: IWorkspaceUser) {
    this.elementId$.pipe(
      take(1),
      switchMap((id) => {
        return this.workspaceService.addWorkspaceUser(id, false, user.username, user.permissions).pipe(
          map((response) => {
            this.store.dispatch(this.messageService.messageToAction(response));
            this.reloadWorkspaceUsers();
          }),
          catchError((err) => {
            this.store.dispatch(this.messageService.actionFromError(err));
            return throwError(err);
          }),
        );
      }),
    ).subscribe();
  }

  inviteUser() {
    combineLatest(
      this.store.select(selectAllFolders),
    ).pipe(
      take(1),
      flatMap(([folders]) => {
        return this.dialog.open(AddUserDialogComponent, {
          data: {
            folders,
          },
        }).afterClosed().pipe(
          flatMap((invite) => {
            if (invite) {
              return this.elementId$.pipe(
                take(1),
                switchMap((id) => {
                  return this.workspaceService.addWorkspaceUser(id, false, invite.username, invite.permissions).pipe(
                    map((response) => {
                      this.store.dispatch(this.messageService.messageToAction(response));
                      this.reloadWorkspaceUsers();
                    }),
                    catchError((err) => {
                      this.store.dispatch(this.messageService.actionFromError(err));
                      return throwError(err);
                    }),
                  );
                }),
              );
            } else {
              return of();
            }
          }),
        );
      }),
    ).subscribe();
  }

  reloadWorkspaceUsers() {
    this.elementId$.pipe(
      take(1),
      switchMap((id) => {
        return this.workspaceService.getWorkspaceUsers(id).pipe(
          map((users) => {
            this.store.dispatch(new EditorUpdate({ value: { users }, updateDate: true }));
          }),
        );
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
