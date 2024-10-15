import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import { TurnOffLoader, TurnOnLoader } from '../../../dam-framework/store/loader';
import { IgService } from '../../../ig/services/ig.service';
import { LibraryService } from '../../../library/services/library.service';
import { Type } from '../../../shared/constants/type.enum';
import { IExportConfigurationGlobal } from '../../models/config.interface';
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
  overrides: BehaviorSubject<any>;
  overrides$: Observable<any>;
  igId: string;
  toc: any;
  type: Type;
  customized: boolean;
  delta: boolean;
  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private dialog: MatDialog,
    private igService: IgService,
    private libraryService: LibraryService,
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.overrides = new BehaviorSubject<any>(undefined);
    this.overrides$ = this.overrides.asObservable();
    this.igId = data.igId;
    this.toc = data.toc;
    this.type = data.type;
    this.configlist = data.configurations;
    this.delta = data.delta;
    this.selectedConfig = this.configlist.find((x) => {
      return x.defaultConfig;
    },
    );
    if (!this.selectedConfig) {
      this.selectedConfig = this.configlist.find((x) => {
        return x.original;
      },
      );
    }
  }

  getFiltredDocumentByType(type: Type): Observable<any> {
    if (this.type && this.type === Type.DATATYPELIBRARY) {
      return this.libraryService.getExportFirstDecision(this.igId, this.selectedConfig.id);
    } else {
      return this.igService.getExportFirstDecision(this.igId, this.selectedConfig.id);
    }
  }

  customize() {
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));

    this.getFiltredDocumentByType(this.type).pipe(
      take(1),
      map((decision) => {
        this.store.dispatch(new TurnOffLoader());

        const tocDialog = this.dialog.open(ExportConfigurationDialogComponent, {
          maxWidth: '95vw',
          maxHeight: '90vh',
          width: '95vw',
          height: '95vh',
          panelClass: 'configuration-dialog-container',
          data: {
            configurationName: this.selectedConfig.configName,
            toc: this.toc,
            type: this.type,
            decision,
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
      decision: this.overrides.getValue() ? this.overrides.getValue().exportFilterDecision : null,
    });
  }
  ngOnInit() {
  }

  

}
