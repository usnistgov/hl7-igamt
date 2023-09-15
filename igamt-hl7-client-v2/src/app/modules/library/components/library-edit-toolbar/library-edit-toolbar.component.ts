import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import {filter, map, mergeMap, take, withLatestFrom} from 'rxjs/operators';
import { selectIsAdmin } from 'src/app/modules/dam-framework/store/authentication';
import { Scope } from 'src/app/modules/shared/constants/scope.enum';
import {PublishLibrary, ToggleDeltaFailure} from 'src/app/root-store/library/library-edit/library-edit.index';
import * as fromLibrayEdit from 'src/app/root-store/library/library-edit/library-edit.index';
import { selectExternalTools } from '../../../../root-store/config/config.reducer';
import { ExportDialogComponent } from '../../../export-configuration/components/export-dialog/export-dialog.component';
import {ExportTypes} from '../../../export-configuration/models/export-types';
import { ExportConfigurationService } from '../../../export-configuration/services/export-configuration.service';
import {IDocumentDisplayInfo} from '../../../ig/models/ig/ig-document.class';
import { ExportToolComponent } from '../../../shared/components/export-tool/export-tool.component';
import { ExportXmlDialogComponent } from '../../../shared/components/export-xml-dialog/export-xml-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IConnectingInfo } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import {ILibrary} from '../../models/library.class';
import { LibraryService } from '../../services/library.service';
import {
  IPublicationResult,
  IPublicationSummary,
  PublishLibraryDialogComponent,
} from '../publish-library-dialog/publish-library-dialog.component';

@Component({
  selector: 'app-library-edit-toolbar',
  templateUrl: './library-edit-toolbar.component.html',
  styleUrls: ['./library-edit-toolbar.component.scss'],
})
export class LibraryEditToolbarComponent implements OnInit, OnDestroy {

  viewOnly: boolean;
  subscription: Subscription;
  toolConfig: Observable<IConnectingInfo[]>;
  master$: Observable<boolean>;
  viewOnly$: Observable<boolean>;
  constructor(
    private store: Store<IDocumentDisplayInfo<ILibrary>>,
    private exportConfigurationService: ExportConfigurationService,
    private libraryService: LibraryService,
    private dialog: MatDialog) {
    this.subscription = this.store.select(fromLibrayEdit.selectViewOnly).subscribe(
      (value) => this.viewOnly = value,
    );

    this.viewOnly$ = this.store.select(fromLibrayEdit.selectViewOnly);
    this.toolConfig = this.store.select(selectExternalTools);
    this.master$ = this.store.select(selectIsAdmin);
  }

  exportWord() {
    combineLatest(
      this.getLibId(),
      this.exportConfigurationService.getAllExportConfigurations(ExportTypes.DATATYPELIBRARY)).pipe(
        take(1),
        map(([igId, configurations]) => {
          console.log(igId);
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromLibrayEdit.selectProfileTree),
              igId,
              configurations,
              type: Type.DATATYPELIBRARY,
              getExportFirstDecision: this.libraryService.getExportFirstDecision,
              getLastUsercConfiguration: this.libraryService.getLastUserConfiguration,
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
      this.getLibId(),
      this.exportConfigurationService.getAllExportConfigurations(ExportTypes.DATATYPELIBRARY)).pipe(
        take(1),
        map(([igId, configurations]) => {
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromLibrayEdit.selectProfileTree),
              igId,
              configurations,
              type: Type.DATATYPELIBRARY,
              getExportFirstDecision: this.libraryService.getExportFirstDecision,
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
    this.getLibId().pipe(
      take(1),
      map((id) => this.libraryService.exportAsHtmlQuick(id)),
    ).subscribe();
  }

  exportQuickWORD() {
    this.getLibId().pipe(
      take(1),
      map((id) => this.libraryService.exportAsWordQuick(id)),
    ).subscribe();
  }
  getLibId(): Observable<string> {
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

  publish() {
    this.publishByScope(Scope.SDTF);
  }

  publishUser() {
    this.publishByScope(Scope.USER);
  }

  publishByScope(scope: Scope) {

    this.getLibId().pipe(
      take(1),
      mergeMap((libId) => {
          return this.libraryService.getPublicationSummary(libId, scope).pipe(
            take(1),
            map((summary: IPublicationSummary) => {
              const dialogRef = this.dialog.open(PublishLibraryDialogComponent, {
                data: summary,
              });
              dialogRef.afterClosed().pipe(
                filter((y) => y !== undefined),
                map((result: IPublicationResult) => this.store.dispatch(new PublishLibrary(libId, result))),
              ).subscribe();
            }),
          );
        },
      ),
    ).subscribe();

  }

}
