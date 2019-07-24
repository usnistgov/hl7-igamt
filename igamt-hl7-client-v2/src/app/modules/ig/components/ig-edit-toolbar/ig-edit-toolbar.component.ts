import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {filter, map, tap, withLatestFrom} from 'rxjs/operators';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ToggleFullScreen } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectIsLoggedIn } from '../../../../root-store/authentication/authentication.reducer';
import { selectFullScreen } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { IGDisplayInfo } from '../../models/ig/ig-document.class';
import {IgService} from '../../services/ig.service';
import {IDisplayElement} from "../../../shared/models/display-element.interface";
import {MatDialog} from "@angular/material";
import {ResourcePickerComponent} from "../../../shared/components/resource-picker/resource-picker.component";
import {ExportXmlDialogComponent} from "../../../shared/components/export-xml-dialog/export-xml-dialog.component";
import {ClearResource} from "../../../../root-store/resource-loader/resource-loader.actions";
import {IgEditTocAddResource} from "src/app/root-store/ig/ig-edit/ig-edit.index";

@Component({
  selector: 'app-ig-edit-toolbar',
  templateUrl: './ig-edit-toolbar.component.html',
  styleUrls: ['./ig-edit-toolbar.component.scss'],
})
export class IgEditToolbarComponent implements OnInit, OnDestroy {

  viewOnly: boolean;
  valid: Observable<boolean>;
  changed: Observable<boolean>;
  fullscreen: boolean;
  subscription: Subscription;

  constructor(private store: Store<IGDisplayInfo>, private igService: IgService, private dialog: MatDialog) {
    this.subscription = this.store.select(fromIgDocumentEdit.selectViewOnly).subscribe(
      (value) => this.viewOnly = value,
    );
    this.valid = this.store.select(fromIgDocumentEdit.selectWorkspaceCurrentIsValid);
    this.changed = this.store.select(fromIgDocumentEdit.selectWorkspaceOrTableOfContentChanged);
    combineLatest(store.select(selectIsLoggedIn), store.select(selectFullScreen)).pipe(
      tap(([logged, full]) => {
        this.fullscreen = logged && full;
      }),
    ).subscribe();
  }

  toggleFullscreen() {
    this.store.dispatch(new ToggleFullScreen());
  }

  reset() {
    this.store.dispatch(new fromIgDocumentEdit.EditorReset());
  }

  save() {
    this.store.dispatch(new fromIgDocumentEdit.ToolbarSave());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  exportWord() {

  }
  exportHTML() {

  }

  exportXML() {
    const subscription = this.getMessages().pipe(
      withLatestFrom(this.getCompositeProfies()),
      map(([messages, cps]) => {
        const dialogRef = this.dialog.open(ExportXmlDialogComponent, {
          data: {conformanceProfiles: messages, compositeProfiles: cps},
        });

        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          withLatestFrom(this.getIgId()),
          map(([result, igId]) => {

            this.igService.exportXML(igId, result, null);
            console.log(result);
            console.log(igId);
          }),
        ).subscribe();
      }),
    ).subscribe();
    subscription.unsubscribe();
  }
  getIgId(): Observable<string> {
    return this.store.select(fromIgDocumentEdit.selectIgId);
  }
  getMessages(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgDocumentEdit.selectMessagesNodes);
  }
  getCompositeProfies(): Observable<IDisplayElement[]> {
    return of([]);
  }
}
