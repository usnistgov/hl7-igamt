import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ConfigurationComponent} from './configuration.component';
import {ConformanceProfileTableOptionsComponent} from './conformance-profile-table-options/conformance-profile-table-options.component';
import {CompositeProfileTableOptionsComponent} from './composite-profile-table-options/composite-profile-table-options.component';
import {ExportFontComponent} from './export-font/export-font.component';
import {DatatypeLibraryComponent} from './datatype-library/datatype-library.component';
import {DatatypeTableOptionsComponent} from './datatype-table-options/datatype-table-options.component';
import {ProfileComponentTableOptionsComponent} from './profile-component-table-options/profile-component-table-options.component';
import {SegmentTableOptionsComponent} from './segment-table-options/segment-table-options.component';
import {ValuesetTableOptionsComponent} from './valueset-table-options/valueset-table-options.component';
import {ConformanceProfileTableOptionsResolve} from './conformance-profile-table-options/conformance-profile-table-options.resolve.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ConfigurationComponent,
        children: [
          {
            path: '',
            children: [
              {
                path: 'export-fonts',
                component: ExportFontComponent
              },
              {
                path: 'conformance-profile-table-options',
                component: ConformanceProfileTableOptionsComponent,
                resolve: {
                  tableOptions: ConformanceProfileTableOptionsResolve
                },
              },
              {
                path: 'composite-profile-table-options',
                component: CompositeProfileTableOptionsComponent
              },
              {
                path: 'datatype-library',
                component: DatatypeLibraryComponent
              },
              {
                path: 'datatype-table-options',
                component: DatatypeTableOptionsComponent
              },
              {
                path: 'profile-component-table-options',
                component: ProfileComponentTableOptionsComponent
              },
              {
                path: 'segment-table-options',
                component: SegmentTableOptionsComponent
              },
              {
                path: 'valueset-table-options',
                component: ValuesetTableOptionsComponent
              }
            ]
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ConformanceProfileTableOptionsResolve
  ]
})
export class ConfigurationRoutingModule {
}
