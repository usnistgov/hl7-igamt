import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import {TabViewModule} from 'primeng/tabview';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { IExportConfiguration } from '../../models/default-export-configuration.interface';
import { IExportConfigurationForFrontEnd } from '../../models/exportConfigurationForFrontEnd.interface';
import { ExportConfigurationService } from '../../services/export-configuration.service';

@Component({
  selector: 'app-default-configuration',
  templateUrl: './default-configuration.component.html',
  styleUrls: ['./default-configuration.component.css'],
})
export class DefaultConfigurationComponent implements OnInit {

basicExportConfiguration: IExportConfiguration;
currentConfiguration: IExportConfiguration;
backupConfiguration: IExportConfiguration;
exportConfigurationForFrontEnd: IExportConfigurationForFrontEnd;
configList: IExportConfigurationForFrontEnd[];
configName: string;
  constructor(
    private exportConfigurationService: ExportConfigurationService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.displayConfigurations();
    this.exportConfigurationService.getExportConfigurationById('BasicExportConfiguration').subscribe(
      (x) => this.currentConfiguration = x);
    this.backupConfiguration = this.currentConfiguration;
  }

  displayConfigurations() {
    this.exportConfigurationService.getAllExportConfigurationByUsername().subscribe(
      (x) => this.configList = x);
  }

  open(id: string) {
    this.exportConfigurationService.getExportConfigurationById(id).subscribe(
       (x) => { this.currentConfiguration = x,
      this.backupConfiguration = _.cloneDeep(this.currentConfiguration); },
    );
    // FETCH
    // CLONE and AFFECT TO BACKUP
    // AFFECT TO currentConfiguration
  }

  reset() {
this.currentConfiguration = this.backupConfiguration;
  }

  create() {
    this.exportConfigurationService.createExportConfiguration().subscribe(
       (x) => {this.currentConfiguration = x;
               this.open(this.currentConfiguration.id);
               this.displayConfigurations();
    },
    );
    // CREATE
    // REFRESH LIST
    // OPEN
  }

  delete(configuration: IExportConfiguration) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to delete Export Configuration "' + configuration.configName + '" ?',
        action: 'Delete Export Configuration',
      },
    });

    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.exportConfigurationService.deleteExportConfiguration(configuration).subscribe(
          () => this.displayConfigurations(),
          );
          // REFRESH LIST
        }
      },
    );
  }

  save() {
    this.exportConfigurationService.saveExportConfiguration(this.currentConfiguration).subscribe(
    () => this.displayConfigurations(),
    );

  }

}
