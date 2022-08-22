import { Component, OnInit, Input } from '@angular/core';
import { IFolderInfo } from '../../models/models';

export enum Role {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
}

export enum Scope {
  GLOBAL = 'GLOBAL',
  FOLDER = 'FOLDER',
}

export interface IScope {
  type: Scope;
  id?: string;
}

export interface IRole {
  role: Role;
  scope: IScope;
}

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
})
export class RoleSelectorComponent implements OnInit {

  roles = [{
    value: Role.ADMIN,
    label: 'Admin',
  }, {
    value: Role.VIEWER,
    label: 'Viewer',
  }, {
    value: Role.EDITOR,
    label: 'Editor',
  }];

  globalScope = {
    label: 'Global',
    value: {
      type: Scope.GLOBAL,
    },
  };

  scopes: Array<{
    label: string, value: {
      type: Scope,
      id?: string;
    },
  }> = [this.globalScope];

  role: Role;
  scope: {
    type: Scope,
    id?: string;
  };

  roleOptions = [
    ...this.roles,
  ];
  scopeOptions = [
    ...this.scopes,
  ];

  @Input()
  set folders(folders: IFolderInfo[]) {
    this.scopes = [
      this.globalScope,
      ...folders.map((folder) => ({
        label: '[FOLDER] (' + folder.position + ') ' + folder.metadata.title,
        value: {
          type: Scope.FOLDER,
          id: folder.id,
        },
      })),
    ];
    this.scopeOptions = [...this.scopes];
  }

  @Input()
  exclude: IRole[];

  roleChange(role: Role) {
    if (role === Role.ADMIN) {
      this.scope = this.globalScope.value;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
