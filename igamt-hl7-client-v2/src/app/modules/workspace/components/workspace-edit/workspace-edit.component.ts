import { DocumentBrowserComponent } from './../../../shared/components/document-browser/document-browser.component';
import { filter, map } from 'rxjs/operators';
import { IWorkspaceTitleMetadata } from './workspace-edit-title-bar/workspace-edit-title-bar.component';
import { Component, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';
import { DamWidgetComponent } from 'src/app/modules/dam-framework';

export const WORKSPACE_EDIT_WIDGET_ID = 'WORKSPACE_EDIT_WIDGET_ID';

@Component({
  selector: 'app-workspace-edit',
  templateUrl: './workspace-edit.component.html',
  styleUrls: ['./workspace-edit.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => WorkspaceEditComponent) },
  ],
})
export class WorkspaceEditComponent extends DamWidgetComponent {

  folders = [{
    id: 1,
    path: '1',
    header: 'California',
    igs: 0,
  }, {
    id: 2,
    path: '2',
    header: 'Michigan',
    igs: 10,
  }];


  titleBar$: Observable<IWorkspaceTitleMetadata>;
  activeWorkspace: Observable<IWorkspaceActive>;
  showStatusBar$: Observable<boolean>;
  showBottomDrawer$: Observable<boolean>;

  constructor(
    protected store: Store<any>,
    dialog: MatDialog) {
    super(WORKSPACE_EDIT_WIDGET_ID, store, dialog);
    //this.titleBar$ = this.store.select(fromIgEdit.selectTitleBar);
   // this.activeWorkspace = store.select(fromIgamtSelectors.selectWorkspaceActive);
  }

  // containsUnsavedChanges$(): Observable<boolean> {
  //   return this.store.select(fromIgDocumentEdit.selectWorkspaceOrTableOfContentChanged);
  // }


  browse(){
      const dialogRef = this.dialog.open(DocumentBrowserComponent, {
        data: {  },
      });
      dialogRef.afterClosed().pipe(
        filter((x) => x !== undefined),
        map(x => console.log(x))
      ).subscribe();


  }
}
