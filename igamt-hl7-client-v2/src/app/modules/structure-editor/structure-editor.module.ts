import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StructureEditorEffects } from '../../root-store/structure-editor/structure-editor.effects';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from '../shared/shared.module';
import { ActiveTitlebarComponent } from './components/active-titlebar/active-titlebar.component';
import { CreateMessageDialogComponent } from './components/create-message-dialog/create-message-dialog.component';
import { CreateSegmentDialogComponent } from './components/create-segment-dialog/create-segment-dialog.component';
import { DependencyViewerComponent } from './components/dependency-viewer/dependency-viewer.component';
import { FieldAddDialogComponent } from './components/field-add-dialog/field-add-dialog.component';
import { GroupAddDialogComponent } from './components/group-add-dialog/group-add-dialog.component';
import { CardinalityComponent } from './components/hl7-v2-tree-structure/columns/cardinality/cardinality.component';
import { ConformanceLengthComponent } from './components/hl7-v2-tree-structure/columns/conformance-length/conformance-length.component';
import { DatatypeComponent } from './components/hl7-v2-tree-structure/columns/datatype/datatype.component';
import { LengthComponent } from './components/hl7-v2-tree-structure/columns/length/length.component';
import { NameComponent } from './components/hl7-v2-tree-structure/columns/name/name.component';
import { SegmentComponent } from './components/hl7-v2-tree-structure/columns/segment/segment.component';
import { UsageComponent } from './components/hl7-v2-tree-structure/columns/usage/usage.component';
import { ValuesetComponent } from './components/hl7-v2-tree-structure/columns/valueset/valueset.component';
import { ResourceSelectDialogComponent } from './components/hl7-v2-tree-structure/dialogs/resource-select-dialog/resource-select-dialog.component';
import { Hl7V2TreeStructureComponent } from './components/hl7-v2-tree-structure/hl7-v2-tree-structure.component';
import { MessageMetadataEditorComponent } from './components/message-metadata-editor/message-metadata-editor.component';
import { MessageStructureEditorComponent } from './components/message-structure-editor/message-structure-editor.component';
import { SegmentAddDialogComponent } from './components/segment-add-dialog/segment-add-dialog.component';
import { SegmentMetadataEditorComponent } from './components/segment-metadata-editor/segment-metadata-editor.component';
import { SegmentStructureEditorComponent } from './components/segment-structure-editor/segment-structure-editor.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { StructureEditorContainerComponent } from './components/structure-editor-container/structure-editor-container.component';
import { TableOfContentComponent } from './components/table-of-content/table-of-content.component';
import { StructureEditorResourceRepositoryService } from './services/structure-editor-resource-repository.service';
import { StructureEditorRoutingModule } from './structure-editor-routing.module';

@NgModule({
  declarations: [
    StructureEditorContainerComponent,
    SideBarComponent,
    Hl7V2TreeStructureComponent,
    TableOfContentComponent,
    MessageMetadataEditorComponent,
    SegmentMetadataEditorComponent,
    MessageStructureEditorComponent,
    SegmentStructureEditorComponent,
    DependencyViewerComponent,
    CreateMessageDialogComponent,
    CardinalityComponent,
    ConformanceLengthComponent,
    DatatypeComponent,
    LengthComponent,
    NameComponent,
    SegmentComponent,
    UsageComponent,
    ValuesetComponent,
    ResourceSelectDialogComponent,
    SegmentAddDialogComponent,
    GroupAddDialogComponent,
    ActiveTitlebarComponent,
    CreateSegmentDialogComponent,
    FieldAddDialogComponent,
  ],
  imports: [
    CommonModule,
    StructureEditorRoutingModule,
    DamFrameworkModule.forRoot(),
    SharedModule,
    EffectsModule.forFeature([StructureEditorEffects]),
  ],
  providers: [
    StructureEditorResourceRepositoryService,
  ],
  exports: [StructureEditorContainerComponent],
  entryComponents: [CreateMessageDialogComponent, ResourceSelectDialogComponent, SegmentAddDialogComponent, GroupAddDialogComponent, FieldAddDialogComponent, CreateSegmentDialogComponent, StructureEditorContainerComponent],
})
export class StructureEditorModule { }
