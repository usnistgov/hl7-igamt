import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { Type } from '../../constants/type.enum';
import { DiscoverableListItem, IgListItem } from './../../../document/models/document/ig-list-item.class';

@Component({
  selector: 'app-document-browser',
  templateUrl: './document-browser.component.html',
  styleUrls: ['./document-browser.component.scss'],
})
export class DocumentBrowserComponent implements OnInit {

  loading = false;
  currentList: DiscoverableListItem[] = [];
  items: MenuItem[] = [];

  @ViewChild('folder', null) folder: TemplateRef<HTMLElement>;
  @ViewChild('ig', null) ig: TemplateRef<HTMLElement>;
  @ViewChild('workspace', null) workspace: TemplateRef<HTMLElement>;
  @ViewChild('default', null) default: TemplateRef<HTMLElement>;
  constructor(
    public dialogRef: MatDialogRef<DocumentBrowserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDocumentFileBrowserData,
    private http: HttpClient,
  ) { }

  ngOnInit() { }

  load(accessType: string, targetType: string) {
    this.loading = true;
    this.items = [];
    const loadFn = (x) => {
      this.items.push({ label: accessType });
      this.currentList = x;
      this.loading = false;
    };

    if (targetType.toLowerCase() === 'workspace') {
      this.items.push({ label: 'Workspaces' });
      this.fetchWorkspaceList(accessType).subscribe(loadFn);
    } else if (targetType.toLowerCase() === 'igdocument') {
      this.items.push({ label: 'IG Document List' });
      this.fetchIgList(accessType).subscribe(loadFn);
    }
  }

  fetchIgList(type: string): Observable<IgListItem[]> {
    return this.http.get<IgListItem[]>('api/igdocuments', {
      params: {
        type,
      },
    });
  }

  getTemplateByListItem(elm: DiscoverableListItem) {
    if (elm.resourceType === Type.WORKSPACE) {
      return this.workspace;
    } else if (elm.resourceType === Type.FOLDER) {
      return this.folder;
    } else if (elm.resourceType === Type.IGDOCUMENT) {
      return this.ig;
    } else { return this.default; }
  }

  selectIgDocument(item: DiscoverableListItem) {
    this.dialogRef.close({ id: item.id });
  }
  fetchWorkspaceList(type: string): Observable<DiscoverableListItem[]> {
    return this.http.get<DiscoverableListItem[]>('api/workspaces', {
      params: {
        type,
      },
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close();
  }
}

export interface IDocumentFileBrowserData {
  root: IFolderTreeNode[];
}

export interface IDocumentFileBrowserReturn {
  newTitle?: string;
  id: string;
  type: Type;
  path: string;
}

export enum ISaveOption {
  COPY = 'COPY',
  MOVE = 'MOVE',
}

export interface IFolderTreeNode {
  title: string;
  children: IFolderTreeNode[];
  type: Type;
  id: string;
  leaf: boolean;
  data: any;
  loadChildren: (type, id) => Observable<IFolderTreeNode>;
}
