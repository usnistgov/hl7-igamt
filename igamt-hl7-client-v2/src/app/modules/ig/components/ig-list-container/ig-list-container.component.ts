import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import { Status } from 'src/app/modules/shared/models/abstract-domain.interface';
import {
  DeleteIgListItemRequest,
  IgListLoad,
  LoadIgList,
  SelectIgListSortOption,
  SelectIgListViewType,
} from 'src/app/root-store/ig/ig-list/ig-list.actions';
import * as fromIgList from 'src/app/root-store/ig/ig-list/ig-list.index';
import * as fromRoot from 'src/app/root-store/index';
import { ClearIgList } from '../../../../root-store/ig/ig-list/ig-list.actions';
import { LoadResource } from '../../../../root-store/resource-loader/resource-loader.actions';
import * as fromResource from '../../../../root-store/resource-loader/resource-loader.reducer';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { ClearAll } from '../../../dam-framework/store/messages/messages.actions';
import { IgListItem } from '../../../document/models/document/ig-list-item.class';
import { IgService } from '../../services/ig.service';
import { DeriveDialogComponent, IDeriveDialogData, IgTemplate } from '../derive-dialog/derive-dialog.component';
import { LockIG } from './../../../../root-store/ig/ig-list/ig-list.actions';
import { IgPublisherComponent } from './../../../shared/components/ig-publisher/ig-publisher.component';
import { SharingDialogComponent } from './../../../shared/components/sharing-dialog/sharing-dialog.component';
import { CloneModeEnum } from './../../../shared/constants/clone-mode.enum';
import { IgListItemControl } from './../ig-list-item-card/ig-list-item-card.component';

@Component({
  selector: 'app-ig-list-container',
  templateUrl: './ig-list-container.component.html',
  styleUrls: ['./ig-list-container.component.scss'],
})
export class IgListContainerComponent implements OnInit, OnDestroy {
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
  draftWarning = 'Warning: This is a DRAFT publication for trial use only. It will be updated and replaced. It is not advised to create permanent derived profiles form this DRAFT implementation Guide.';

  listItems: Observable<IgListItem[]>;
  viewType: Observable<IgListLoad>;
  isAdmin: Observable<boolean>;
  username: Observable<string>;
  showDeprecated: boolean;
  filter: string;
  filterOptions = [{
    label: 'LOCKED', value: Status.LOCKED,
    atrribute: 'status',
  }, {
    label: 'UNLOCKED', value: null,
    atrribute: 'status',
  }];
  status = [Status.LOCKED, null];
  selectedOptions: any;
  _shadowViewType: IgListLoad;
  controls: Observable<IgListItemControl[]>;
  sortOptions: any;
  sortProperty: {
    property: string,
  };
  sortOrder: {
    ascending: boolean,
  };

  storeSelectors() {
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: this.filter, deprecated: this.showDeprecated });
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

  // tslint:disable-next-line cognitive-complexity
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
                  this.deleteConfirmation(item);

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

                  if (item.draft) {

                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                      panelClass: 'dialog-danger',
                      data: {
                        question: this.getWarning(item),
                        action: 'Clone implementation guide',
                      },
                    });

                    dialogRef.afterClosed().subscribe(
                      (answer) => {
                        if (answer) {
                          this.proceedClone(item, CloneModeEnum.CLONE);
                        }
                      },
                    );

                  } else {
                    this.proceedClone(item, CloneModeEnum.CLONE);
                  }
                },
                disabled: (item: IgListItem): boolean => {
                  return false;
                },
                hide: (item: IgListItem): boolean => {
                  return false;
                },
              },
              {
                label: 'Lock',
                class: 'btn-dark',
                icon: 'fa-lock',
                action: (item: IgListItem) => {
                  this.lockConfirmation(item);
                },
                hide: (item: IgListItem): boolean => {
                  return item.type === 'PUBLISHED' || item.type === 'SHARED' || item.status === 'LOCKED';
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
                icon: 'fa fa-code-fork',
                action: (item: IgListItem) => {

                  if (item.draft) {

                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                      panelClass: 'dialog-danger',
                      data: {
                        question: this.getWarning(item),
                        action: 'Derive implementation guide',
                      },
                    });

                    dialogRef.afterClosed().subscribe(
                      (answer) => {
                        if (answer) {
                          this.proceedDerive(item);
                        }
                      },
                    );

                  } else {
                    this.proceedDerive(item);
                  }

                },
                disabled: (item: IgListItem): boolean => {
                  return false;
                },
                hide: (item: IgListItem): boolean => {
                  return item.type !== 'PUBLISHED' && item.status !== 'LOCKED';
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

  deleteConfirmation(item: IgListItem) {
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
  }
  lockConfirmation(item: IgListItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to lock Implementation Guide "' + item.title + '" ?',
        action: 'Lock Implementation Guide',
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.store.dispatch(new LockIG(item.id));
        }
      },
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

  proceedClone(item: IgListItem, cloneMode: CloneModeEnum) {

    this.ig.cloneIg(item.id, CloneModeEnum.CLONE, { mode: cloneMode }).subscribe(
      (response: Message<string>) => {
        this.store.dispatch(this.message.messageToAction(response));
        this.router.navigate(['ig', response.data]);
      },
      (error) => {
        this.store.dispatch(this.message.actionFromError(error));
      },
    );

  }

  proceedDerive(item: IgListItem) {

    this.ig.loadTemplate().pipe(
      take(1),
      map((templates) => {
        const dialogData: IDeriveDialogData = {
          origin: item.title,
          templates,
        };
        const dialogRef = this.dialog.open(DeriveDialogComponent, {
          data: dialogData,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.ig.cloneIg(item.id, CloneModeEnum.DERIVE, { inherit: result['inherit'], mode: CloneModeEnum.DERIVE, template: result.template }).subscribe(
              (response: Message<string>) => {
                this.store.dispatch(this.message.messageToAction(response));
                this.router.navigate(['ig', response.data]);
              },
              (error) => {
                this.store.dispatch(this.message.actionFromError(error));
              },
            );
          }
        });
      }),
    ).subscribe();

  }

  publishDialog(item: IgListItem) {
    const dialogRef = this.dialog.open(IgPublisherComponent, {
      data: {
        ig: item,
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          console.log(answer);
          console.log(answer);

          this.ig.publish(item.id, { draft: answer.draft, info: answer.info }).subscribe(
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

  getWarning(item: IgListItem) {

    if (item.publicationInfo && item.publicationInfo.warning && item.publicationInfo.warning.length > 0) {
      return item.publicationInfo.warning;
    }
    return this.draftWarning;
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
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: text, deprecated: this.showDeprecated });
  }
  deprecatedChange(value: boolean) {
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: this.filter, deprecated: value });
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

  generalFilter(values: any) {
    console.log(values);
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: this.filter, deprecated: this.showDeprecated, status: values });
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
export interface IFilterOptions {
  label: string;
  value: any;
  atrribute: string;
}
