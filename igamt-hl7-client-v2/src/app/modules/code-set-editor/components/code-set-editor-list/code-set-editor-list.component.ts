import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromRoot from 'src/app/root-store/index';
import * as fromCodeSetList from 'src/app/root-store/code-set-editor/code-set-list/code-set-list.index';
import { ClearCodeSetList, DeleteCodeSetListItemSuccess, LoadCodeSetList, SelectCodeSetListSortOption, SelectCodeSetListViewType, UpdatePendingInvitationCount, CodeSetLoadType } from './../../../../root-store/code-set-editor/code-set-list/code-set-list.actions';
import { MessageService } from './../../../dam-framework/services/message.service';
import { ClearAll } from './../../../dam-framework/store/messages/messages.actions';
import { CodeSetServiceService } from '../../services/CodeSetService.service';
import { DeleteCodeSetDialogComponent } from '../delete-code-set-dialog/delete-code-set-dialog.component';
import { ICodeSetListItem } from '../../models/code-set.models';
import { ICodeSetListItemControl } from '../code-set-editor-list-card/code-set-editor-list-card.component';


@Component({
  selector: 'app-code-set-editor-list',
  templateUrl: './code-set-editor-list.component.html',
  styleUrls: ['./code-set-editor-list.component.scss']
})
export class CodeSetEditorListComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<fromRoot.IRouteState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private messageService: MessageService,
    private codeSetService: CodeSetServiceService) {
    this.storeSelectors();
    this.initializeProperties();
    this.codeSetListItemControls();
  }

  listItems: Observable<ICodeSetListItem[]>;
  viewType: Observable<CodeSetLoadType>;
  isAdmin: Observable<boolean>;
  username: Observable<string>;
  filter: string;
  _shadowViewType: CodeSetLoadType;
  controls: Observable<ICodeSetListItemControl[]>;
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
    this.listItems = this.store.select(fromCodeSetList.selectCodeSetListViewFilteredAndSorted, { filter: this.filter });
    this.viewType = this.store.select(fromCodeSetList.selectViewType);
    this.isAdmin = this.store.select(fromAuth.selectIsAdmin);
    this.username = this.store.select(fromAuth.selectUsername);
    this.sortOptionsSubs = this.store.select(fromCodeSetList.selectSortOptions).subscribe(
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

  codeSetListItemControls() {
    this.controls = combineLatest(this.isAdmin, this.username)
      .pipe(
        map(
          ([admin, username]) => {
            return [
              {
                label: 'Delete',
                class: 'btn-danger',
                icon: 'fa-trash',
                action: (item: ICodeSetListItem) => {
                  this.dialog.open(DeleteCodeSetDialogComponent, {
                    data: {
                      name: item.title,
                    },
                  }).afterClosed().pipe(
                    tap((answer) => {
                      if (answer) {
                        this.store.dispatch(new fromCodeSetList.DeleteCodeSetListItemRequest(item.id));
                      }
                    }),
                  ).subscribe();
                },
                disabled: (item: ICodeSetListItem): boolean => {
                  return false;
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return item.username !== username;
                },
              },
              {
                label: 'Open',
                class: 'btn-primary',
                icon: 'fa-arrow-right',
                action: (item: ICodeSetListItem) => {
                  this.router.navigate(['code-set', item.id]);
                },
                disabled: (item: ICodeSetListItem): boolean => {
                  return false;
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return item.invitation;
                },
              },
            ];
          },
        ),
      );
  }

  publishDialog(item: ICodeSetListItem) {

  }

  hideEdit(item: ICodeSetListItem) {
    return false;
  }

  // On View Type Changed
  selectViewType(viewType: CodeSetLoadType) {
    this._shadowViewType = viewType;
    this.store.dispatch(new SelectCodeSetListViewType(viewType || 'PRIVATE'));
    this.store.dispatch(new LoadCodeSetList({
      type: viewType,
    }));
  }

  // On Filter Text Changed
  filterTextChanged(text: string) {
    this.listItems = this.store.select(fromCodeSetList.selectCodeSetListViewFilteredAndSorted, { filter: text });
  }

  // On Sort Property Changed
  sortPropertyChanged(value: any) {
    this.store.dispatch(new SelectCodeSetListSortOption(Object.assign(Object.assign({}, this.sortOrder), value)));
  }

  // On Sort Order Changed
  sortOrderChanged(value: any) {
    this.sortOrder.ascending = value;
    this.store.dispatch(new SelectCodeSetListSortOption(Object.assign(Object.assign({}, this.sortProperty), this.sortOrder)));
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
    this.routeParamsSubs = this.route.queryParams.subscribe((params) => {
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
    if (this.routeParamsSubs) {
      this.routeParamsSubs.unsubscribe();
    }
    if (this.sortOptionsSubs) {
      this.sortOptionsSubs.unsubscribe();
    }
    this.store.dispatch(new ClearCodeSetList());
  }

}
