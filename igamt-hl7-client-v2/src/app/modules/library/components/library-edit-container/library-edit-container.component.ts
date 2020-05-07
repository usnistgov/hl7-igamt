import { Component, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import * as fromLibrayEdit from 'src/app/root-store/library/library-edit/library-edit.index';
import * as fromLibraryEdit from 'src/app/root-store/library/library-edit/library-edit.index';
import { DamWidgetComponent } from '../../../dam-framework/components/data-widget/dam-widget/dam-widget.component';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';
import { ITitleBarMetadata } from '../library-edit-titlebar/library-edit-titlebar.component';

export const LIBRARY_EDIT_WIDGET_ID = 'LIBRARY-EDIT-WIDGET';

@Component({
  selector: 'app-library-edit-container',
  templateUrl: './library-edit-container.component.html',
  styleUrls: ['./library-edit-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => LibraryEditContainerComponent) },
  ],
})
export class LibraryEditContainerComponent extends DamWidgetComponent {

  titleBar$: Observable<ITitleBarMetadata>;
  activeWorkspace: Observable<IWorkspaceActive>;

  constructor(protected store: Store<any>, dialog: MatDialog) {
    super(LIBRARY_EDIT_WIDGET_ID, store, dialog);
    this.titleBar$ = this.store.select(fromLibrayEdit.selectTitleBar);
    this.activeWorkspace = store.select(fromIgamtSelectors.selectWorkspaceActive);
  }

  containsUnsavedChanges$(): Observable<boolean> {
    return this.store.select(fromLibrayEdit.selectWorkspaceOrTableOfContentChanged);
  }
}
