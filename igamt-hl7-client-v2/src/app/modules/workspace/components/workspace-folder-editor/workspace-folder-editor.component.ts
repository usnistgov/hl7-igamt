import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { BrowseType, EntityBrowseDialogComponent, IBrowserTreeNode } from '../../../shared/components/entity-browse-dialog/entity-browse-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IFolderInfo, WorkspacePermissionType } from '../../models/models';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-folder-editor',
  templateUrl: './workspace-folder-editor.component.html',
  styleUrls: ['./workspace-folder-editor.component.scss'],
})
export class WorkspaceFolderEditorComponent extends AbstractWorkspaceEditorComponent implements OnInit, OnDestroy {

  folder$: BehaviorSubject<IFolderInfo>;
  isEditor$: BehaviorSubject<boolean>;
  subs: Subscription;
  sortOptions = [
    {
      label: 'Date Updated',
      value: {
        property: 'dateUpdated',
      },
    },
    {
      label: 'Title',
      value: {
        property: 'title',
      },
    },
  ];
  sortOrder = {
    ascending: true,
  };
  filter: string;
  sortProperty = {
    property: 'dateUpdated',
  };

  constructor(
    actions$: Actions,
    store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
    private dialog: MatDialog,
  ) {
    super({
      id: EditorID.WORKSPACE_FOLDER,
      title: 'Metadata',
    }, actions$, store);
    this.folder$ = new BehaviorSubject(undefined);
    this.isEditor$ = new BehaviorSubject(false);

    this.subs = this.currentSynchronized$.pipe(
      map((folder: IFolderInfo) => {
        this.folder$.next(folder);
        this.isEditor$.next(folder.permissionType === WorkspacePermissionType.EDIT);
      }),
    ).subscribe();
  }

  sortPropertyChanged(sortProperty) {
    console.log(sortProperty);
  }

  sortOrderChanged(sortOrder) {
    console.log(sortOrder);
  }

  filterTextChanged(text) {
    console.log(text);
  }

  importIg() {
    this.dialog.open(EntityBrowseDialogComponent, {
      data: {
        browserType: BrowseType.ENTITY,
        scope: {
          privateIgList: true,
          publicIgList: true,
          workspaces: true,
        },
        types: [Type.IGDOCUMENT],
        options: [{
          label: 'Import as clone',
          key: 'clone',
          checked: (node: IBrowserTreeNode) => {
            return node.data.readOnly;
          },
          value: true,
        }],
      },
    });
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return of();
  }

  editorDisplayNode(): Observable<any> {
    return of();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

}
