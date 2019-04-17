import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';

@Component({
  selector: 'app-ig-edit-toolbar',
  templateUrl: './ig-edit-toolbar.component.html',
  styleUrls: ['./ig-edit-toolbar.component.scss'],
})
export class IgEditToolbarComponent implements OnInit, OnDestroy {

  viewOnly: boolean;
  subscription: Subscription;
  constructor(private store: Store<fromIgDocumentEdit.IState>) {
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
