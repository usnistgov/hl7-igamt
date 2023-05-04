import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFolderInfo, IWorkspacePermissions, WorkspacePermissionType } from '../../models/models';

export enum RoleMode {
  ADMIN = 'ADMIN',
  GLOBAL_VIEW = 'GLOBAL_VIEW',
  GLOBAL_EDIT = 'GLOBAL_EDIT',
  CUSTOM = 'CUSTOM',
}

export interface IOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-permission-selector',
  templateUrl: './permission-selector.component.html',
  styleUrls: ['./permission-selector.component.scss'],
})
export class PermissionSelectorComponent implements OnInit {
  folderPermission: WorkspacePermissionType;
  folderPermissions: Array<IOption<WorkspacePermissionType>> = [{
    label: 'Edit',
    value: WorkspacePermissionType.EDIT,
  }, {
    label: 'View',
    value: WorkspacePermissionType.VIEW,
  }];
  folder: IFolderInfo;
  disableFolderPermission: boolean;
  folderOptions: Array<IOption<IFolderInfo>> = [];
  filteredFolderOptions: Array<IOption<IFolderInfo>> = [];
  folderScopes: Array<{
    permission: WorkspacePermissionType,
    folder: IFolderInfo,
    id: string;
    known: boolean;
  }> = [];
  mode: RoleMode;
  unknownFolderScopes: Array<{
    id: string,
    permission: WorkspacePermissionType,
  }> = [];

  @Output()
  workspacePermissionsChange: EventEmitter<IWorkspacePermissions>;

  @Input()
  set folders(folders: IFolderInfo[]) {
    this.folderOptions = folders.map((f) => ({
      label: f.metadata.title,
      value: f,
    }));
    this.filteredFolderOptions = [...this.folderOptions];
  }

  @Input()
  set workspacePermissions(wsp: IWorkspacePermissions) {
    if (wsp.admin) {
      this.mode = RoleMode.ADMIN;
    } else if (wsp.global) {
      if (wsp.global === WorkspacePermissionType.EDIT) {
        this.mode = RoleMode.GLOBAL_EDIT;
      } else {
        this.mode = RoleMode.GLOBAL_VIEW;
      }
    } else {
      this.mode = RoleMode.CUSTOM;
    }

    if (wsp.byFolder) {
      this.folderScopes = Object.keys(wsp.byFolder).map((folderId) => {
        const folder = this.folderOptions.find((f) => f.value.id === folderId);
        return {
          folder: folder.value,
          permission: wsp.byFolder[folderId],
          id: folderId,
          known: !!folder,
        };
      });
    }
  }

  constructor() {
    this.workspacePermissionsChange = new EventEmitter();
  }

  permissionsChange() {
    this.updateFilteredScopeOptions();
    this.workspacePermissionsChange.emit(this.getPermissions());
  }

  modeChange(mode: RoleMode) {
    this.folderScopes = [];
    if (mode === RoleMode.GLOBAL_VIEW) {
      this.disableFolderPermission = true;
      this.folderPermission = WorkspacePermissionType.EDIT;
    } else {
      this.disableFolderPermission = false;
    }
    this.permissionsChange();
  }

  remove(i: number) {
    this.folderScopes.splice(i, 1);
    this.permissionsChange();
  }

  select(folder: IFolderInfo, permission: WorkspacePermissionType) {
    this.folderScopes = [
      ...this.folderScopes,
      {
        folder,
        permission,
        id: folder.id,
        known: true,
      },
    ];
    this.folder = undefined;
    if (this.mode !== RoleMode.GLOBAL_VIEW) {
      this.folderPermission = undefined;
    }
    this.permissionsChange();
  }

  updateFilteredScopeOptions() {
    this.filteredFolderOptions = this.folderOptions.filter((fo) => {
      return this.folderScopes.findIndex((fs) => {
        return fs.folder.id === fo.value.id;
      }) === -1;
    });
  }

  getPermissions(): IWorkspacePermissions {
    return {
      admin: this.mode === RoleMode.ADMIN,
      global: this.mode === RoleMode.GLOBAL_EDIT ? WorkspacePermissionType.EDIT : this.mode === RoleMode.GLOBAL_VIEW ? WorkspacePermissionType.VIEW : undefined,
      byFolder: this.folderScopes.reduce((acc, fs) => {
        acc[fs.folder.id] = fs.permission;
        return acc;
      }, {}),
    };
  }

  ngOnInit() {
  }

}
