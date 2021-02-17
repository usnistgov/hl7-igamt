import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {ProfileComponentEffects} from '../../root-store/profile-component/profile-component.effects';
import {SharedModule} from '../shared/shared.module';
import {ProfileComponentMetadataComponent} from './components/profile-component-metadata/profile-component-metadata.component';
import { ProfileComponentStructureEditorComponent } from './components/profile-component-structure-editor/profile-component-structure-editor.component';
import {ProfileComponentRoutingModule} from './profile-component-routing.module';

@NgModule({
  declarations: [ ProfileComponentStructureEditorComponent, ProfileComponentMetadataComponent],
  imports: [
    CommonModule,
    ProfileComponentRoutingModule,
    EffectsModule.forFeature([ProfileComponentEffects]),
    SharedModule,
  ],
})
export class ProfileComponentModule { }
