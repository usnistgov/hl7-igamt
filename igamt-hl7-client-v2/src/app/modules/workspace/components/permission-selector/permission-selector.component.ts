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
  filteredFolders: IFolderInfo[] = [];
  mode: RoleMode;
  _folders: IFolderInfo[];
  permissionsByFolder: Record<string, WorkspacePermissionType>;
  @Output()
  workspacePermissionsChange: EventEmitter<IWorkspacePermissions>;
  filterFoldersActive: boolean;
  nbCustomPermissions = 0;
  unknownFolders: string[];

  @Input()
  set folders(folders: IFolderInfo[]) {
    this.filteredFolders = [...folders];
    this._folders = [...folders];
  }

  get folders() {
    return this._folders;
  }

  filterFolders(active: boolean) {
    if (active) {
      this.filteredFolders = this.folders.filter((folder) => this.permissionsByFolder[folder.id]);
    } else {
      this.filteredFolders = [...this.folders];
    }
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
      this.permissionsByFolder = {
        ...wsp.byFolder,
      };
      this.nbCustomPermissions = Object.keys(this.permissionsByFolder).length;
    }
  }

  updateUnknownFolders(permissionsByFolder: Record<string, WorkspacePermissionType>, folders: IFolderInfo[]) {
    this.unknownFolders = Object.keys(permissionsByFolder || {}).filter((key) => folders.findIndex((folder) => folder.id === key) === -1);
  }

  clearUnknownFolders() {
    for (const folderId of this.unknownFolders) {
      delete this.permissionsByFolder[folderId];
    }
    this.updateUnknownFolders(this.permissionsByFolder, this.folders);
    this.permissionsChange();
  }

  constructor() {
    this.workspacePermissionsChange = new EventEmitter();
  }

  permissionsChange() {
    this.nbCustomPermissions = Object.keys(this.permissionsByFolder).length;
    this.updateUnknownFolders(this.permissionsByFolder, this.folders);
    this.workspacePermissionsChange.emit(this.getPermissions());
  }

  modeChange(mode: RoleMode) {
    this.permissionsByFolder = {};
    this.permissionsChange();
  }

  setViewPermission(folderId: string, mode: RoleMode) {
    if (mode === RoleMode.GLOBAL_VIEW) {
      this.removeFolderPermission(folderId);
      this.filterFolders(this.filterFoldersActive);
      this.permissionsChange();
    } else if (mode === RoleMode.CUSTOM) {
      this.permissionsByFolder[folderId] = WorkspacePermissionType.VIEW;
      this.filterFolders(this.filterFoldersActive);
      this.permissionsChange();
    }
  }

  setEditPermission(folderId: string, mode: RoleMode) {
    if (mode === RoleMode.GLOBAL_VIEW || mode === RoleMode.CUSTOM) {
      this.permissionsByFolder[folderId] = WorkspacePermissionType.EDIT;
      this.filterFolders(this.filterFoldersActive);
      this.permissionsChange();
    }
  }

  removeFolderPermission(folderId: string) {
    delete this.permissionsByFolder[folderId];
    this.filterFolders(this.filterFoldersActive);
    this.permissionsChange();
  }

  getPermissions(): IWorkspacePermissions {
    return {
      admin: this.mode === RoleMode.ADMIN,
      global: this.mode === RoleMode.GLOBAL_EDIT ? WorkspacePermissionType.EDIT : this.mode === RoleMode.GLOBAL_VIEW ? WorkspacePermissionType.VIEW : undefined,
      byFolder: {
        ...this.permissionsByFolder,
      },
    };
  }

  ngOnInit() {
    this.updateUnknownFolders(this.permissionsByFolder, this.folders);
  }

}
