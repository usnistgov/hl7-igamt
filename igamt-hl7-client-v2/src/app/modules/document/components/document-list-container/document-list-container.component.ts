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
} from 'src/app/root-store/document/document-list/document-list.actions';
import * as fromIgList from 'src/app/root-store/document/document-list/document-list.index';
import * as fromRoot from 'src/app/root-store/index';
import {ClearIgList} from '../../../../root-store/document/document-list/document-list.actions';
import {ClearAll} from '../../../../root-store/page-messages/page-messages.actions';
import {DeriveDialogComponent} from '../../../shared/components/derive-dialog/derive-dialog.component';
import {CloneModeEnum} from '../../../shared/constants/clone-mode.enum';
import {Type} from '../../../shared/constants/type.enum';
import {IgListItem} from '../../models/ig/ig-list-item.class';
import {IgService} from '../../services/ig.service';
import {IDocumentListItemControl} from '../document-list-item-card/document-list-item-card.component';
import {Message} from './../../../core/models/message/message.class';
import {MessageService} from './../../../core/services/message.service';
import {ConfirmDialogComponent} from './../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-document-list-container',
  templateUrl: './document-list-container.component.html',
  styleUrls: ['./document-list-container.component.scss'],
})
export class DocumentListContainerComponent implements OnInit, OnDestroy {

  listItems: Observable<IgListItem[]>;
  viewType: Observable<IgListLoad>;
  isAdmin: Observable<boolean>;
  username: Observable<string>;
  filter: string;
  _shadowViewType: IgListLoad;
  controls: Observable<IDocumentListItemControl[]>;
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
    console.log(route.data);
    // Store Selectors
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

    // Initialize Properties
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

    // -- Ig List Item Controls (BUTTONS)
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

                },
                disabled: (item: IgListItem): boolean => {
                  return username !== item.username || item.type === 'PUBLISHED';
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
                  if (item.type === 'PUBLISHED') {
                    return true;
                  } else {
                    return false;
                  }
                },
              },
              {
                label: 'Clone',
                class: 'btn-success',
                icon: 'fa-plus',
                action: (item: IgListItem) => {
                  this.ig.cloneIg(item.id, CloneModeEnum.CLONE, null, Type.IGDOCUMENT).subscribe(
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
                class: 'btn-scondary',
                icon: 'fa fa-globe',
                action: (item: IgListItem) => {
                  this.ig.publish(item.id).subscribe(
                    (response: Message<string>) => {
                      this.store.dispatch(this.message.messageToAction(response));
                      this.router.navigateByUrl('/document/list?type=PUBLISHED');
                    },
                    (error) => {
                      this.store.dispatch(this.message.actionFromError(error));
                    },
                  );
                },
                disabled: (item: IgListItem): boolean => {
                    return !admin || item.type === 'PUBLISHED';
                  },
                hide: (item: IgListItem): boolean => {
                  return item.type === 'PUBLISHED';
                },
              },
              {
                label: 'Derive from',
                class: 'btn-scondary',
                icon: 'fa fa-map-marker',
                action: (item: IgListItem) => {
                  this.ig.cloneIg(item.id, CloneModeEnum.DERIVE, null, null).subscribe(
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
              },
            ];
          },
        ),
      );
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
