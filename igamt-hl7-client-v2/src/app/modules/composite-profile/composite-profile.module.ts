import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {CompositeProfileEffects} from '../../root-store/composite-profile/composite-profile.effects';
import {CoConstraintsModule} from '../co-constraints/co-constraints.module';
import {SharedModule} from '../shared/shared.module';
import { CompositionEditorComponent } from './components/composition-editor/composition-editor.component';
import {CompositeProfileRoutingModule} from './composite-profile-routing.module';

@NgModule({
  declarations: [CompositionEditorComponent],
  imports: [
    CommonModule,
    CompositeProfileRoutingModule,
    CoConstraintsModule,
    SharedModule,
    EffectsModule.forFeature([CompositeProfileEffects]),
    StoreModule,
  ],
})
export class CompositeProfileModule { }
