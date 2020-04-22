import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { IDamDataModel } from '../../models/state/state';
import { DamAbstractEditorComponent } from '../../services/dam-editor.component';
import { CollapseSideBar, ExpandSideBar, ToggleFullScreen } from '../../store/dam.actions';
import * as fromDAMF from '../../store/dam.actions';
import * as fromDAMFSelector from '../../store/dam.selectors';
import { selecIsSideBarCollaped, selectIsFullScreen } from '../../store/dam.selectors';

export abstract class DamWidgetComponent implements OnInit, OnDestroy {

  activeComponent: DamAbstractEditorComponent;
  valid$: Observable<boolean>;
  private hasChanges$: Observable<boolean>;

  constructor(
    protected store: Store<IDamDataModel>,
    protected dialog: MatDialog) {
    this.valid$ = this.store.select(fromDAMFSelector.selectWorkspaceCurrentIsValid);
    this.hasChanges$ = this.store.select(fromDAMFSelector.selectWorkspaceCurrentIsChanged);
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

  activateComponent($event: Component) {
    if ($event instanceof DamAbstractEditorComponent) {
      this.activeComponent = $event;
      $event.registerSaveListener();
      $event.registerTitleListener();
    }
  }

  deactivateComponent($event: Component) {
    if ($event instanceof DamAbstractEditorComponent) {
      this.activeComponent = undefined;
      $event.unregisterSaveListener();
      $event.unregisterTitleListener();
    }
  }

  getControl() {
    return this.activeComponent ? this.activeComponent.controls : undefined;
  }

  ngOnDestroy() {
    // CLEAR DATA
  }

  ngOnInit() {
    // CLEAR DATA
  }

}
