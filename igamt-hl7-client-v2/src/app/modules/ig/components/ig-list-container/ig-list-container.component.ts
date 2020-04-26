import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import * as fromAuth from 'src/app/root-store/authentication/authentication.reducer';
import {
  DeleteIgListItemRequest,
  IgListLoad,
  LoadIgList,
  SelectIgListSortOption,
  SelectIgListViewType,
} from 'src/app/root-store/ig/ig-list/ig-list.actions';
import * as fromIgList from 'src/app/root-store/ig/ig-list/ig-list.index';
import * as fromRoot from 'src/app/root-store/index';
import {ClearIgList} from '../../../../root-store/ig/ig-list/ig-list.actions';
import {ClearAll} from '../../../../root-store/page-messages/page-messages.actions';
import {DeriveDialogComponent} from '../../../shared/components/derive-dialog/derive-dialog.component';
import {CloneModeEnum} from '../../../shared/constants/clone-mode.enum';
import {Type} from '../../../shared/constants/type.enum';
import {IgListItem} from '../../models/ig/ig-list-item.class';
import {IgService} from '../../services/ig.service';
import {Message} from './../../../core/models/message/message.class';
import {MessageService} from './../../../core/services/message.service';
import {ConfirmDialogComponent} from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import {SharingDialogComponent} from './../../../shared/components/sharing-dialog/sharing-dialog.component';
import {IgListItemControl} from './../ig-list-item-card/ig-list-item-card.component';

@Component({
  selector: 'app-ig-list-container',
  templateUrl: './ig-list-container.component.html',
  styleUrls: ['./ig-list-container.component.scss'],
})
export class IgListContainerComponent implements OnInit, OnDestroy {

  listItems: Observable<IgListItem[]>;
  viewType: Observable<IgListLoad>;
  isAdmin: Observable<boolean>;
  username: Observable<string>;
  filter: string;
  _shadowViewType: IgListLoad;
  controls: Observable<IgListItemControl[]>;
  sortOptions: any;
  sortProperty: {
    property: string,
  };
  sortOrder: {
    ascending: boolean,
  };

  constructor(
    private store: Store<fromRoot.IRouteState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private message: MessageService,
    private ig: IgService) {
    this.storeSelectors();
    this.initializeProperties();
    this.igListItemControls();
  }

