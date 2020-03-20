import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { ToggleFullScreen } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectIsLoggedIn } from '../../../../root-store/authentication/authentication.reducer';
import { selectExternalTools } from '../../../../root-store/config/config.reducer';
import { selectFullScreen } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { ExportConfigurationDialogComponent } from '../../../export-configuration/components/export-configuration-dialog/export-configuration-dialog.component';
import { ExportDialogComponent } from '../../../export-configuration/components/export-dialog/export-dialog.component';
import { ExportConfigurationService } from '../../../export-configuration/services/export-configuration.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ExportToolComponent } from '../../../shared/components/export-tool/export-tool.component';
import { ExportXmlDialogComponent } from '../../../shared/components/export-xml-dialog/export-xml-dialog.component';
import { VerifyIgDialogComponent } from '../../../shared/components/verify-ig-dialog/verify-ig-dialog.component';
import { IConnectingInfo } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IGDisplayInfo } from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';

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
  toolConfig: Observable<IConnectingInfo[]>;

  constructor(
    private store: Store<IGDisplayInfo>,
    private exportConfigurationService: ExportConfigurationService,
    private igService: IgService,
    private dialog: MatDialog) {
    this.subscription = this.store.select(fromIgDocumentEdit.selectViewOnly).subscribe(
      (value) => this.viewOnly = value,
    );
    this.valid = this.store.select(fromIgDocumentEdit.selectWorkspaceCurrentIsValid);
    this.changed = this.store.select(fromIgDocumentEdit.selectWorkspaceOrTableOfContentChanged);
    this.toolConfig = this.store.select(selectExternalTools);
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to reset ?',
        action: 'Reset',
      },
    });

    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.store.dispatch(new fromIgDocumentEdit.EditorReset());
        }
      },
    );
  }

  save() {
    this.store.dispatch(new fromIgDocumentEdit.ToolbarSave());
  }

  exportWord() {
    combineLatest(
      this.getIgId(),
      this.exportConfigurationService.getAllExportConfigurations()).pipe(
        map(([igId, configurations]) => {
          console.log(igId);
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromIgDocumentEdit.selectProfileTree),
              igId,
              configurations,
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

  exportHTML() {
    combineLatest(
      this.getIgId(),
      this.exportConfigurationService.getAllExportConfigurations()).pipe(
        map(([igId, configurations]) => {
          console.log(igId);
          const dialogRef = this.dialog.open(ExportDialogComponent, {
            data: {
              toc: this.store.select(fromIgDocumentEdit.selectProfileTree),
              igId,
              configurations,
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
    this.getIgId().subscribe((id) => this.igService.exportAsHtmlQuick(id));
  }

  exportQuickWORD() {
    this.getIgId().subscribe((id) => this.igService.exportAsWordQuick(id));
  }

  verifyIG(type: string) {
    if (type || type === 'Verification' || type === 'Compliance') {
      this.getIgId().subscribe((igId) => {
        const dialogRef = this.dialog.open(VerifyIgDialogComponent, {
          data: {igId, type},
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
            data: { conformanceProfiles: messages, compositeProfiles: cps, igId},
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
