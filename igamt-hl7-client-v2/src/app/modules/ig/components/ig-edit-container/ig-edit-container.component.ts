import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ClearIgEdit } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { DamWidgetComponent } from '../../../dam-framework/components/dam-widget/dam-widget.component';
import { IWorkspaceActive } from '../../../dam-framework/models/state/workspace';
import { ITitleBarMetadata } from '../ig-edit-titlebar/ig-edit-titlebar.component';

@Component({
  selector: 'app-ig-edit-container',
  templateUrl: './ig-edit-container.component.html',
  styleUrls: ['./ig-edit-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => IgEditContainerComponent) },
  ],
})
export class IgEditContainerComponent extends DamWidgetComponent implements OnInit, OnDestroy {

  titleBar$: Observable<ITitleBarMetadata>;
  activeWorkspace: Observable<IWorkspaceActive>;

  constructor(protected store: Store<any>, dialog: MatDialog) {
    super(store, dialog);
    this.titleBar$ = this.store.select(fromIgEdit.selectTitleBar);
    this.activeWorkspace = store.select(fromIgamtSelectors.selectWorkspaceActive);
  }

  containsUnsavedChanges$(): Observable<boolean> {
    return this.store.select(fromIgDocumentEdit.selectWorkspaceOrTableOfContentChanged);
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearIgEdit());
  }

  ngOnInit() {
  }

}
