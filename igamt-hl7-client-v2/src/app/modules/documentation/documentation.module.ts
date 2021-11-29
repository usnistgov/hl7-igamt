import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DocumentationEffects } from '../../root-store/documentation/documentation.effects';
import * as fromDocumentation from '../../root-store/documentation/documentation.reducer';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from '../shared/shared.module';
import { DocumentationContainerComponent } from './components/documentation-container/documentation-contrainer.component';
import { DocumentationContentComponent } from './components/documentation-content/documentation-content.component';
import { DocumentationEditorComponent } from './components/documentation-editor/documentation-editor.component';
import { DocumentationListComponent } from './components/documentation-list/documentation-list.component';
import { DocumentationSideBarComponent } from './components/documentation-side-bar/documentation-side-bar.component';
import { DocumentationSubtitleComponent } from './components/documentation-subtitle/documentation-subtitle.component';
import { DocumentationRoutingModule } from './documentation-routing.module';

@NgModule({
  declarations: [DocumentationContainerComponent, DocumentationSideBarComponent, DocumentationContentComponent, DocumentationEditorComponent, DocumentationListComponent, DocumentationSubtitleComponent],
  imports: [
    CommonModule,
    DamFrameworkModule.forRoot(),
    DocumentationRoutingModule,
    SharedModule,
    EffectsModule.forFeature([DocumentationEffects]),
    StoreModule.forFeature(fromDocumentation.featureName, fromDocumentation.reducer),
  ],
  entryComponents: [
    DocumentationContainerComponent,
  ],
  providers: [],
})
export class DocumentationModule { }
