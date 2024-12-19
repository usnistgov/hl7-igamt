import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoConstraintGroupEditEffects } from '../../root-store/co-constraint-group-edit/co-constraint-group-edit.effects';
import { SegmentService } from '../segment/services/segment.service';
import { SharedModule } from '../shared/shared.module';
import { CoConstraintGroupRoutingModule } from './co-constraints-routing.module';
import { CoConstraintBindingDialogComponent } from './components/co-constraint-binding-dialog/co-constraint-binding-dialog.component';
import { CoConstraintCrossRefComponent } from './components/co-constraint-cross-ref/co-constraint-cross-ref.component';
import { CoConstraintGroupDeltaEditorComponent } from './components/co-constraint-group-delta-editor/co-constraint-group-delta-editor.component';
import { CoConstraintGroupEditorComponent } from './components/co-constraint-group-editor/co-constraint-group-editor.component';
import { CoConstraintGroupSelectorComponent } from './components/co-constraint-group-selector/co-constraint-group-selector.component';
import { CoConstraintImportDialogComponent } from './components/co-constraint-import-dialog/co-constraint-import-dialog.component';
import { CoConstraintTableComponent } from './components/co-constraint-table/co-constraint-table.component';
import { CodeCellComponent } from './components/co-constraint-table/code-cell/code-cell.component';
import { DatatypeCellComponent } from './components/co-constraint-table/datatype-cell/datatype-cell.component';
import { ValueCellComponent } from './components/co-constraint-table/value-cell/value-cell.component';
import { VariesCellComponent } from './components/co-constraint-table/varies-cell/varies-cell.component';
import { VsCellComponent } from './components/co-constraint-table/vs-cell/vs-cell.component';
import { ContextCoConstraintBindingComponent } from './components/context-co-constraint-binding/context-co-constraint-binding.component';
import { DataHeaderDialogComponent } from './components/data-header-dialog/data-header-dialog.component';
import { GrouperDialogComponent } from './components/grouper-dialog/grouper-dialog.component';
import { NarrativeHeaderDialogComponent } from './components/narrative-header-dialog/narrative-header-dialog.component';
import { SegmentCoConstraintBindingComponent } from './components/segment-co-constraint-binding/segment-co-constraint-binding.component';
import { CoConstraintGroupService } from './services/co-constraint-group.service';
import { FileUploadService } from './services/file-upload.service';

@NgModule({
  declarations: [
    CoConstraintTableComponent,
    DataHeaderDialogComponent,
    NarrativeHeaderDialogComponent,
    CoConstraintGroupEditorComponent,
    CoConstraintBindingDialogComponent,
    CoConstraintGroupSelectorComponent,
    SegmentCoConstraintBindingComponent,
    ContextCoConstraintBindingComponent,
    CoConstraintCrossRefComponent,
    CoConstraintGroupDeltaEditorComponent,
    GrouperDialogComponent,
    CodeCellComponent,
    VsCellComponent,
    DatatypeCellComponent,
    VariesCellComponent,
    ValueCellComponent,
    CoConstraintImportDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatProgressSpinnerModule,
    CoConstraintGroupRoutingModule,
    EffectsModule.forFeature([CoConstraintGroupEditEffects]),
    StoreModule,
  ],
  providers: [
    SegmentService,
    CoConstraintGroupService,
    FileUploadService,
  ],
  exports: [CoConstraintTableComponent, DataHeaderDialogComponent, NarrativeHeaderDialogComponent, CoConstraintBindingDialogComponent, CoConstraintGroupSelectorComponent, SegmentCoConstraintBindingComponent, ContextCoConstraintBindingComponent, CodeCellComponent, VsCellComponent, DatatypeCellComponent, VariesCellComponent, ValueCellComponent],
  entryComponents: [DataHeaderDialogComponent, NarrativeHeaderDialogComponent, CoConstraintBindingDialogComponent, CoConstraintGroupSelectorComponent, GrouperDialogComponent, CoConstraintImportDialogComponent],
})
export class CoConstraintsModule { }
