import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {EffectsModule} from '@ngrx/effects';
import {DocumentationEffects} from '../../root-store/documentation/documentation.effects';
import {SharedModule} from '../shared/shared.module';
import {DocumentationContainerComponent} from './components/documentation-container/documentation-contrainer.component';
import { DocumentationContentComponent } from './components/documentation-content/documentation-content.component';
import { DocumentationEditorComponent } from './components/documentation-editor/documentation-editor.component';
import { DocumentationListComponent } from './components/documentation-list/documentation-list.component';
import { DocumentationSideBarComponent } from './components/documentation-side-bar/documentation-side-bar.component';
import {DocumentationResolver} from './documentation-resolver';
import { DocumentationRoutingModule } from './documentation-routing.module';

@NgModule({
  declarations: [DocumentationContainerComponent, DocumentationSideBarComponent, DocumentationContentComponent, DocumentationEditorComponent, DocumentationListComponent],
  imports: [
    CommonModule,
    DocumentationRoutingModule,
    SharedModule,
    EffectsModule.forFeature([DocumentationEffects]),
  ],
  providers: [DocumentationResolver],
})
export class DocumentationModule { }
