import { Component, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { DamWidgetComponent } from '../../../dam-framework/components/data-widget/dam-widget/dam-widget.component';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';
import { VerificationService } from '../../../shared/services/verification.service';
import { ITitleBarMetadata } from '../ig-edit-titlebar/ig-edit-titlebar.component';
import { selectIgDocumentLocation } from './../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { selectViewOnly } from './../../../../root-store/library/library-edit/library-edit.selectors';
import { IDocumentLocation } from './../../models/ig/ig-document.class';

export const IG_EDIT_WIDGET_ID = 'IG-EDIT-WIDGET';

@Component({
  selector: 'app-ig-edit-container',
  templateUrl: './ig-edit-container.component.html',
  styleUrls: ['./ig-edit-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => IgEditContainerComponent) },
  ],
})
export class IgEditContainerComponent extends DamWidgetComponent {

  titleBar$: Observable<ITitleBarMetadata>;
  activeWorkspace: Observable<IWorkspaceActive>;
  showStatusBar$: Observable<boolean>;
  showBottomDrawer$: Observable<boolean>;
  location$: Observable<IDocumentLocation[]>;
  viewOnly$: Observable<boolean>;

  constructor(
    protected store: Store<any>,
    protected verificationService: VerificationService,
    dialog: MatDialog) {
    super(IG_EDIT_WIDGET_ID, store, dialog);
    this.titleBar$ = this.store.select(fromIgEdit.selectTitleBar);
    this.activeWorkspace = store.select(fromIgamtSelectors.selectWorkspaceActive);
    this.showStatusBar$ = verificationService.getStatusBarActive();
    this.showBottomDrawer$ = verificationService.getBottomDrawerActive();
    this.location$ = this.store.select(selectIgDocumentLocation).pipe(
      map((igLocation) => igLocation.location),
    );
    this.viewOnly$ = this.store.select(selectViewOnly);
  }

  containsUnsavedChanges$(): Observable<boolean> {
    return this.store.select(fromIgDocumentEdit.selectWorkspaceOrTableOfContentChanged);
  }
}
