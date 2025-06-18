import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CompositeProfileEffects } from '../../root-store/composite-profile/composite-profile.effects';
import { CoConstraintsModule } from '../co-constraints/co-constraints.module';
import { SharedModule } from '../shared/shared.module';
import { CompositeDeltaEditorComponent } from './components/composite-delta-editor/composite-delta-editor.component';
import { CompositeProfileMetadataEditorComponent } from './components/composite-profile-metadata-editor/composite-profile-metadata-editor.component';
import { CompositeProfilePostDefComponent } from './components/composite-profile-post-def/composite-profile-post-def.component';
import { CompositeProfilePreDefComponent } from './components/composite-profile-pre-def/composite-profile-pre-def.component';
import { CompositionEditorComponent } from './components/composition-editor/composition-editor.component';
import { StructureEditorComponent } from './components/structure-editor/structure-editor.component';
import { CompositeProfileRoutingModule } from './composite-profile-routing.module';
import { CompositeProfileService } from './services/composite-profile.service';

@NgModule({
  declarations: [CompositionEditorComponent, StructureEditorComponent, CompositeProfileMetadataEditorComponent, CompositeProfilePreDefComponent, CompositeProfilePostDefComponent, CompositeDeltaEditorComponent],
  imports: [
    CommonModule,
    CompositeProfileRoutingModule,
    CoConstraintsModule,
    SharedModule,
    EffectsModule.forFeature([CompositeProfileEffects]),
    StoreModule,
  ],
  providers: [
    CompositeProfileService,
  ],
})
export class CompositeProfileModule { }
