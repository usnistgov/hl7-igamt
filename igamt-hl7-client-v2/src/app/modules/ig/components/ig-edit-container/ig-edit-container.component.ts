import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {IGDisplayInfo} from '../../models/ig/ig-document.class';
import {ITitleBarMetadata} from '../ig-edit-titlebar/ig-edit-titlebar.component';

@Component({
  selector: 'app-ig-edit-container',
  templateUrl: './ig-edit-container.component.html',
  styleUrls: ['./ig-edit-container.component.scss'],
})
export class IgEditContainerComponent implements OnInit {

  titleBar: Observable<ITitleBarMetadata>;

  constructor(private store: Store<IGDisplayInfo>) {
    this.titleBar = this.store.select(fromIgEdit.selectTitleBar);
  }

  ngOnInit() {
  }

}
