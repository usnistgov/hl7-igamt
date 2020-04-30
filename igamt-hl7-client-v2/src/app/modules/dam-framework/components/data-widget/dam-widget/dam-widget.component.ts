import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDamDataModel } from '../../../models/data/state';
import { DamAbstractEditorComponent } from '../../../services/dam-editor.component';
import { CollapseSideBar, ExpandSideBar, ToggleFullScreen } from '../../../store/data/dam.actions';
import * as fromDAMF from '../../../store/data/dam.actions';
import * as fromDAMFSelector from '../../../store/data/dam.selectors';
import { selecIsSideBarCollaped, selectIsFullScreen, selectWidgetId } from '../../../store/data/dam.selectors';
import { ConfirmDialogComponent } from '../../fragments/confirm-dialog/confirm-dialog.component';

export abstract class DamWidgetComponent {

  activeComponent: DamAbstractEditorComponent;
  valid$: Observable<boolean>;
  private hasChanges$: Observable<boolean>;

  constructor(
    readonly widgetId: string,
    protected store: Store<IDamDataModel>,
    protected dialog: MatDialog) {
    this.valid$ = this.store.select(fromDAMFSelector.selectWorkspaceCurrentIsValid);
    this.hasChanges$ = this.store.select(fromDAMFSelector.selectWorkspaceCurrentIsChanged);
  }

  isActiveWidget$(): Observable<boolean> {
    return this.store.select(selectWidgetId).pipe(
      map((widgetId) => this.widgetId === widgetId),
    );
  }

  isValid$(): Observable<boolean> {
    return this.valid$;
  }

  containsUnsavedChanges$(): Observable<boolean> {
    return this.hasChanges$;
  }

  showSideBar() {
    this.store.dispatch(new ExpandSideBar());
  }

  hideSideBar() {
    this.store.dispatch(new CollapseSideBar());
  }

  toggleFullScreen() {
    this.store.dispatch(new ToggleFullScreen());
  }

  sideBarCollapseStatus$(): Observable<boolean> {
    return this.store.select(selecIsSideBarCollaped);
  }

  fullScreenStatus$(): Observable<boolean> {
    return this.store.select(selectIsFullScreen);
  }

  reset() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to reset ?',
        action: 'Reset',
      },
    });

    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.store.dispatch(new fromDAMF.EditorReset());
        }
      },
    );
  }

  save() {
    this.store.dispatch(new fromDAMF.GlobalSave());
  }

  activateComponent($event) {
    if ($event instanceof DamAbstractEditorComponent) {
      this.activeComponent = $event;
      $event.registerSaveListener();
      $event.registerTitleListener();
    }
  }

  deactivateComponent($event) {
    if ($event instanceof DamAbstractEditorComponent) {
      this.activeComponent = undefined;
      $event.unregisterSaveListener();
      $event.unregisterTitleListener();
    }
  }

  getControl() {
    return this.activeComponent ? this.activeComponent.controls : undefined;
  }

  // Execute When Widget Gets Closed
  closeWidget() {
  }

  // Execute When Widget Gets Bootstrapped
  bootstrapWidget() {
  }

}
