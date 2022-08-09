import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromRoot from 'src/app/root-store/index';
import * as fromWorkspaceList from 'src/app/root-store/workspace/workspace-list/workspace-list.index';
import { ClearWorkspaceList, LoadWorkspaceList, SelectWorkspaceListSortOption, SelectWorkspaceListViewType, WorkspaceLoadType } from './../../../../root-store/workspace/workspace-list/workspace-list.actions';
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
  controls: Observable<IWorkspaceListItemControl[]>;
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

  workspaceListItemControls() {
    this.controls = combineLatest(this.isAdmin, this.username)
      .pipe(
        map(
          ([admin, username]) => {
            return [
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
