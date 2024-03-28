import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import { SharingDialogComponent } from 'src/app/modules/shared/components/sharing-dialog/sharing-dialog.component';
import * as fromCodeSetList from 'src/app/root-store/code-set-editor/code-set-list/code-set-list.index';
import * as fromRoot from 'src/app/root-store/index';
import { ICodeSetListItem } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';
import { ICodeSetListItemControl } from '../code-set-editor-list-card/code-set-editor-list-card.component';
import { DeleteCodeSetDialogComponent } from '../delete-code-set-dialog/delete-code-set-dialog.component';
import { ClearCodeSetList, CodeSetLoadType, DeleteCodeSetListItemSuccess, LoadCodeSetList, SelectCodeSetListSortOption, SelectCodeSetListViewType, UpdatePendingInvitationCount } from './../../../../root-store/code-set-editor/code-set-list/code-set-list.actions';
import { MessageService } from './../../../dam-framework/services/message.service';
import { ClearAll } from './../../../dam-framework/store/messages/messages.actions';

@Component({
  selector: 'app-code-set-editor-list',
  templateUrl: './code-set-editor-list.component.html',
  styleUrls: ['./code-set-editor-list.component.scss'],
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
                label: 'Share',
                class: 'btn-primary',
                icon: 'fa-share',
                action: (item: ICodeSetListItem) => {
                  this.shareDialog(item, username);
                },
                disabled: (item: ICodeSetListItem): boolean => {
                  return username !== item.username || item.type === 'PUBLIC';
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return item.type === 'PUBLIC' || item.type === 'SHARED' || username !== item.username;
                },
              },
              {
                label: 'Delete',
                class: 'btn-danger',
                icon: 'fa-trash',
                action: (item: ICodeSetListItem) => {
                  this.deleteConfirmation(item);

                },
                disabled: (item: ICodeSetListItem): boolean => {
                  if (item.type === 'PUBLIC' || item.type === 'SHARED') {
                    return true;
                  } else {
                    return false;
                  }
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return item.type === 'PUBLIC' || item.type === 'SHARED';
                },
              },
              {
                label: 'Clone',
                class: 'btn-success',
                icon: 'fa-file-o',
                action: (item: ICodeSetListItem) => {
                  this.cloneCodeSet(item);
                },
                disabled: (item: ICodeSetListItem): boolean => {
                  return false;
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return false;
                },
              },
              {
                label: 'Publish',
                class: 'btn-secondary',
                icon: 'fa fa-globe',
                action: (item: ICodeSetListItem) => {
                  this.publishDialog(item);
                },
                disabled: (item: ICodeSetListItem): boolean => {
                  return !admin || item.type === 'PUBLIC';
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return !admin || item.type === 'PUBLIC' || item.type === 'SHARED';
                },
              },

              {
                label: 'Open',
                class: 'btn-primary',
                icon: 'fa-arrow-right',
                default: true,
                action: (item: ICodeSetListItem) => {
                  this.router.navigate(['code-set', item.id]);
                },
                disabled: (item: ICodeSetListItem): boolean => {
                  return false;
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return false;
                },
              },
              {
                label: 'View',
                class: 'btn-info',
                icon: 'fa-eye',
                default: true,
                action: (item: ICodeSetListItem) => {
                  this.router.navigate(['code-set', item.id]);
                },
                disabled: (item: ICodeSetListItem): boolean => {
                  return false;
                },
                hide: (item: ICodeSetListItem): boolean => {
                  return this.hideForShared('View', item.type, item.sharePermission);
                },
              },
            ];
          },
        ),
      );
  }

  shareDialog(item: ICodeSetListItem, username: string) {
    const dialogRef = this.dialog.open(SharingDialogComponent, {
      data: { item, username },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.codeSetService.updateViewers(result, item.id).subscribe(
          (response: Message<string>) => {
            item.sharedUsers = result;
            this.store.dispatch(this.messageService.messageToAction(response));
            this.router.navigateByUrl('/code-set/list?type=PRIVATE');
          },
          (error) => {
            this.store.dispatch(this.messageService.actionFromError(error));
          },
        );
      }
    });
  }

  hideForShared(label: string, type: string, permission: string) {
    if (label === 'Edit') {
      if (type === 'SHARED' && permission === 'WRITE') {
        return false;
      }
      return true;
    }
    if (label === 'View') {
      if (type === 'SHARED' && permission === 'READ') {
        return false;
      }
      return true;
    }
  }

  deleteConfirmation(item: ICodeSetListItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to delete this Code Set "' + item.title + '" ?',
        action: 'Delete Code Set',
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.store.dispatch(new fromCodeSetList.DeleteCodeSetListItemRequest(item.id));
        }
      },
    );
  }

  publishDialog(item: ICodeSetListItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to Publish this Code Set "' + item.title + '" ?',
        action: 'Delete Code Set',
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.publishCodeSet(item);
        }
      },
    );
  }

  hideEdit(item: ICodeSetListItem) {
    return false;
  }

  cloneCodeSet(item: ICodeSetListItem) {

    this.codeSetService.cloneCodeSet(item.id).subscribe(
      (response: Message<string>) => {
        this.store.dispatch(this.messageService.messageToAction(response));
        this.router.navigate(['code-set', response.data]);
      },
      (error) => {
        this.store.dispatch(this.messageService.actionFromError(error));
      },
    );

  }

  publishCodeSet(item: ICodeSetListItem) {

    this.codeSetService.publishCodeSet(item.id).subscribe(
      (response: Message<string>) => {
        this.store.dispatch(this.messageService.messageToAction(response));
        this.router.navigateByUrl('/code-set/list?type=PUBLIC');
      },
      (error) => {
        this.store.dispatch(this.messageService.actionFromError(error));
      },
    );

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
