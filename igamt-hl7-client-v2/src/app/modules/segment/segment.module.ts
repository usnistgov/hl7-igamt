import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SegmentEditEffects } from '../../root-store/segment-edit/segment-edit.effects';
import * as fromSegmentEdit from '../../root-store/segment-edit/segment-edit.reducer';
import { SharedModule } from '../shared/shared.module';
import { CoconstraintsEditorComponent } from './components/coconstraints-editor/coconstraints-editor.component';
import { SegmentConformanceStatementEditorComponent } from './components/conformance-statement-editor/segment-conformance-statement-editor.component';
import { SegmentCrossRefsComponent } from './components/cross-refs/segment-cross-refs.component';
import { DeltaEditorComponent } from './components/delta-editor/delta-editor.component';
import { MetadataEditorComponent } from './components/metadata-editor/metadata-editor.component';
import { PostdefEditorComponent } from './components/postdef-editor/postdef-editor.component';
import { PredefEditorComponent } from './components/predef-editor/predef-editor.component';
import { SegmentStructureEditorComponent } from './components/segment-structure-editor/segment-structure-editor.component';
import { SegmentRoutingModule } from './segment-routing.module';
import { SegmentService } from './services/segment.service';
import {DynamicMappingEditorComponent} from "./components/dynamic-mapping-editor/dynamic-mapping-editor.component";

@NgModule({
  declarations: [
    PredefEditorComponent,
    PostdefEditorComponent,
    SegmentStructureEditorComponent,
    SegmentCrossRefsComponent,
    MetadataEditorComponent,
    CoconstraintsEditorComponent,
    SegmentConformanceStatementEditorComponent,
    DeltaEditorComponent,
    DynamicMappingEditorComponent,
  ],
  imports: [
    CommonModule,
    SegmentRoutingModule,
    SharedModule,
    EffectsModule.forFeature([SegmentEditEffects]),
    StoreModule.forFeature('segmentEdit', fromSegmentEdit.reducer),
  ],
  providers: [
    SegmentService,
    SegmentEditEffects,
  ],
  exports: [PredefEditorComponent, PostdefEditorComponent, MetadataEditorComponent, CoconstraintsEditorComponent, SegmentConformanceStatementEditorComponent],
})
export class SegmentModule { }
