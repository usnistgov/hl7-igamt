import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { TurnOffLoader, TurnOnLoader } from '../../../dam-framework/store/loader';
import { IgService } from '../../../ig/services/ig.service';
import { LibraryService } from '../../../library/services/library.service';
import { Type } from '../../../shared/constants/type.enum';
import { IExportConfigurationItemList } from '../../models/exportConfigurationForFrontEnd.interface';
import { ExportConfigurationDialogComponent } from '../export-configuration-dialog/export-configuration-dialog.component';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css'],
})
export class ExportDialogComponent implements OnInit {

  configlist: IExportConfigurationItemList[];
  selectedConfig: IExportConfigurationItemList;
  igId: string;
  toc: any;
  type: Type;
  delta: boolean;
  exportFilterDecision: any;
  title = 'Export Document';

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private dialog: MatDialog,
    private igService: IgService,
    private libraryService: LibraryService,
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.igId = data.igId;
    this.toc = data.toc;
    this.type = data.type;
    this.configlist = data.configurations;
    this.exportFilterDecision = _.cloneDeep(data.exportFilterDecision);
    this.delta = data.delta;
    if (data.title) {
      this.title = data.title;
    }
    if (data.selectedConfigurationId) {
      this.selectedConfig = this.configlist.find((x) => x.id === data.selectedConfigurationId);
    } else {
      if (!this.selectedConfig) {
        this.selectedConfig = this.configlist.find((x) => x.defaultConfig);
      }
      if (!this.selectedConfig) {
        this.selectedConfig = this.configlist.find((x) => x.original);
      }
    }
  }

  getFiltredDocument(): Observable<any> {
    if (this.type && this.type === Type.DATATYPELIBRARY) {
      return this.libraryService.getExportFirstDecision(this.igId, this.selectedConfig.id);
    } else {
      return this.igService.getExportFirstDecision(this.igId, this.selectedConfig.id);
    }
  }

  customize() {
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.getFiltredDocument().pipe(
      take(1),
      map((exportContext) => {
        this.store.dispatch(new TurnOffLoader());
        const tocDialog = this.dialog.open(ExportConfigurationDialogComponent, {
          maxWidth: '95vw',
          maxHeight: '90vh',
          width: '95vw',
          height: '95vh',
          panelClass: 'configuration-dialog-container',
          data: {
            configurationName: this.selectedConfig.configName,
            configuration: exportContext.exportConfiguration,
            lastUserExportFilterDecision: exportContext.previous,
            exportFilterDecision: this.exportFilterDecision || exportContext.exportFilterDecision,
            toc: this.toc,
            type: this.type,
            delta: this.delta,
            documentId: this.igId,
          },
        });
        tocDialog.afterClosed().subscribe((result) => {
          if (result) {
            this.dialogRef.close({
              configurationId: this.selectedConfig.id,
              decision: result,
            });
          }
        });
      }),
      catchError((error: HttpErrorResponse) => {
        this.store.dispatch(new TurnOffLoader());
        return of(error);
      }),
    ).subscribe();
  }

  export() {
    this.dialogRef.close({
      configurationId: this.selectedConfig.id,
      decision: this.exportFilterDecision,
    });
  }

  ngOnInit() {
  }

}
