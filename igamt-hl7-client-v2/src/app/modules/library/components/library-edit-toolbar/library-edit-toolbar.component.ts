import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import * as fromLibrayEdit from 'src/app/root-store/library/library-edit/library-edit.index';
import { selectExternalTools } from '../../../../root-store/config/config.reducer';
import { ExportDialogComponent } from '../../../export-configuration/components/export-dialog/export-dialog.component';
import { ExportConfigurationService } from '../../../export-configuration/services/export-configuration.service';
import {IDocumentDisplayInfo} from '../../../ig/models/ig/ig-document.class';
import { ExportToolComponent } from '../../../shared/components/export-tool/export-tool.component';
import { ExportXmlDialogComponent } from '../../../shared/components/export-xml-dialog/export-xml-dialog.component';
import { IConnectingInfo } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import {ILibrary} from '../../models/library.class';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-library-edit-toolbar',
  templateUrl: './library-edit-toolbar.component.html',
  styleUrls: ['./library-edit-toolbar.component.scss'],
})
export class LibraryEditToolbarComponent implements OnInit, OnDestroy {

  viewOnly: boolean;
  subscription: Subscription;
  toolConfig: Observable<IConnectingInfo[]>;

  constructor(
    private store: Store<IDocumentDisplayInfo<ILibrary>>,
    private exportConfigurationService: ExportConfigurationService,
    private libraryService: LibraryService,
    private dialog: MatDialog) {
    this.subscription = this.store.select(fromLibrayEdit.selectViewOnly).subscribe(
      (value) => this.viewOnly = value,
    );
    this.toolConfig = this.store.select(selectExternalTools);
  }

  exportWord() {
    combineLatest(
      this.getIgId(),
      this.exportConfigurationService.getAllExportConfigurations()).pipe(
        map(([igId, configurations]) => {
          console.log(igId);
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromLibrayEdit.selectProfileTree),
              igId,
              configurations,
            },
          });
          dialogRef.afterClosed().pipe(
            filter((y) => y !== undefined),
            map((result) => {
              this.libraryService.exportAsWord(igId, result.decision, result.configurationId);
            }),
          ).subscribe();
        }),
      ).subscribe();
  }

  getDecision() {
    return of();
  }

  exportHTML() {
    combineLatest(
      this.getIgId(),
      this.exportConfigurationService.getAllExportConfigurations()).pipe(
        map(([igId, configurations]) => {
          console.log(igId);
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromLibrayEdit.selectProfileTree),
              igId,
              configurations,
            },
          });
          dialogRef.afterClosed().pipe(
            filter((y) => y !== undefined),
            map((result) => {
              this.libraryService.exportAsHtml(igId, result.decision, result.configurationId);
            }),
          ).subscribe();
        }),
      ).subscribe();
  }

  exportQuickHTML() {
    this.getIgId().subscribe((id) => this.libraryService.exportAsHtmlQuick(id));
  }

  exportQuickWORD() {
    this.getIgId().subscribe((id) => this.libraryService.exportAsWordQuick(id));
  }
  getIgId(): Observable<string> {
    return this.store.select(fromLibrayEdit.selectLibraryId);
  }
  getMessages(): Observable<IDisplayElement[]> {
    return this.store.select(fromLibrayEdit.selectDatatypesNodes);
  }

  getCompositeProfies(): Observable<IDisplayElement[]> {
    return of([]);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}