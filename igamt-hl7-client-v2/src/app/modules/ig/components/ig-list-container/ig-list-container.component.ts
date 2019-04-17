import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
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
import { IgListItem } from '../../models/ig/ig-list-item.class';
import { IgService } from '../../services/ig.service';
import { Message } from './../../../core/models/message/message.class';
import { MessageService } from './../../../core/services/message.service';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { IgListItemControl } from './../ig-list-item-card/ig-list-item-card.component';

@Component({
  selector: 'app-ig-list-container',
  templateUrl: './ig-list-container.component.html',
  styleUrls: ['./ig-list-container.component.scss'],
})
export class IgListContainerComponent implements OnInit {

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
    this.controls = this.isAdmin
      .pipe(
        withLatestFrom(this.username),
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
                    return !admin;
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
                  this.ig.cloneIg(item.id).subscribe(
                    (response: Message<string>) => {
                      this.store.dispatch(this.message.messageToAction(response));
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
                label: 'Open',
                class: 'btn-primary',
                icon: 'fa-arrow-right',
                action: (item: IgListItem) => {
                  this.router.navigate(['ig', item.id, 'edit']);
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
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.selectViewType(params['type']);
      }
    });
  }

}
