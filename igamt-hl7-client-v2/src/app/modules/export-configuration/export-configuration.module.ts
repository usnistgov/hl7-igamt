import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationTocComponent } from './components/configuration-toc/configuration-toc.component';
import { ConformanceProfileExportConfigurationComponent } from './components/conformance-profile-export-configuration/conformance-profile-export-configuration.component';
import { DatatypeExportConfigurationComponent } from './components/datatype-export-configuration/datatype-export-configuration.component';
import { DefaultConfigurationComponent } from './components/default-configuration/default-configuration.component';
import { DeltaExportConfigurationComponent } from './components/delta-export-configuration/delta-export-configuration.component';
import { ExportConfigurationDialogComponent } from './components/export-configuration-dialog/export-configuration-dialog.component';
import { ExportDialogComponent } from './components/export-dialog/export-dialog.component';
import { SegmentExportConfigurationComponent } from './components/segment-export-configuration/segment-export-configuration.component';
import { ValueSetExportConfigurationComponent } from './components/value-set-export-configuration/value-set-export-configuration.component';
import { ExportConfigurationRoutingModule } from './export-configuration-routing.module';
import { ExportConfigurationService } from './services/export-configuration.service';

@NgModule({
  declarations: [
    SegmentExportConfigurationComponent,
    DatatypeExportConfigurationComponent,
    ValueSetExportConfigurationComponent,
    ConformanceProfileExportConfigurationComponent,
    ExportConfigurationDialogComponent,
    ConfigurationTocComponent,
    DefaultConfigurationComponent,
    DeltaExportConfigurationComponent,
    ExportDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExportConfigurationRoutingModule,
    TabViewModule,
    CardModule,
  ],
  exports: [
    SegmentExportConfigurationComponent,
    DatatypeExportConfigurationComponent,
    ValueSetExportConfigurationComponent,
    ConformanceProfileExportConfigurationComponent,
    ExportConfigurationDialogComponent,
    DefaultConfigurationComponent,
    ExportDialogComponent,
  ],
  entryComponents: [
    ExportConfigurationDialogComponent,
    ExportDialogComponent,
  ],
  providers: [
    ExportConfigurationService,
  ],
})
export class ExportConfigurationModule { }
