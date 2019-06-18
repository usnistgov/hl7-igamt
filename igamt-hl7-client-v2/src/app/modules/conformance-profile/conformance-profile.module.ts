import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ConformanceProfileEditEffects } from '../../root-store/conformance-profile-edit/conformance-profile-edit.effects';
import * as fromConformanceProfile from '../../root-store/conformance-profile-edit/conformance-profile-edit.reducer';
import { SharedModule } from '../shared/shared.module';
import { PostdefEditorComponent } from './components/postdef-editor/postdef-editor.component';
import { PredefEditorComponent } from './components/predef-editor/predef-editor.component';
import { ConformanceProfileRoutingModule } from './conformance-profile-routing.module';
import { ConformanceProfileService } from './services/conformance-profile.service';

@NgModule({
  declarations: [
    PredefEditorComponent,
    PostdefEditorComponent,
  ],
  imports: [
    CommonModule,
    ConformanceProfileRoutingModule,
    SharedModule,
    EffectsModule.forFeature([ConformanceProfileEditEffects]),
    StoreModule.forFeature(fromConformanceProfile.featureName, fromConformanceProfile.reducer),
  ],
  providers: [
    ConformanceProfileService,
  ],
  exports: [PredefEditorComponent, PostdefEditorComponent],
})
export class ConformanceProfileModule { }
