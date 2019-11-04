import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationTocComponent } from './components/configuration-toc/configuration-toc.component';
import { ConformanceProfileExportConfigurationComponent } from './components/conformance-profile-export-configuration/conformance-profile-export-configuration.component';
import { DatatypeExportConfigurationComponent } from './components/datatype-export-configuration/datatype-export-configuration.component';
import { ExportConfigurationDialogComponent } from './components/export-configuration-dialog/export-configuration-dialog.component';
import { SegmentExportConfigurationComponent } from './components/segment-export-configuration/segment-export-configuration.component';
import { ValueSetExportConfigurationComponent } from './components/value-set-export-configuration/value-set-export-configuration.component';
import { DefaultConfigurationComponent } from './components/default-configuration/default-configuration.component';
import { ExportConfigurationRoutingModule } from './export-configuration-routing.module';
import {TabViewModule} from 'primeng/tabview';
import {CardModule} from 'primeng/card';



@NgModule({
  declarations: [
    SegmentExportConfigurationComponent,
    DatatypeExportConfigurationComponent,
    ValueSetExportConfigurationComponent,
    ConformanceProfileExportConfigurationComponent,
    ExportConfigurationDialogComponent,
    ConfigurationTocComponent,
    DefaultConfigurationComponent,
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
  ],
  entryComponents: [
    ExportConfigurationDialogComponent,
  ],
})
export class ExportConfigurationModule { }
