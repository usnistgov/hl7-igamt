import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import { WorkspaceListService } from 'src/app/modules/workspace/services/workspace-list.service';
import * as fromRoot from 'src/app/root-store/index';
import * as fromWorkspaceList from 'src/app/root-store/workspace/workspace-list/workspace-list.index';
import { DeleteWorkspaceDialogComponent } from '../delete-workspace-dialog/delete-workspace-dialog.component';
import { ClearWorkspaceList, DeleteWorkspaceListItemSuccess, LoadWorkspaceList, SelectWorkspaceListSortOption, SelectWorkspaceListViewType, UpdatePendingInvitationCount, WorkspaceLoadType } from './../../../../root-store/workspace/workspace-list/workspace-list.actions';
import { selectWorkspacePendingInvitations } from './../../../../root-store/workspace/workspace-list/workspace-list.selectors';
import { MessageService } from './../../../dam-framework/services/message.service';
import { ClearAll } from './../../../dam-framework/store/messages/messages.actions';
import { IWorkspaceListItem } from './../../../shared/models/workspace-list-item.interface';
import { WorkspaceService } from './../../services/workspace.service';
import { IWorkspaceListItemControl } from './../workspace-list-card/workspace-list-card.component';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
})
export class WorkspaceListComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<fromRoot.IRouteState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private messageService: MessageService,
    private workspaceService: WorkspaceService,
    private workspaceListService: WorkspaceListService) {
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
  controls: Observable<IWorkspaceListItemControl[]>;
  sortOptions: any;
  sortProperty: {
    property: string,
  };
  sortOrder: {
    ascending: boolean,
  };
  pendingCount: Observable<number>;
  sortOptionsSubs: Subscription;
  routeParamsSubs: Subscription;

  storeSelectors() {
    this.listItems = this.store.select(fromWorkspaceList.selectWorkspaceListViewFilteredAndSorted, { filter: this.filter });
    this.viewType = this.store.select(fromWorkspaceList.selectViewType);
    this.isAdmin = this.store.select(fromAuth.selectIsAdmin);
    this.username = this.store.select(fromAuth.selectUsername);
    this.pendingCount = this.store.select(selectWorkspacePendingInvitations);
    this.sortOptionsSubs = this.store.select(fromWorkspaceList.selectSortOptions).subscribe(
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

  workspaceListItemControls() {
    this.controls = combineLatest(this.isAdmin, this.username)
      .pipe(
        map(
          ([admin, username]) => {
            return [
              {
                label: 'Delete',
                class: 'btn-danger',
                icon: 'fa-trash',
                action: (item: IWorkspaceListItem) => {
                  this.dialog.open(DeleteWorkspaceDialogComponent, {
                    data: {
                      name: item.title,
                    },
                  }).afterClosed().pipe(
                    tap((answer) => {
                      if (answer) {
                        this.store.dispatch(new fromWorkspaceList.DeleteWorkspaceListItemRequest(item.id));
                      }
                    }),
                  ).subscribe();
                },
                disabled: (item: IWorkspaceListItem): boolean => {
                  return false;
                },
                hide: (item: IWorkspaceListItem): boolean => {
                  return item.username !== username;
                },
              },
              {
                label: 'Open',
                class: 'btn-primary',
                icon: 'fa-arrow-right',
                action: (item: IWorkspaceListItem) => {
                  this.router.navigate(['workspace', item.id]);
                },
                disabled: (item: IWorkspaceListItem): boolean => {
                  return false;
                },
                hide: (item: IWorkspaceListItem): boolean => {
                  return item.invitation;
                },
              },
              {
                label: 'Accept Invitation',
                class: 'btn-success',
                icon: 'fa-check',
                action: (item: IWorkspaceListItem) => {
                  this.workspaceService.acceptWorkspaceInvitation(item.id).pipe(
                    map((response) => {
                      this.store.dispatch(this.messageService.messageToAction(response));
                      this.router.navigate(['workspace', item.id]);
                    }),
                    catchError((err) => {
                      this.store.dispatch(this.messageService.actionFromError(err));
                      return throwError(err);
                    }),
                  ).subscribe();
                },
                disabled: (item: IWorkspaceListItem): boolean => {
                  return false;
                },
                hide: (item: IWorkspaceListItem): boolean => {
                  return !item.invitation;
                },
              },
              {
                label: 'Decline Invitation',
                class: 'btn-danger',
                icon: 'fa-times',
                action: (item: IWorkspaceListItem) => {
                  this.workspaceService.declineWorkspaceInvitation(item.id).pipe(
                    flatMap((response) => {
                      return this.workspaceListService.getWorkspacesPendingCount().pipe(
                        map((count) => {
                          this.store.dispatch(this.messageService.messageToAction(response));
                          this.store.dispatch(new DeleteWorkspaceListItemSuccess(item.id));
                          this.store.dispatch(new UpdatePendingInvitationCount(count));
                        }),
                      );
                    }),
                    catchError((err) => {
                      this.store.dispatch(this.messageService.actionFromError(err));
                      return throwError(err);
                    }),
                  ).subscribe();
                },
                disabled: (item: IWorkspaceListItem): boolean => {
                  return false;
                },
                hide: (item: IWorkspaceListItem): boolean => {
                  return !item.invitation;
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
    this.routeParamsSubs = this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.selectViewType(params['type']);
      } else {
        this.router.navigate(['.'], {
          queryParams: {
            type: 'MEMBER',
          },
          relativeTo: this.route,
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.routeParamsSubs) {
      this.routeParamsSubs.unsubscribe();
    }
    if (this.sortOptionsSubs) {
      this.sortOptionsSubs.unsubscribe();
    }
    this.store.dispatch(new ClearWorkspaceList());
  }

}
