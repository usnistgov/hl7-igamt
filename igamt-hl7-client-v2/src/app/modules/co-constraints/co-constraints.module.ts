import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoConstraintGroupEditEffects } from '../../root-store/co-constraint-group-edit/co-constraint-group-edit.effects';
import * as fromCoConstraintGroup from '../../root-store/co-constraint-group-edit/co-constraint-group-edit.reducer';
import { SegmentService } from '../segment/services/segment.service';
import { SharedModule } from '../shared/shared.module';
import { CoConstraintGroupRoutingModule } from './co-constraints-routing.module';
import { CoConstraintGroupEditorComponent } from './components/co-constraint-group-editor/co-constraint-group-editor.component';
import { CoConstraintTableComponent } from './components/co-constraint-table/co-constraint-table.component';
import { DataHeaderDialogComponent } from './components/data-header-dialog/data-header-dialog.component';
import { NarrativeHeaderDialogComponent } from './components/narrative-header-dialog/narrative-header-dialog.component';
import { CoConstraintGroupService } from './services/co-constraint-group.service';
import { CoConstraintBindingDialogComponent } from './components/co-constraint-binding-dialog/co-constraint-binding-dialog.component';
import { CoConstraintGroupSelectorComponent } from './components/co-constraint-group-selector/co-constraint-group-selector.component';

@NgModule({
  declarations: [CoConstraintTableComponent, DataHeaderDialogComponent, NarrativeHeaderDialogComponent, CoConstraintGroupEditorComponent, CoConstraintBindingDialogComponent, CoConstraintGroupSelectorComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoConstraintGroupRoutingModule,
    EffectsModule.forFeature([CoConstraintGroupEditEffects]),
    StoreModule.forFeature(fromCoConstraintGroup.featureName, fromCoConstraintGroup.reducer),
  ],
  providers: [
    SegmentService,
    CoConstraintGroupService,
  ],
  exports: [CoConstraintTableComponent, DataHeaderDialogComponent, NarrativeHeaderDialogComponent, CoConstraintBindingDialogComponent, CoConstraintGroupSelectorComponent],
  entryComponents: [DataHeaderDialogComponent, NarrativeHeaderDialogComponent, CoConstraintBindingDialogComponent, CoConstraintGroupSelectorComponent],
})
export class CoConstraintsModule { }
