import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BlockUIModule } from 'ng-block-ui';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule, PanelModule, RadioButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { IgListEffects } from 'src/app/root-store/ig/ig-list/ig-list.effects';
import { CreateIgEffects } from '../../root-store/create-ig/create-ig.effects';
import * as fromIg from '../../root-store/ig/ig.reducer';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { ExportConfigurationModule } from '../export-configuration/export-configuration.module';
import { IgEditEffects } from './../../root-store/ig/ig-edit/ig-edit.effects';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { ConformanceStatementsSummaryEditorComponent } from './components/conformance-statements-summary-editor/conformance-statements-summary-editor.component';
import { CreateIGComponent } from './components/create-ig/create-ig.component';
import { ExportGvtComponent } from './components/export-gvt/export-gvt.component';
import { IgEditActiveTitlebarComponent } from './components/ig-edit-active-titlebar/ig-edit-active-titlebar.component';
import { IgEditContainerComponent } from './components/ig-edit-container/ig-edit-container.component';
import { IgEditDrawerComponent } from './components/ig-edit-drawer/ig-edit-drawer.component';
import { IgEditSidebarComponent } from './components/ig-edit-sidebar/ig-edit-sidebar.component';
import { IgEditStatusBarComponent } from './components/ig-edit-status-bar/ig-edit-status-bar.component';
import { IgEditTitlebarComponent } from './components/ig-edit-titlebar/ig-edit-titlebar.component';
import { IgEditToolbarComponent } from './components/ig-edit-toolbar/ig-edit-toolbar.component';
import { IgListContainerComponent } from './components/ig-list-container/ig-list-container.component';
import { IgMetadataEditorComponent } from './components/ig-metadata-editor/ig-metadata-editor.component';
import { IgSectionEditorComponent } from './components/ig-section-editor/ig-section-editor.component';
import { IgTocFilterComponent } from './components/ig-toc-filter/ig-toc-filter.component';
import { IgTocComponent } from './components/ig-toc/ig-toc.component';
import { IgVerificationComponent } from './components/ig-verification/ig-verification.component';
import { ManageProfileStructureComponent } from './components/manage-profile-structure/manage-profile-structure.component';
import { NarrativeSectionFormComponent } from './components/narrative-section-form/narrative-section-form.component';
import { IgRoutingModule } from './ig-routing.module';
import { DocumentSessionIdInterceptor } from './services/document-session-id.interceptor';
import { IgListService } from './services/ig-list.service';
import { IgService } from './services/ig.service';
import { SyncEditInterceptor } from './services/sync-edit.interceptor';

@NgModule({
  declarations: [
    IgListContainerComponent,
    IgEditContainerComponent,
    IgEditSidebarComponent,
    IgEditToolbarComponent,
    IgEditTitlebarComponent,
    CreateIGComponent,
    IgTocComponent,
    NarrativeSectionFormComponent,
    IgEditActiveTitlebarComponent,
    IgSectionEditorComponent,
    IgMetadataEditorComponent,
    ExportGvtComponent,
    ConformanceStatementsSummaryEditorComponent,
    IgEditStatusBarComponent,
    IgEditDrawerComponent,
    IgTocFilterComponent,
    ManageProfileStructureComponent,
    IgVerificationComponent,
  ],
  imports: [
    DamFrameworkModule.forRoot(),
    IgRoutingModule,
    EffectsModule.forFeature([IgListEffects, CreateIgEffects, IgEditEffects]),
    StoreModule.forFeature(fromIg.featureName, fromIg.reducers),
    CoreModule,
    TabViewModule,
    SharedModule,
    StepsModule,
    RadioButtonModule,
    TableModule,
    ColorPickerModule,
    ContextMenuModule,
    ExportConfigurationModule,
    PanelModule,
    BlockUIModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [
    IgEditContainerComponent, ManageProfileStructureComponent,
  ],
  providers: [
    IgListService,
    IgService,
    { provide: HTTP_INTERCEPTORS, useClass: SyncEditInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DocumentSessionIdInterceptor, multi: true },
  ],
  exports: [
    IgListContainerComponent,
    IgEditContainerComponent,
    IgEditSidebarComponent,
    IgEditToolbarComponent,
    IgEditTitlebarComponent,
    IgEditActiveTitlebarComponent,
    IgSectionEditorComponent,
    IgMetadataEditorComponent,
    ManageProfileStructureComponent,
  ],
})
export class IgModule {
}
