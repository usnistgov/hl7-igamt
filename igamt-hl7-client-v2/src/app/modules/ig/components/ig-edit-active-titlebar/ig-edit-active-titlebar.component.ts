import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { IWorkspaceActive } from '../../../shared/models/editor.class';

@Component({
  selector: 'app-ig-edit-active-titlebar',
  templateUrl: './ig-edit-active-titlebar.component.html',
  styleUrls: ['./ig-edit-active-titlebar.component.scss'],
})
export class IgEditActiveTitlebarComponent implements OnInit {

  activeElement: Observable<IWorkspaceActive>;
  constructor(private store: Store<fromIgEdit.IState>) {
    this.activeElement = store.select(fromIgEdit.selectWorkspaceActive);
  }

  ngOnInit() {
  }

}
