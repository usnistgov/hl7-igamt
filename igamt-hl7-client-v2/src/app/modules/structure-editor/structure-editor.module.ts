import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StructureEditorEffects } from '../../root-store/structure-editor/structure-editor.effects';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from '../shared/shared.module';
import { DependencyViewerComponent } from './components/dependency-viewer/dependency-viewer.component';
import { MessageMetadataEditorComponent } from './components/message-metadata-editor/message-metadata-editor.component';
import { MessageStructureEditorComponent } from './components/message-structure-editor/message-structure-editor.component';
import { SegmentMetadataEditorComponent } from './components/segment-metadata-editor/segment-metadata-editor.component';
import { SegmentStructureEditorComponent } from './components/segment-structure-editor/segment-structure-editor.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { StructureEditorContainerComponent } from './components/structure-editor-container/structure-editor-container.component';
import { TableOfContentComponent } from './components/table-of-content/table-of-content.component';
import { StructureEditorRoutingModule } from './structure-editor-routing.module';

@NgModule({
  declarations: [StructureEditorContainerComponent, SideBarComponent, TableOfContentComponent, MessageMetadataEditorComponent, SegmentMetadataEditorComponent, MessageStructureEditorComponent, SegmentStructureEditorComponent, DependencyViewerComponent],
  imports: [
    CommonModule,
    StructureEditorRoutingModule,
    DamFrameworkModule.forRoot(),
    SharedModule,
    EffectsModule.forFeature([StructureEditorEffects]),
  ],
  exports: [StructureEditorContainerComponent],
})
export class StructureEditorModule { }
