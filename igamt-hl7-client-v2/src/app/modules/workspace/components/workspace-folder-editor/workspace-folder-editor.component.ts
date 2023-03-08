import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { UserMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { IgListItemControl } from 'src/app/modules/ig/components/ig-list-item-card/ig-list-item-card.component';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { MessageType } from '../../../dam-framework/models/messages/message.class';
import { IgListItem } from '../../../document/models/document/ig-list-item.class';
import { BrowseType, EntityBrowseDialogComponent, IBrowserTreeNode } from '../../../shared/components/entity-browse-dialog/entity-browse-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IFolderContent, WorkspacePermissionType } from '../../models/models';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';
import { selectFolderById, selectIsWorkspaceAdmin } from './../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { selectIsAdmin } from './../../../dam-framework/store/authentication/authentication.selectors';
import { IEntityBrowserResult } from './../../../shared/components/entity-browse-dialog/entity-browse-dialog.component';
import { CloneModeEnum } from './../../../shared/constants/clone-mode.enum';
import { IFolderMetadata } from './../../models/models';
import { WorkspaceDocumentService } from './../../services/workspace-document.service';

@Component({
  selector: 'app-workspace-folder-editor',
  templateUrl: './workspace-folder-editor.component.html',
  styleUrls: ['./workspace-folder-editor.component.scss'],
})
export class WorkspaceFolderEditorComponent extends AbstractWorkspaceEditorComponent implements OnInit, OnDestroy {

  folder$: BehaviorSubject<IFolderContent>;
  folderMeta$: Observable<IFolderMetadata>;
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
  filter: string;
  listControls: Observable<IgListItemControl[]>;
  sortProperty: string;
  sortOrder: boolean;
  filter$: BehaviorSubject<string>;
  sortProperty$: BehaviorSubject<{
    property: string,
  }>;
  sortOrder$: BehaviorSubject<{
    ascending: boolean,
  }>;
  documents$: Observable<IgListItem[]>;

  // tslint:disable-next-line: cognitive-complexity
  constructor(
    actions$: Actions,
    store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
    private router: Router,
    private dialog: MatDialog,
    private workspaceDocumentService: WorkspaceDocumentService,
  ) {
    super({
      id: EditorID.WORKSPACE_FOLDER,
      title: 'Metadata',
    }, actions$, store);
    this.folder$ = new BehaviorSubject(undefined);
    this.isEditor$ = new BehaviorSubject(false);
    this.sortProperty$ = new BehaviorSubject({
      property: 'dateUpdated',
    });
    this.sortOrder$ = new BehaviorSubject({
      ascending: true,
    });
    this.filter$ = new BehaviorSubject('');

    this.folderMeta$ = this.folder$.pipe(
      flatMap((f) => {
        return this.store.select(selectFolderById, { id: f.id }).pipe(
          map((folder) => {
            return folder.metadata;
          }),
        );
      }),
    );

    this.documents$ = combineLatest(
      this.folder$,
      this.sortProperty$,
      this.sortOrder$,
      this.filter$,
    ).pipe(
      map(([folder, sortProperty, sortOrder, text]) => {
        if (!folder || !folder.documents) {
          return [];
        }
        return folder.documents.filter((item) => {
          return text && item.title.includes(text) || !text;
        }).sort((elm1, elm2) => {
          const factor: number = elm1[sortProperty.property] < elm2[sortProperty.property] ? -1 : elm2[sortProperty.property] < elm1[sortProperty.property] ? 1 : 0;
          return !sortOrder.ascending ? factor * -1 : factor;
        });
      }),
    );

    this.subs = this.currentSynchronized$.pipe(
      map((folder: IFolderContent) => {
        this.folder$.next(folder);
        this.isEditor$.next(folder.permissionType === WorkspacePermissionType.EDIT);
      }),
    ).subscribe();

    this.listControls = combineLatest(
      store.select(selectIsAdmin),
      this.store.select(selectIsWorkspaceAdmin),
      this.isEditor$,
    ).pipe(
      map(
        ([admin, wsAdmin, editor]) => {
          return [
            {
              label: 'Delete',
              class: 'btn-danger',
              icon: 'fa-trash',
              action: (item: IgListItem) => {
                this.workspaceDocumentService.execute(
                  this.workspaceDocumentService.DELETE,
                  this.folder$,
                  item,
                  new UserMessage(MessageType.SUCCESS, 'Document Deleted Successfully'),
                );
              },
              disabled: (item: IgListItem): boolean => {
                return !editor || item.status === 'PUBLISHED';
              },
              hide: (item: IgListItem): boolean => {
                return !editor || item.status === 'PUBLISHED';
              },
            }, {
              label: 'Move',
              class: 'btn-primary',
              icon: 'fa fa-arrows',
              action: (item: IgListItem) => {
                this.workspaceDocumentService.execute(
                  this.workspaceDocumentService.MOVE,
                  this.folder$,
                  item,
                  new UserMessage(MessageType.SUCCESS, 'Document Moved Successfully'),
                );
              },
              disabled: (item: IgListItem): boolean => {
                return false;
              },
              hide: (item: IgListItem): boolean => {
                return false;
              },
            }, {
              label: 'Clone',
              class: 'btn-success',
              icon: 'fa-plus',
              action: (item: IgListItem) => {
                this.workspaceDocumentService.execute(
                  this.workspaceDocumentService.CLONE,
                  this.folder$,
                  item,
                  new UserMessage(MessageType.SUCCESS, 'Document Cloned Successfully'),
                );
              },
              disabled: (item: IgListItem): boolean => {
                return !editor;
              },
              hide: (item: IgListItem): boolean => {
                return !editor;
              },
            }, {
              label: 'Lock',
              class: 'btn-dark',
              icon: 'fa-lock',
              action: (item: IgListItem) => {
                this.workspaceDocumentService.execute(
                  this.workspaceDocumentService.LOCK,
                  this.folder$,
                  item,
                  new UserMessage(MessageType.SUCCESS, 'Document Locked Successfully'),
                );
              },
              hide: (item: IgListItem): boolean => {
                return item.status === 'PUBLISHED' || item.status === 'LOCKED' || !editor;
              },
              disabled: (item: IgListItem): boolean => {
                return false;
              },
            }, {
              label: 'Publish',
              class: 'btn-secondary',
              icon: 'fa fa-globe',
              action: (item: IgListItem) => {
                this.workspaceDocumentService.execute(
                  this.workspaceDocumentService.PUBLISH,
                  this.folder$,
                  item,
                  new UserMessage(MessageType.SUCCESS, 'Document Published Successfully'),
                );
              },
              disabled: (item: IgListItem): boolean => {
                return !(admin && wsAdmin) || item.status === 'PUBLISHED';
              },
              hide: (item: IgListItem): boolean => {
                return !(admin && wsAdmin) || item.status === 'PUBLISHED';
              },
            }, {
              label: 'Derive From',
              class: 'btn-warning',
              icon: 'fa fa-code-fork',
              action: (item: IgListItem) => {
                this.workspaceDocumentService.execute(
                  this.workspaceDocumentService.DERIVE,
                  this.folder$,
                  item,
                  new UserMessage(MessageType.SUCCESS, 'Document Derived Successfully'),
                );
              },
              disabled: (item: IgListItem): boolean => {
                return false;
              },
              hide: (item: IgListItem): boolean => {
                return item.type !== 'PUBLISHED' && item.status !== 'LOCKED';
              },
            }, {
              label: 'Open',
              class: 'btn-primary',
              icon: 'fa-arrow-right',
              default: true,
              action: (item: IgListItem) => {
                this.router.navigate(['/ig', item.id]);
              },
              disabled: (item: IgListItem): boolean => {
                return false;
              },
              hide: (item: IgListItem): boolean => {
                return false;
              },
            },
          ];
        },
      ),
    );
  }

  sortPropertyChanged(sortProperty) {
    this.sortProperty$.next(sortProperty);
  }

  sortOrderChanged(sortOrder) {
    this.sortOrder$.next({
      ascending: sortOrder,
    });
  }

  filterTextChanged(text) {
    this.filter$.next(text);
  }

  addNewIg() {
    this.folder$.pipe(
      take(1),
      map((folder) => {
        this.router.navigate(['/', 'ig', 'create'], {
          queryParams: {
            workspaceId: folder.workspaceId,
            folderId: folder.id,
          },
        });
      }),
    ).subscribe();
  }

  importIg() {
    this.folder$.pipe(
      take(1),
      flatMap((folder) => {
        return this.dialog.open(EntityBrowseDialogComponent, {
          data: {
            browserType: BrowseType.ENTITY,
            scope: {
              privateIgList: true,
              publicIgList: true,
              workspaces: true,
            },
            types: [Type.IGDOCUMENT],
            exclude: (folder.children || []).map((c) => ({
              id: c.id,
              type: c.type,
            })),
            options: [{
              label: 'Import as clone',
              key: 'clone',
              checked: (node: IBrowserTreeNode) => {
                return node.data.readOnly;
              },
              value: true,
            }],
          },
        }).afterClosed();
      }),
    ).subscribe((browserResult: IEntityBrowserResult) => {
      if (browserResult) {
        this.addNodeToWorkspace(browserResult);
      }
    });
  }

  addNodeToWorkspace(browserResult: IEntityBrowserResult) {
    this.workspaceDocumentService.execute(
      (folder) => {
        return this.workspaceService.cloneToWorkspace({
          documentId: browserResult.node.data.id,
          documentType: browserResult.node.data.type,
          workspaceId: folder.workspaceId,
          folderId: folder.id,
          name: browserResult.name,
          copyInfo: {
            mode: CloneModeEnum.CLONE,
          },
        });
      },
      this.folder$,
      undefined,
      new UserMessage(MessageType.SUCCESS, 'Document Added Successfully'),
    );
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
  }

}
