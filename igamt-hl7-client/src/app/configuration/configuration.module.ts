import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationRoutingModule} from './configuration-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule, Sidebar, PanelMenuModule} from 'primeng/primeng';
import {ConfigurationComponent} from './configuration.component';
import { ExportFontComponent } from './export-font/export-font.component';
import { SegmentTableOptionsComponent } from './segment-table-options/segment-table-options.component';
import { DatatypeTableOptionsComponent } from './datatype-table-options/datatype-table-options.component';
import { ValuesetTableOptionsComponent } from './valueset-table-options/valueset-table-options.component';
import { CompositeProfileTableOptionsComponent } from './composite-profile-table-options/composite-profile-table-options.component';
import { ConformanceProfileTableOptionsComponent } from './conformance-profile-table-options/conformance-profile-table-options.component';
import { ProfileComponentTableOptionsComponent } from './profile-component-table-options/profile-component-table-options.component';
import { DatatypeLibraryComponent } from './datatype-library/datatype-library.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    AccordionModule,
    ButtonModule,
    GrowlModule,
    PanelMenuModule
  ],
  declarations: [
    ConfigurationComponent,
    ExportFontComponent,
    SegmentTableOptionsComponent,
    DatatypeTableOptionsComponent,
    ValuesetTableOptionsComponent,
    CompositeProfileTableOptionsComponent,
    ConformanceProfileTableOptionsComponent,
    ProfileComponentTableOptionsComponent,
    DatatypeLibraryComponent,
    SidebarComponent
  ]
})
export class ConfigurationModule {}
