import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {IGDisplayInfo} from '../../models/ig/ig-document.class';

@Component({
  selector: 'app-ig-edit-toolbar',
  templateUrl: './ig-edit-toolbar.component.html',
  styleUrls: ['./ig-edit-toolbar.component.scss'],
})
export class IgEditToolbarComponent implements OnInit, OnDestroy {

  viewOnly: boolean;
  subscription: Subscription;

  constructor(private store: Store<IGDisplayInfo>) {
    this.subscription = this.store.select(fromIgDocumentEdit.selectViewOnly).subscribe(
      (value) => this.viewOnly = value,
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
