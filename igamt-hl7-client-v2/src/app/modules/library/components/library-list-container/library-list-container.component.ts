import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromRoot from 'src/app/root-store/index';
import {
  ClearLibraryList, DeleteLibraryListItemRequest,
  LoadLibraryList,
  SelectLibraryListSortOption,
  SelectLibraryListViewType,
} from 'src/app/root-store/library/library-list/library-list.index';

import { Scope } from 'src/app/modules/shared/constants/scope.enum';
import { Status } from 'src/app/modules/shared/models/abstract-domain.interface';
import * as fromIgList from 'src/app/root-store/library/library-list/library-list.index';
import {
  DeleteIgListItemRequest,
  IgListLoad,
} from '../../../../root-store/ig/ig-list/ig-list.actions';
import { PublishLibrary } from '../../../../root-store/library/library-edit/library-edit.actions';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { ClearAll } from '../../../dam-framework/store/messages/messages.actions';
import { IgListItem } from '../../../document/models/document/ig-list-item.class';
import { CloneModeEnum } from '../../../shared/constants/clone-mode.enum';
import { LibraryService } from '../../services/library.service';
import { IgListItemControl } from '../library-list-item-card/library-list-item-card.component';
import {
  IPublicationResult,
  IPublicationSummary,
  PublishLibraryDialogComponent,
} from '../publish-library-dialog/publish-library-dialog.component';
import { SharingDialogComponent } from './../../../shared/components/sharing-dialog/sharing-dialog.component';

@Component({
  selector: 'app-library-list-container',
  templateUrl: './library-list-container.component.html',
  styleUrls: ['./library-list-container.component.scss'],
})
export class LibraryListContainerComponent implements OnInit, OnDestroy {
  readonly DATATYPE_LIBRARY = 'datatype-library';

  constructor(
    private store: Store<fromRoot.IRouteState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private message: MessageService,
    private libraryService: LibraryService) {
    this.storeSelectors();
    this.initializeProperties();
    this.igListItemControls();
  }

  listItems: Observable<IgListItem[]>;
  viewType: Observable<IgListLoad>;
  isAdmin: Observable<boolean>;
  username: Observable<string>;
  filter: string;

  filterOptions = [{
    label: 'LOCKED', value: Status.LOCKED,
    atrribute: 'status',
  }, {
    label: 'UNLOCKED', value: null,
    atrribute: 'status',
  }];
  status = [Status.LOCKED, null];

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
                label: 'Delete',
                class: 'btn-danger',
                icon: 'fa-trash',
                action: (item: IgListItem) => {
                  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: {
                      question: 'Are you sure you want to delete Library "' + item.title + '" ?',
                      action: 'Delete Implementation Guide',
                    },
                  });

                  dialogRef.afterClosed().subscribe(
                    (answer) => {
                      if (answer) {
                        this.store.dispatch(new DeleteLibraryListItemRequest(item.id));
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
                  this.libraryService.clone(item.id, CloneModeEnum.CLONE, null).subscribe(
                    (response: Message<string>) => {
                      this.store.dispatch(this.message.messageToAction(response));
                      this.router.navigate([this.DATATYPE_LIBRARY, response.data]);
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
                  return true;
                },
              },
              {
                label: 'New Version',
                class: 'btn-secondary',
                icon: 'fa fa-map-marker',
                action: (item: IgListItem) => {
                  this.cloneLib(item, CloneModeEnum.UPGRADE);
                },
                disabled: (item: IgListItem): boolean => {
                  return false;
                },
                hide: (item: IgListItem): boolean => {
                  return item.type !== 'PUBLISHED';
                },
              },

              {
                label: 'clone',
                class: 'btn-secondary',
                icon: 'fa fa-copy',
                action: (item: IgListItem) => {
                  this.cloneLib(item, CloneModeEnum.CLONE);
                },
                disabled: (item: IgListItem): boolean => {
                  return false;
                },
                hide: (item: IgListItem): boolean => {
                  return item.type === 'PUBLISHED';
                },
              },
              {
                label: 'Open',
                class: 'btn-primary',
                icon: 'fa-arrow-right',
                default: true,
                action: (item: IgListItem) => {
                  this.router.navigate([this.DATATYPE_LIBRARY, item.id]);
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
                  this.router.navigate(['library', item.id]);
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
                  this.router.navigate(['library', item.id]);
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

  cloneLib(item: IgListItem, mode: CloneModeEnum) {
    this.libraryService.clone(item.id, mode, null).subscribe(
      (response: Message<string>) => {
        this.store.dispatch(this.message.messageToAction(response));
        this.router.navigate([this.DATATYPE_LIBRARY, response.data]);
      },
      (error) => {
        this.store.dispatch(this.message.actionFromError(error));
      },
    );

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

          return this.libraryService.getPublicationSummary(item.id, Scope.SDTF).pipe(
            map((summary: IPublicationSummary) => {
              const newdialogRef = this.dialog.open(PublishLibraryDialogComponent, {
                data: summary,
              });
              newdialogRef.afterClosed().pipe(
                filter((y) => y !== undefined),
                map((result: IPublicationResult) => this.store.dispatch(new PublishLibrary(item.id, result))),
              ).subscribe();
            }),
          ).subscribe();
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
    this.store.dispatch(new SelectLibraryListViewType(viewType || 'USER'));
    this.store.dispatch(new LoadLibraryList({
      type: viewType,
    }));
  }

  // On Filter Text Changed
  filterTextChanged(text: string) {
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: text });
  }

  // On Sort Property Changed
  sortPropertyChanged(value: any) {
    this.store.dispatch(new SelectLibraryListSortOption(Object.assign(Object.assign({}, this.sortOrder), value)));
  }

  // On Sort Order Changed
  sortOrderChanged(value: any) {
    this.sortOrder.ascending = value;
    this.store.dispatch(new SelectLibraryListSortOption(Object.assign(Object.assign({}, this.sortProperty), this.sortOrder)));
  }

  generalFilter(values: any) {
    this.listItems = this.store.select(fromIgList.selectIgListViewFilteredAndSorted, { filter: this.filter, deprecated: false, status: values });
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
    this.store.dispatch(new ClearLibraryList());
  }

}
