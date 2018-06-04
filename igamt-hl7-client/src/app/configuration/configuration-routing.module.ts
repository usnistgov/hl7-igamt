import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ConfigurationComponent} from './configuration.compronent';
import {ConformanceProfileTableOptionsComponent} from './conformance-profile-table-options/conformance-profile-table-options.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {CompositeProfileTableOptionsComponent} from './composite-profile-table-options/composite-profile-table-options.component';
import {ExportFontComponent} from './export-font/export-font.component';

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
                outlet: 'content'
              },
              {
                path: 'composite-profile-table-options',
                component: CompositeProfileTableOptionsComponent,
                outlet: 'content'
              }
            ]
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ConfigurationRoutingModule {
}
