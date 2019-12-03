import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { IgService } from '../../../ig/services/ig.service';
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
  igId: string;
  toc: any;
  customized: boolean;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private dialog: MatDialog,
    private igService: IgService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.configlist = data.configurations;
    this.selectedConfig = this.configlist.find( (x) => {
      return x.defaultConfig;
    },
  );
    this.igId = data.igId;
    this.toc = data.toc;
    this.overrides = new BehaviorSubject<any>(undefined);
  }

  customize() {
    this.overrides.asObservable().pipe(
      filter((value) => !!value),
      take(1),
      map((decision) => {
        console.log(decision);
        const tocDialog = this.dialog.open(ExportConfigurationDialogComponent, {
          maxWidth: '95vw',
          maxHeight: '90vh',
          width: '95vw',
          height: '95vh',
          panelClass: 'configuration-dialog-container',
          data: {
            configurationName: this.selectedConfig.configName,
            toc: this.toc,
            decision,
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
  }

  change(configuration) {
    this.igService.getExportFirstDecision(this.igId, configuration.id).pipe(
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
