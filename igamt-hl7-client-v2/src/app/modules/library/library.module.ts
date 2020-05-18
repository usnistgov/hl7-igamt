import { NgModule } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ColorPickerModule } from 'primeng/colorpicker';
import {AutoCompleteModule, ContextMenuModule, RadioButtonModule, TreeTableModule} from 'primeng/primeng';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { LibraryListEffects } from 'src/app/root-store/library/library-list/library-list.effects';
import {CreateLibraryEffects} from '../../root-store/create-library/create-library.effects';
import * as fromLibrary from '../../root-store/library/library.reducer';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { ExportConfigurationModule } from '../export-configuration/export-configuration.module';
import { LibraryEditEffects } from './../../root-store/library/library-edit/library-edit.effects';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import {CreateLibraryComponent} from './components/create-library/create-library.component';
import {DatatypesEvolutionComponent} from './components/datatypes-eveolution/datatypes-evolution.component';
import { LibraryEditActiveTitlebarComponent } from './components/library-edit-active-titlebar/library-edit-active-titlebar.component';
import { LibraryEditContainerComponent } from './components/library-edit-container/library-edit-container.component';
import { LibraryEditSidebarComponent } from './components/library-edit-sidebar/library-edit-sidebar.component';
import { LibraryEditTitlebarComponent } from './components/library-edit-titlebar/library-edit-titlebar.component';
import { LibraryEditToolbarComponent } from './components/library-edit-toolbar/library-edit-toolbar.component';
import { LibraryListContainerComponent } from './components/library-list-container/library-list-container.component';
import {LibraryListItemCardComponent} from './components/library-list-item-card/library-list-item-card.component';
import { LibraryMetadataEditorComponent } from './components/library-metadata-editor/library-metadata-editor.component';
import { LibrarySectionEditorComponent } from './components/library-section-editor/library-section-editor.component';
import { LibraryTocComponent } from './components/library-toc/library-toc.component';
import { NarrativeSectionFormComponent } from './components/narrative-section-form/narrative-section-form.component';
import {NamingSelectionDirective} from './components/publish-library-dialog/naming-selection-directive';
import { LibraryRoutingModule } from './library-routing.module';
import { LibraryListService } from './services/library-list.service';
import { LibraryService } from './services/library.service';
import { PublishLibraryDialogComponent } from './components/publish-library-dialog/publish-library-dialog.component';

@NgModule({
  declarations: [
    LibraryListContainerComponent,
    LibraryEditContainerComponent,
    LibraryEditSidebarComponent,
    LibraryEditToolbarComponent,
    LibraryEditTitlebarComponent,
    LibraryTocComponent,
    NarrativeSectionFormComponent,
    LibraryEditActiveTitlebarComponent,
    LibrarySectionEditorComponent,
    LibraryMetadataEditorComponent,
    CreateLibraryComponent,
    LibraryListItemCardComponent,
    DatatypesEvolutionComponent,
    PublishLibraryDialogComponent,
    NamingSelectionDirective,
  ],
  imports: [
    DamFrameworkModule.forRoot(),
    LibraryRoutingModule,
    EffectsModule.forFeature([CreateLibraryEffects, LibraryListEffects, LibraryEditEffects]),
    StoreModule.forFeature(fromLibrary.featureName, fromLibrary.reducers),
    CoreModule,
    TabViewModule,
    SharedModule,
    StepsModule,
    RadioButtonModule,
    TableModule,
    ColorPickerModule,
    ContextMenuModule,
    ExportConfigurationModule,
    TreeTableModule,
    AutoCompleteModule,
    MatSelectModule,
  ],
  providers: [
    LibraryListService,
    LibraryService,
  ],
  exports: [
    LibraryListContainerComponent,
    LibraryEditContainerComponent,
    LibraryEditSidebarComponent,
    LibraryEditToolbarComponent,
    LibraryEditTitlebarComponent,
    LibraryEditActiveTitlebarComponent,
    LibrarySectionEditorComponent,
    LibraryMetadataEditorComponent,
    CreateLibraryComponent,
  ],
  entryComponents: [PublishLibraryDialogComponent],
})
export class LibraryModule {
}
