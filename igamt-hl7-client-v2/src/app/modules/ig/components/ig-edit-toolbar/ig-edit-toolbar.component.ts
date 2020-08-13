import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import {selectDelta, selectViewOnly} from 'src/app/root-store/dam-igamt/igamt.selectors';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectExternalTools } from '../../../../root-store/config/config.reducer';
import { ExportDialogComponent } from '../../../export-configuration/components/export-dialog/export-dialog.component';
import { ExportConfigurationService } from '../../../export-configuration/services/export-configuration.service';
import { ExportToolComponent } from '../../../shared/components/export-tool/export-tool.component';
import { ExportXmlDialogComponent } from '../../../shared/components/export-xml-dialog/export-xml-dialog.component';
import { VerifyIgDialogComponent } from '../../../shared/components/verify-ig-dialog/verify-ig-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IConnectingInfo } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import {IDocumentDisplayInfo, IgDocument} from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';

@Component({
  selector: 'app-ig-edit-toolbar',
  templateUrl: './ig-edit-toolbar.component.html',
  styleUrls: ['./ig-edit-toolbar.component.scss'],
})
export class IgEditToolbarComponent implements OnInit, OnDestroy {

  viewOnly: boolean;
  subscription: Subscription;
  toolConfig: Observable<IConnectingInfo[]>;
  type: Type.IGDOCUMENT;
  delta: any;
  deltaMode$: Observable<boolean> = of(false);

  constructor(
    private store: Store<IDocumentDisplayInfo<IgDocument>>,
    private exportConfigurationService: ExportConfigurationService,
    private igService: IgService,
    private dialog: MatDialog) {
    this.subscription = this.store.select(selectViewOnly).subscribe(
      (value) => this.viewOnly = value,
    );
    this.toolConfig = this.store.select(selectExternalTools);
    this.deltaMode$ = this.store.select(selectDelta);
    this.deltaMode$.subscribe((x) => this.delta = x);

  }

  exportWord() {
    combineLatest(
      this.getIgId(),
      this.exportConfigurationService.getAllExportConfigurations(this.type)).pipe(
        take(1),
        map(([igId, configurations]) => {
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromIgDocumentEdit.selectProfileTree),
              igId,
              configurations,
              type: Type.IGDOCUMENT,
              getExportFirstDecision: this.igService.getExportFirstDecision,
            },
          });
          dialogRef.afterClosed().pipe(
            filter((y) => y !== undefined),
            map((result) => {
              this.igService.exportAsWord(igId, result.decision, result.configurationId);
            }),
          ).subscribe();
        }),
      ).subscribe();
  }

  getDecision() {
    return of();
  }

  // exportHTML() {
  //   combineLatest(
  //     this.getIgId(),
  //     this.exportConfigurationService.getAllExportConfigurations(this.type)).pipe(
  //       take(1),
  //       map(([igId, configurations]) => {
  //         console.log(igId);
  //         const dialogRef = this.dialog.open(ExportDialogComponent, {
  //           data: {
  //             toc: this.store.select(fromIgDocumentEdit.selectProfileTree),
  //             igId,
  //             configurations,
  //             type: Type.IGDOCUMENT,
  //             getExportFirstDecision: this.igService.getExportFirstDecision,
  //            // getExportFirstDecision: this.igService.getExportFirstDecision,
  //             delta: this.delta,
  //
  //           },
  //         });
  //         dialogRef.afterClosed().pipe(
  //           filter((y) => y !== undefined),
  //           map((result) => {
  //             this.igService.exportAsHtml(igId, result.decision, result.configurationId);
  //           }),
  //         ).subscribe();
  //       }),
  //     ).subscribe();
  // }
  //
  // exportQuickHTML() {
  //   this.getIgId().pipe(
  //     take(1),
  //     map((id) => this.igService.exportAsHtmlQuick(id)),
  //   ).subscribe();
  //
  // }
  //
  // exportQuickWORD() {
  //   this.getIgId().pipe(
  //     take(1),
  //     map((id) => this.igService.exportAsWordQuick(id)),
  //   ).subscribe();
  //
  // }
  exportHTML() {
    combineLatest(
      this.getIgId(),
      this.exportConfigurationService.getAllExportConfigurations(this.type)).pipe(
        take(1),
      map(([igId, configurations]) => {
        console.log(igId);
        const dialogRef = this.dialog.open(ExportDialogComponent, {
          data: {
            toc: this.store.select(fromIgDocumentEdit.selectProfileTree),
            igId,
            configurations,
            type: Type.IGDOCUMENT,
            delta: this.delta,

          },
        });
        dialogRef.afterClosed().pipe(
          filter((y) => y !== undefined),
          map((result) => {
            this.igService.exportAsHtml(igId, result.decision, result.configurationId);
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  exportQuickHTML() {
    this.getIgId().pipe(
      take(1),
      map((id) => this.igService.exportAsHtmlQuick(id)),
    ).subscribe();

  }

  exportQuickWORD() {
    this.getIgId().pipe(
      take(1),
      map((id) => this.igService.exportAsWordQuick(id)),
    ).subscribe();
  }

  verifyIG(type: string) {
    if (type || type === 'Verification' || type === 'Compliance') {
      this.getIgId().subscribe((igId) => {
        const dialogRef = this.dialog.open(VerifyIgDialogComponent, {
          data: { igId, type },
        });

        dialogRef.afterClosed().pipe().subscribe();
      });
    }

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

  getIgId(): Observable<string> {
    return this.store.select(fromIgDocumentEdit.selectIgId);
  }

  getMessages(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgDocumentEdit.selectMessagesNodes);
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
