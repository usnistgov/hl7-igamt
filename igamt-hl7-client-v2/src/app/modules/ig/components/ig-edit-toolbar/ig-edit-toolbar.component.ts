import { selectIgConfig } from './../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { VerificationType } from 'src/app/modules/shared/models/verification.interface';
import { selectDelta, selectViewOnly } from 'src/app/root-store/dam-igamt/igamt.selectors';
import { selectDerived } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectExternalTools } from '../../../../root-store/config/config.reducer';
import { ExportDialogComponent } from '../../../export-configuration/components/export-dialog/export-dialog.component';
import { ExportTypes } from '../../../export-configuration/models/export-types';
import { ExportConfigurationService } from '../../../export-configuration/services/export-configuration.service';
import { ExportToolComponent } from '../../../shared/components/export-tool/export-tool.component';
import { ExportXmlDialogComponent } from '../../../shared/components/export-xml-dialog/export-xml-dialog.component';
import { VerifyIgDialogComponent } from '../../../shared/components/verify-ig-dialog/verify-ig-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IConnectingInfo } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IDocumentDisplayInfo, IgDocument } from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';
import { selectVerificationResult, selectVerificationStatus } from './../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import { VerifyIg } from './../../../../root-store/ig/ig-edit/ig-edit.actions';
import { DocumentConfigComponent } from 'src/app/modules/shared/components/document-config/document-config.component';

@Component({
  selector: 'app-ig-edit-toolbar',
  templateUrl: './ig-edit-toolbar.component.html',
  styleUrls: ['./ig-edit-toolbar.component.scss'],
})
export class IgEditToolbarComponent implements OnInit, OnDestroy {
  exportTypes = ExportTypes;
  verifiying$: Observable<boolean> = of(true);
  viewOnly: boolean;
  subscription: Subscription;
  toolConfig: Observable<IConnectingInfo[]>;
  type: Type.IGDOCUMENT;
  delta: any;
  deltaMode$: Observable<boolean> = of(false);
  derived$: Observable<boolean>;
  stats$: Observable<any>;
  constructor(
    private store: Store<IDocumentDisplayInfo<IgDocument>>,
    private exportConfigurationService: ExportConfigurationService,
    private igService: IgService,
    private router: Router,
    private dialog: MatDialog) {
    this.subscription = this.store.select(selectViewOnly).subscribe(
      (value) => this.viewOnly = value,
    );
    this.verifiying$ = this.store.select(selectVerificationStatus).pipe(map((x) =>  x.loading));
    this.stats$ = this.store.select(selectVerificationResult).pipe(filter((x) => x), map((x) =>  x.stats));

    this.toolConfig = this.store.select(selectExternalTools);
    this.deltaMode$ = this.store.select(selectDelta);
    this.deltaMode$.subscribe((x) => this.delta = x);
    this.derived$ = this.store.select(selectDerived);

  }

  export(type: ExportTypes, format: string) {
    combineLatest(
      this.getIgId(),
      this.exportConfigurationService.getAllExportConfigurations(type)).pipe(
        take(1),
        map(([igId, configurations]) => {
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromIgDocumentEdit.selectProfileTree),
              igId,
              configurations,
              type,
              getExportFirstDecision: this.igService.getExportFirstDecision,
              delta: type === ExportTypes.DIFFERENTIAL,
            },
          });
          dialogRef.afterClosed().pipe(
            filter((y) => y !== undefined),
            map((result) => {
              this.igService.exportDocument(igId, result.decision, result.configurationId, type, format);
            }),
          ).subscribe();
        }),
      ).subscribe();
  }

  getDecision() {
    return of();
  }
  quickExport(type: ExportTypes, format: string) {
    this.getIgId().pipe(
      take(1),
      map((id) => this.igService.exportDocument(id, null, null, type, format)),
    ).subscribe();
  }

  verifyIG(type: string) {
      this.getIgId().pipe().subscribe((igId) => {
       const url =  '/' + 'ig/' + igId + '/verification?type=' + type;
       this.router.navigateByUrl(url);
      });
  }

  refreshVerify() {
    this.getIgId().pipe().subscribe((igId) => {
      this.store.dispatch(new VerifyIg({  id: igId,
        resourceType: Type.IGDOCUMENT,
        verificationType: VerificationType.VERIFICATION}));
     });
  }

  exportXML() {
    const subscription = this.getMessages().pipe(
      withLatestFrom(this.getCompositeProfies()),
      map(([messages, cps]) => {
        this.getIgId().subscribe((igId) => {
          const dialogRef = this.dialog.open(ExportXmlDialogComponent, {
            data: { conformanceProfiles: messages, compositeProfiles: cps, igId },
          });

          dialogRef.afterClosed().pipe(
            filter((x) => x !== undefined),
            withLatestFrom(this.getIgId()),
            take(1),
            map(([result, igId2]) => {

              this.igService.exportXML(igId2, result, null);
            }),
          ).subscribe();
        });

      }),
    ).subscribe();
    subscription.unsubscribe();
  }

  exportDiffXML() {
    this.getIgId().pipe(
      take(1),
      map((id) => this.igService.exportDiffXML(id)),
    ).subscribe();

  }

  exportTool() {
    combineLatest(this.store.select(fromIgDocumentEdit.selectMessagesNodes), this.store.select(selectExternalTools), this.getCompositeProfies(), this.getIgId()).pipe(
      take(1),
      map(([conformanceProfiles, tools, compositeProfiles, igId]) => {
        const dialogRef = this.dialog.open(ExportToolComponent, {
          data: { conformanceProfiles, tools, compositeProfiles, igId },
        });
        dialogRef.afterClosed().pipe(
        ).subscribe();
      }),
    ).subscribe();
  }

  openConfig() {
    combineLatest( this.getIgId(),this.store.select(selectIgConfig)).pipe(
      take(1),
      map(([id, config]) => {
        const dialogRef = this.dialog.open(DocumentConfigComponent, {
          data: {config : config}
        });
        dialogRef.afterClosed().pipe(
          map((x) => {
            this.store.dispatch(new fromIgDocumentEdit.UpdateDocumentConfig({id: id, config: x}));
          })
        ).subscribe();
      }),
    ).subscribe();

  }

  getIgId(): Observable<string> {
    return this.store.select(fromIgDocumentEdit.selectIgId);
  }

  getMessages(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgDocumentEdit.selectMessagesNodes);
  }

  getCompositeProfies(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgDocumentEdit.selectCompositeProfilesNodes);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
