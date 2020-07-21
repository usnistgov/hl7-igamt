import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
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
  getExportFirstDecision: (documentId: string, configId: string) => Observable<IExportConfigurationGlobal>;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.overrides = new BehaviorSubject<any>(undefined);
    this.overrides$ = this.overrides.asObservable();
    this.igId = data.igId;
    this.toc = data.toc;
    this.type = data.type;
    this.configlist = data.configurations;
    this.getExportFirstDecision = data.getExportFirstDecision;
    console.log('selected config : ', this.selectedConfig);
    this.selectedConfig = this.configlist.find( (x) => {
        return x.defaultConfig;
      },
    );
    if (!this.selectedConfig) {
      this.selectedConfig = this.configlist.find( (x) => {
          return x.original;
        },
      );
    }
    if (this.selectedConfig) {
      this.change(this.selectedConfig);
    }

  }

  customize() {
    this.overrides.asObservable().pipe(
      filter((value) => !!value),
      take(1),
      map((decision) => {
        console.log('decision : ' , decision);
        console.log('selectedConfig : ' + this.selectedConfig.configName);

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
            documentId : this.igId,
          },
        });
        tocDialog.afterClosed().subscribe((result) => {
          if (result) {
            this.customized = true;
            console.log(result);
            this.overrides.next({
              ...decision,
              exportFilterDecision: result,
            });
          }
        });
      }),
    ).subscribe();
    console.log('customize clicked');

  }

  change(configuration) {
    this.getExportFirstDecision(this.igId, configuration.id).pipe(
      map((decision) => {
        this.overrides.next(decision);
        this.customized = false;
      }),
    ).subscribe();
  }

  export() {
    this.dialogRef.close({
      configurationId: this.selectedConfig.id,
      decision: this.overrides.getValue() ? this.overrides.getValue().exportFilterDecision : undefined,
    });
  }

  ngOnInit() {
  }

}
