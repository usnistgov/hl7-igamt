import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IgService } from '../../../ig/services/ig.service';
import { IExportConfiguration } from '../../models/default-export-configuration.interface';
import { IExportConfigurationForFrontEnd } from '../../models/exportConfigurationForFrontEnd.interface';
import { ExportConfigurationDialogComponent } from '../export-configuration-dialog/export-configuration-dialog.component';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css'],
})
export class ExportDialogComponent implements OnInit {

  configlist: IExportConfigurationForFrontEnd[];
  selectedConfig: IExportConfigurationForFrontEnd;
  igId: string;
  toc: any;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private dialog: MatDialog,
    private igService: IgService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      this.configlist = data.configurations;
      this.igId = data.igId;
      this.toc = data.toc;

      console.log(this.igId);
      }

      customize() {
        this.igService.getExportFirstDecision(this.igId, this.selectedConfig.id).pipe(
          map((decision) => {
            const tocDialog = this.dialog.open(ExportConfigurationDialogComponent, {
              maxWidth: '95vw',
              maxHeight: '90vh',
              width: '95vw',
              height: '95vh',
              data: {
                toc: this.toc,
                decision,
              },
            });
            tocDialog.afterClosed().subscribe( (result) => {
              this.dialogRef.close({
                configurationId: this.selectedConfig.id,
                decision: result,
              });
             } );
          }),
        ).subscribe();

      }

      exportNow() {
       this.dialogRef.close({
          configurationId: this.selectedConfig.id,
        });
      }

  ngOnInit() {
  }

}
