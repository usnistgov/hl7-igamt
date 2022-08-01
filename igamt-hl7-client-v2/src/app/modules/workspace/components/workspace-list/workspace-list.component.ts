import { WorkspaceListItemControl } from './../workspace-list-card/workspace-list-card.component';
import { ClearAll } from './../../../dam-framework/store/messages/messages.actions';
import { ConfirmDialogComponent } from './../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { WorkspaceLoadType, DeleteWorkspaceListItemRequest, SelectWorkspaceListViewType, LoadWorkspaceList, SelectWorkspaceListSortOption, ClearWorkspaceList } from './../../../../root-store/workspace/workspace-list/workspace-list.actions';
import { IWorkspaceListItem } from './../../../shared/models/workspace-list-item.interface';
import { combineLatest, Observable } from 'rxjs';
import { WorkspaceService } from './../../services/workspace.service';
import { MessageService } from './../../../dam-framework/services/message.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as fromRoot from 'src/app/root-store/index';
import * as fromWorkspaceList from 'src/app/root-store/workspace/workspace-list/workspace-list.index';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss']
})
export class WorkspaceListComponent implements OnInit {

  constructor(
    private store: Store<fromRoot.IRouteState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private message: MessageService,
    private workspaceService: WorkspaceService) {
    this.storeSelectors();
    this.initializeProperties();
    this.workspaceListItemControls();
  }

  listItems: Observable<IWorkspaceListItem[]>;
  viewType: Observable<WorkspaceLoadType>;
  isAdmin: Observable<boolean>;
  username: Observable<string>;
  filter: string;
  _shadowViewType: WorkspaceLoadType;
  controls: Observable<WorkspaceListItemControl[]>;
  sortOptions: any;
  sortProperty: {
    property: string,
  };
  sortOrder: {
    ascending: boolean,
  };

  storeSelectors() {
    this.listItems = this.store.select(fromWorkspaceList.selectWorkspaceListViewFilteredAndSorted, { filter: this.filter });
    this.viewType = this.store.select(fromWorkspaceList.selectViewType);
    this.isAdmin = this.store.select(fromAuth.selectIsAdmin);
    this.username = this.store.select(fromAuth.selectUsername);
    this.store.select(fromWorkspaceList.selectSortOptions).subscribe(
      (next) => {
        this.sortOrder = {
          ascending: next.ascending,
        };
        this.sortProperty = {
          property: next.property,
        };
      },
    );
  }

  initializeProperties() {
    this.sortOptions = [
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
  }

  // tslint:disable-next-line:cognitive-complexity
  workspaceListItemControls() {
    this.controls = combineLatest(this.isAdmin, this.username)
      .pipe(
        map(
          ([admin, username]) => {

            return [
              {
                label: 'Share',
                class: 'btn-primary',
                icon: 'fa-share',
                action: (item: IWorkspaceListItem) => {
                },
                disabled: (item: IWorkspaceListItem): boolean => {
                  return username !== item.username || item.type === 'PUBLIC';
                },
                hide: (item: IWorkspaceListItem): boolean => {
                  return item.type === 'PUBLIC' || item.type === 'SHARED';
                },
              },
              {
                label: 'Delete',
                class: 'btn-danger',
                icon: 'fa-trash',
                action: (item: IWorkspaceListItem) => {
                  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: {
                      question: 'Are you sure you want to delete Implementation Guide "' + item.title + '" ?',
                      action: 'Delete Implementation Guide',
                    },
                  });

                  dialogRef.afterClosed().subscribe(
                    (answer) => {
                      if (answer) {
                        this.store.dispatch(new DeleteWorkspaceListItemRequest(item.id));
                      }
                    },
                  );
                },
                disabled: (item: IWorkspaceListItem): boolean => {
                  if (item.type === 'PUBLIC' || item.type === 'SHARED') {
                    return true;
                  } else {
                    return false;
                  }
                },
                hide: (item: IWorkspaceListItem): boolean => {
                  return item.type === 'PUBLIC' || item.type === 'SHARED';
                },
              },
              {
                label: 'Edit',
                class: 'btn-info',
                icon: 'fa-pencil',
                default: true,
                action: (item: IWorkspaceListItem) => {
                  this.router.navigate(['workspace', item.id]);
                },
                disabled: (item: IWorkspaceListItem): boolean => {
                  return false;
                },
                hide: (item: IWorkspaceListItem): boolean => {
                    return false;
                },
              },
            ];
          },
        ),
      );
  }

  publishDialog(item: IWorkspaceListItem) {

  }

  hideEdit(item: IWorkspaceListItem) {
    return false;
  }

  // On View Type Changed
  selectViewType(viewType: WorkspaceLoadType) {
    this._shadowViewType = viewType;
    this.store.dispatch(new SelectWorkspaceListViewType(viewType || 'PRIVATE'));
    this.store.dispatch(new LoadWorkspaceList({
      type: viewType,
    }));
  }

  // On Filter Text Changed
  filterTextChanged(text: string) {
    this.listItems = this.store.select(fromWorkspaceList.selectWorkspaceListViewFilteredAndSorted, { filter: text });
  }

  // On Sort Property Changed
  sortPropertyChanged(value: any) {
    this.store.dispatch(new SelectWorkspaceListSortOption(Object.assign(Object.assign({}, this.sortOrder), value)));
  }

  // On Sort Order Changed
  sortOrderChanged(value: any) {
    this.sortOrder.ascending = value;
    this.store.dispatch(new SelectWorkspaceListSortOption(Object.assign(Object.assign({}, this.sortProperty), this.sortOrder)));
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.selectViewType(params['type']);
      } else {
        this.router.navigate(['.'], {
          queryParams: {
            type: 'PRIVATE',
          },
          relativeTo: this.route,
        });
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearWorkspaceList());
  }

}