  storeSelectors() {
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: this.filter });
    this.viewType = this.store.select(fromIgList.selectViewType);
    this.isAdmin = this.store.select(fromAuth.selectIsAdmin);
    this.username = this.store.select(fromAuth.selectUsername);
    this.store.select(fromIgList.selectSortOptions).subscribe(
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

  igListItemControls() {
    this.controls = combineLatest(this.isAdmin, this.username)
        .pipe(
            map(
                ([admin, username]) => {

                  return [
                    {
                      label: 'Share',
                      class: 'btn-primary',
                      icon: 'fa-share',
                      action: (item: IgListItem) => {
                        this.shareDialog(item, username);
                      },
                      disabled: (item: IgListItem): boolean => {
                        return username !== item.username || item.type === 'PUBLISHED';
                      },
                      hide: (item: IgListItem): boolean => {
                        return item.type === 'PUBLISHED' || item.type === 'SHARED';
                      },
                    },
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
                                this.store.dispatch(new DeleteIgListItemRequest(item.id));
                              }
                            },
                        );
                      },
                      disabled: (item: IgListItem): boolean => {
                        if (item.type === 'PUBLISHED' || item.type === 'SHARED') {
                          return true;
                        } else {
                          return false;
                        }
                      },
                      hide: (item: IgListItem): boolean => {
                        return item.type === 'PUBLISHED' || item.type === 'SHARED';
                      },
                    },
                    {
                      label: 'Clone',
                      class: 'btn-success',
                      icon: 'fa-plus',
                      action: (item: IgListItem) => {
                        this.ig.cloneIg(item.id, CloneModeEnum.CLONE, null).subscribe(
                            (response: Message<string>) => {
                              this.store.dispatch(this.message.messageToAction(response));
                              this.router.navigate(['ig', response.data]);
                            },
                            (error) => {
                              this.store.dispatch(this.message.actionFromError(error));
                            },
                        );
                      },
                      disabled: (item: IgListItem): boolean => {
                        return false;
                      },
                    },
                    {
                      label: 'Publish',
                      class: 'btn-secondary',
                      icon: 'fa fa-globe',
                      action: (item: IgListItem) => {
                        this.publishDialog(item);
                      },
                      disabled: (item: IgListItem): boolean => {
                        return !admin || item.type === 'PUBLISHED';
                      },
                      hide: (item: IgListItem): boolean => {
                        return item.type === 'PUBLISHED' || item.type === 'SHARED';
                      },
                    },
                    {
                      label: 'Derive from',
                      class: 'btn-secondary',
                      icon: 'fa fa-map-marker',
                      action: (item: IgListItem) => {
                        this.ig.cloneIg(item.id, CloneModeEnum.DERIVE, null).subscribe(
                            (response: Message<string>) => {
                              this.store.dispatch(this.message.messageToAction(response));
                              this.router.navigate(['ig', response.data]);
                            },
                            (error) => {
                              this.store.dispatch(this.message.actionFromError(error));
                            },
                        );
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
                        this.router.navigate(['ig', item.id]);
                      },
                      disabled: (item: IgListItem): boolean => {
                        return false;
                      },
                      hide: (item: IgListItem): boolean => {
                        return item.type === 'SHARED';
                      },
                    },
                    {
                      label: 'View',
                      class: 'btn-info',
                      icon: 'fa-eye',
                      default: true,
                      action: (item: IgListItem) => {
                        this.router.navigate(['ig', item.id]);
                      },
                      disabled: (item: IgListItem): boolean => {
                        return false;
                      },
                      hide: (item: IgListItem): boolean => {
                        return this.hideForShared('View', item.type, item.sharePermission);
                      },
                    },
                    {
                      label: 'Edit',
                      class: 'btn-info',
                      icon: 'fa-pencil',
                      default: true,
                      action: (item: IgListItem) => {
                        this.router.navigate(['ig', item.id]);
                      },
                      disabled: (item: IgListItem): boolean => {
                        return false;
                      },
                      hide: (item: IgListItem): boolean => {
                        return this.hideForShared('Edit', item.type, item.sharePermission);
                      },
                    },
                  ];
                },
            ),
        );
  }

  shareDialog(item: IgListItem, username: string) {
    const dialogRef = this.dialog.open(SharingDialogComponent, {
      data: { item, username },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ig.updateSharedUsers(result, item.id).subscribe(
            (response: Message<string>) => {
              item.sharedUsers = result.sharedUsers;
              item.currentAuthor = result.currentAuthor;
              this.store.dispatch(this.message.messageToAction(response));
              this.router.navigateByUrl('/ig/list?type=USER');
            },
            (error) => {
              this.store.dispatch(this.message.actionFromError(error));
            },
        );
      }
    });
  }
  publishDialog(item: IgListItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'This operation is irreversible, Are you sure you want to publish this Implementation Guide "' + item.title + '" ?',
        action: 'Publish Implementation Guide',
      },
    });
    dialogRef.afterClosed().subscribe(
        (answer) => {
          if (answer) {
            this.ig.publish(item.id).subscribe(
                (response: Message<string>) => {
                  this.store.dispatch(this.message.messageToAction(response));
                  this.router.navigateByUrl('/ig/list?type=PUBLISHED');
                },
                (error) => {
                  this.store.dispatch(this.message.actionFromError(error));
                },
            );
          }
        },
    );
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

  // On View Type Changed
  selectViewType(viewType: IgListLoad) {
    this._shadowViewType = viewType;
    this.store.dispatch(new SelectIgListViewType(viewType || 'USER'));
    this.store.dispatch(new LoadIgList({
      type: viewType,
    }));
  }

  // On Filter Text Changed
  filterTextChanged(text: string) {
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: text });
  }

  // On Sort Property Changed
  sortPropertyChanged(value: any) {
    this.store.dispatch(new SelectIgListSortOption(Object.assign(Object.assign({}, this.sortOrder), value)));
  }

  // On Sort Order Changed
  sortOrderChanged(value: any) {
    this.sortOrder.ascending = value;
    this.store.dispatch(new SelectIgListSortOption(Object.assign(Object.assign({}, this.sortProperty), this.sortOrder)));
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.selectViewType(params['type']);
      } else {
        this.router.navigate(['.'], {
          queryParams: {
            type: 'USER',
          },
          relativeTo: this.route,
        });
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearIgList());
  }

}
