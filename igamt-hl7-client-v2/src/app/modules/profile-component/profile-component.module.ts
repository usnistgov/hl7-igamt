import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {ProfileComponentEffects} from '../../root-store/profile-component/profile-component.effects';
import {ConformanceProfileModule} from '../conformance-profile/conformance-profile.module';
import {SegmentModule} from '../segment/segment.module';
import {SharedModule} from '../shared/shared.module';
import { MessageContextStructureEditorComponent } from './components/message-context-structure-editor/message-context-structure-editor.component';
import {ProfileComponentMetadataComponent} from './components/profile-component-metadata/profile-component-metadata.component';
import { SegmentContextStructureEditorComponent } from './components/segment-context-structure-editor/segment-context-structure-editor.component';
import {ProfileComponentRoutingModule} from './profile-component-routing.module';
import { AddProfileComponentItemComponent } from './components/add-profile-component-item/add-profile-component-item.component';
import { ProfileComponentStructureTreeComponent } from './components/profile-component-structure-tree/profile-component-structure-tree.component';

@NgModule({
  declarations: [ ProfileComponentMetadataComponent, SegmentContextStructureEditorComponent, MessageContextStructureEditorComponent, AddProfileComponentItemComponent, ProfileComponentStructureTreeComponent],
  imports: [
    CommonModule,
    ProfileComponentRoutingModule,
    SegmentModule,
    ConformanceProfileModule,
    EffectsModule.forFeature([ProfileComponentEffects]),
    SharedModule,
  ],
  entryComponents: [AddProfileComponentItemComponent],
})
export class ProfileComponentModule { }
