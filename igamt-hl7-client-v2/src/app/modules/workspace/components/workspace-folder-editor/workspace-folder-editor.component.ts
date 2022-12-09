import { IEntityBrowserResult } from './../../../shared/components/entity-browse-dialog/entity-browse-dialog.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { UserMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { IgListItemControl } from 'src/app/modules/ig/components/ig-list-item-card/ig-list-item-card.component';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { MessageType } from '../../../dam-framework/models/messages/message.class';
import { EditorUpdate } from '../../../dam-framework/store/data/dam.actions';
import { IgListItem } from '../../../document/models/document/ig-list-item.class';
import { BrowseType, EntityBrowseDialogComponent, IBrowserTreeNode } from '../../../shared/components/entity-browse-dialog/entity-browse-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IFolderContent, WorkspacePermissionType } from '../../models/models';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-folder-editor',
  templateUrl: './workspace-folder-editor.component.html',
  styleUrls: ['./workspace-folder-editor.component.scss'],
})
export class WorkspaceFolderEditorComponent extends AbstractWorkspaceEditorComponent implements OnInit, OnDestroy {

  folder$: BehaviorSubject<IFolderContent>;
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

    this.listControls = this.isEditor$
      .pipe(
        map(
          (editor) => {
            return [
              {
                label: 'Delete',
                class: 'btn-danger',
                icon: 'fa-trash',
                action: (item: IgListItem) => {
                  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: {
                      question: 'Are you sure you want to delete Implementation Guide "' + item.title + '" ?',
                      action: 'Delete Implementation Guide',
                    },
                  });

                  dialogRef.afterClosed().subscribe(
                    (answer) => {
                      if (answer) {
                        // HANDLE DELETE
                      }
                    },
                  );
                },
                disabled: (item: IgListItem): boolean => {
                  return !editor;
                },
                hide: (item: IgListItem): boolean => {
                  return !editor;
                },
              },
              {
                label: 'Clone',
                class: 'btn-success',
                icon: 'fa-plus',
                action: (item: IgListItem) => {
                  this.cloneIgIntoFolder(item.id, Type.IGDOCUMENT);
                },
                disabled: (item: IgListItem): boolean => {
                  return !editor;
                },
                hide: (item: IgListItem): boolean => {
                  return !editor;
                },
              },
              {
                label: 'Derive from',
                class: 'btn-secondary',
                icon: 'fa fa-map-marker',
                action: (item: IgListItem) => {
                  // HANDLE DERIVE
                },
                disabled: (item: IgListItem): boolean => {
                  return false;
                },
                hide: (item: IgListItem): boolean => {
                  return item.type !== 'PUBLISHED';
                },
              },
              {
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
          }
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
    this.cloneIgIntoFolder(browserResult.node.data.id, browserResult.node.data.type, browserResult.name);
  }

  cloneIgIntoFolder(igId: string, documentType: Type, name?: string) {
    this.folder$.pipe(
      take(1),
      flatMap((folder) => {
        return this.workspaceService.cloneToWorkspace({
          documentId: igId,
          documentType,
          workspaceId: folder.workspaceId,
          folderId: folder.id,
          name,
        }).pipe(
          flatMap((ws) => {
            return this.workspaceService.getWorkspaceFolderContent(folder.workspaceId, folder.id).pipe(
              flatMap((folderContent) => {
                this.folder$.next(folderContent);
                return [
                  ...this.workspaceService.getWorkspaceInfoUpdateAction(ws),
                  new EditorUpdate({ value: folderContent, updateDate: false }),
                  this.messageService.userMessageToAction(new UserMessage(MessageType.SUCCESS, 'Document Added Successfully')),
                ];
              }),
              tap((action) => {
                this.store.dispatch(action);
              }),
            );
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
    this.subs.unsubscribe();
  }

  ngOnInit() {
  }

  onDeactivate() {
  }

}
