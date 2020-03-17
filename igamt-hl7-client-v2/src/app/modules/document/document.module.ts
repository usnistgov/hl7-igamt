import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule, RadioButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { DocumentListEffects } from 'src/app/root-store/document/document-list/document-list.effects';
import { CreateDocumentEffects } from '../../root-store/create-ig/create-document.effects';
import { IgEditEffects } from '../../root-store/document/document-edit/ig-edit.effects';
import * as fromIg from '../../root-store/document/document.reducer';
import { ExportConfigurationModule } from '../export-configuration/export-configuration.module';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { CreateIGComponent } from './components/create-ig/create-ig.component';
import { DocumentEditActiveTitlebarComponent } from './components/document-edit-active-titlebar/document-edit-active-titlebar.component';
import { DocumentEditContainerComponent } from './components/document-edit-container/document-edit-container.component';
import { DocumentEditSidebarComponent } from './components/document-edit-sidebar/document-edit-sidebar.component';
import { DocumentEditTitlebarComponent } from './components/document-edit-titlebar/document-edit-titlebar.component';
import { DocumentEditToolbarComponent } from './components/document-edit-toolbar/document-edit-toolbar.component';
import { DocumentListContainerComponent } from './components/document-list-container/document-list-container.component';
import { DocumentListItemCardComponent } from './components/document-list-item-card/document-list-item-card.component';
import { DocumentMetadataEditorComponent } from './components/document-metadata-editor/document-metadata-editor.component';
import { DocumentSectionEditorComponent } from './components/document-section-editor/document-section-editor.component';
import { DocumentTocComponent } from './components/document-toc/document-toc.component';
import { ExportGvtComponent } from './components/export-gvt/export-gvt.component';
import { NarrativeSectionFormComponent } from './components/narrative-section-form/narrative-section-form.component';
import { IgEditorActivateGuard } from './services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from './services/ig-editor-deactivate.service';
import { IgListService } from './services/ig-list.service';
import { IgService } from './services/ig.service';

@NgModule({
  declarations: [
    DocumentListContainerComponent,
    DocumentListItemCardComponent,
    DocumentEditContainerComponent,
    DocumentEditSidebarComponent,
    DocumentEditToolbarComponent,
    DocumentEditTitlebarComponent,
    CreateIGComponent,
    DocumentTocComponent,
    NarrativeSectionFormComponent,
    DocumentEditActiveTitlebarComponent,
    DocumentSectionEditorComponent,
    DocumentMetadataEditorComponent,
    ExportGvtComponent,
  ],
  imports: [
    EffectsModule.forFeature([DocumentListEffects, CreateDocumentEffects, IgEditEffects]),
    StoreModule.forFeature(fromIg.featureName, fromIg.reducers),
    CoreModule,
    SharedModule,
    StepsModule,
    RadioButtonModule,
    TableModule,
    ColorPickerModule,
    ContextMenuModule,
    ExportConfigurationModule,
  ],
  providers: [
    IgListService,
    IgService,
    IgEditSaveDeactivateGuard,
    IgEditorActivateGuard,
  ],
  exports: [
    DocumentListContainerComponent,
    DocumentListItemCardComponent,
    DocumentEditContainerComponent,
    DocumentEditSidebarComponent,
    DocumentEditToolbarComponent,
    DocumentEditTitlebarComponent,
    DocumentEditActiveTitlebarComponent,
    DocumentSectionEditorComponent,
    DocumentMetadataEditorComponent,
  ],
})
export class DocumentModule {
}
