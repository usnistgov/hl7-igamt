import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ValueSetEditEffects } from '../../root-store/value-set-edit/value-set-edit.effects';
import { SharedModule } from '../shared/shared.module';
import { DeltaEditorComponent } from './components/delta-editor/delta-editor.component';
import { ValueSetCrossRefsComponent } from './components/value-set-cross-refs/value-set-cross-refs.component';
import { ValueSetMetadataEditorComponent } from './components/value-set-metadata-editor/value-set-metadata-editor.component';
import { ValueSetPostdefEditorComponent } from './components/value-set-postdef-editor/value-set-postdef-editor.component';
import { ValueSetPredefEditorComponent } from './components/value-set-predef-editor/value-set-predef-editor.component';
import { ValueSetStructureEditorComponent } from './components/value-set-structure-editor/value-set-structure-editor.component';
import { ValueSetService } from './service/value-set.service';
import { ValueSetRoutingModule } from './value-set-routing.module';

@NgModule({
  declarations: [ValueSetCrossRefsComponent, ValueSetMetadataEditorComponent, ValueSetPredefEditorComponent, ValueSetPostdefEditorComponent, ValueSetStructureEditorComponent, DeltaEditorComponent],
  imports: [
    CommonModule,
    ValueSetRoutingModule,
    EffectsModule.forFeature([ValueSetEditEffects]),
    SharedModule,
  ],
  providers: [ValueSetService, ValueSetEditEffects],
})
export class ValueSetModule { }
