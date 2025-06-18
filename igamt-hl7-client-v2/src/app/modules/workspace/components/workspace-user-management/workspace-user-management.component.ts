import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { IMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { selectUsername } from 'src/app/modules/dam-framework/store/authentication';
import { UsersService } from 'src/app/modules/shared/services/users.service';
import { selectAllFolders } from '../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { EditorID } from '../../../shared/models/editor.enum';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { selectIsWorkspaceOwner, selectWorkspaceOwner } from './../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
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
  owner$: Observable<string>;
  isOwner$: Observable<boolean>;
  username$: Observable<string>;
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
  subs: Subscription;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
    private dialog: MatDialog,
    private usersService: UsersService) {
    super({
      id: EditorID.WORKSPACE_USERS,
      title: 'Manage Access',
    }, actions$, store);
    this.workspaceUsers$ = new BehaviorSubject([]);
    this.filterText$ = new BehaviorSubject('');
    this.status$ = new BehaviorSubject(undefined);
    this.owner$ = this.store.select(selectWorkspaceOwner);
    this.isOwner$ = this.store.select(selectIsWorkspaceOwner);
    this.username$ = this.store.select(selectUsername);
    this.subs = this.currentSynchronized$.pipe(
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

  notifyAndRefreshUsersState(message: IMessage<any>) {
    this.store.dispatch(this.messageService.messageToAction(message));
    this.reloadWorkspaceUsers();
    this.reloadWorkspace();
  }

  removeUser(user: IWorkspaceUser) {
    this.elementId$.pipe(
      take(1),
      switchMap((id) => {
        return this.workspaceService.removeUser(id, user.username).pipe(
          map((response) => {
            this.notifyAndRefreshUsersState(response);
          }),
          catchError((err) => {
            this.store.dispatch(this.messageService.actionFromError(err));
            return throwError(err);
          }),
        );
      }),
    ).subscribe();
  }

  makeOwner(user: IWorkspaceUser) {
    this.elementId$.pipe(
      take(1),
      flatMap((id) => {
        return this.dialog.open(ConfirmDialogComponent, {
          data: {
            action: 'Transfer workspace ownership to "' + user.username + '"',
            question: 'Are you sure you want to transfer the workspace ownership to user "' + user.username + '"? Once transfered the user will have all privileges on the workspace and you will lose ownership of the workspace.',
          },
        }).afterClosed().pipe(
          flatMap((answer) => {
            if (answer) {
              return this.workspaceService.makeOwner(id, user.username).pipe(
                map((response) => {
                  this.notifyAndRefreshUsersState(response);
                }),
                catchError((err) => {
                  this.store.dispatch(this.messageService.actionFromError(err));
                  return throwError(err);
                }),
              );
            }
            return of();
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
                      this.notifyAndRefreshUsersState(response);
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
            this.notifyAndRefreshUsersState(response);
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
        return this.usersService.getUsernames().pipe(
          flatMap((usernames) => {
            return this.dialog.open(AddUserDialogComponent, {
              data: {
                folders,
                usernames,
              },
            }).afterClosed().pipe(
              flatMap((invite) => {
                if (invite) {
                  return this.elementId$.pipe(
                    take(1),
                    switchMap((id) => {
                      return this.workspaceService.addWorkspaceUser(id, false, invite.username, invite.permissions).pipe(
                        map((response) => {
                          this.notifyAndRefreshUsersState(response);
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

  reloadWorkspace() {
    this.elementId$.pipe(
      take(1),
      switchMap((id) => {
        return this.workspaceService.getWorkspaceInfo(id).pipe(
          map((info) => {
            this.workspaceService.getWorkspaceInfoUpdateAction(info).forEach((action) => this.store.dispatch(action));
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

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngOnInit() {
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

}
