import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {ProfileComponentEffects} from '../../root-store/profile-component/profile-component.effects';
import {ConformanceProfileModule} from '../conformance-profile/conformance-profile.module';
import {SegmentModule} from '../segment/segment.module';
import {SharedModule} from '../shared/shared.module';
import { AddProfileComponentItemComponent } from './components/add-profile-component-item/add-profile-component-item.component';
import { MessageContextStructureEditorComponent } from './components/message-context-structure-editor/message-context-structure-editor.component';
import {ProfileComponentMetadataComponent} from './components/profile-component-metadata/profile-component-metadata.component';
import { PpCardinalityComponent } from './components/profile-component-structure-tree/columns/pp-cardinality/pp-cardinality.component';
import { PpConfLengthComponent } from './components/profile-component-structure-tree/columns/pp-conf-length/pp-conf-length.component';
import { PpConstantValueComponent } from './components/profile-component-structure-tree/columns/pp-constant-value/pp-constant-value.component';
import { PpDatatypeComponent } from './components/profile-component-structure-tree/columns/pp-datatype/pp-datatype.component';
import { PpLengthComponent } from './components/profile-component-structure-tree/columns/pp-length/pp-length.component';
import { PpNameComponent } from './components/profile-component-structure-tree/columns/pp-name/pp-name.component';
import { PpUsageComponent } from './components/profile-component-structure-tree/columns/pp-usage/pp-usage.component';
import { PpValuesetComponent } from './components/profile-component-structure-tree/columns/pp-valueset/pp-valueset.component';
import { ProfileComponentStructureTreeComponent } from './components/profile-component-structure-tree/profile-component-structure-tree.component';
import { SegmentContextStructureEditorComponent } from './components/segment-context-structure-editor/segment-context-structure-editor.component';
import {ProfileComponentRoutingModule} from './profile-component-routing.module';

@NgModule({
  declarations: [ ProfileComponentMetadataComponent, SegmentContextStructureEditorComponent, MessageContextStructureEditorComponent, AddProfileComponentItemComponent, ProfileComponentStructureTreeComponent, PpNameComponent, PpUsageComponent, PpConstantValueComponent, PpCardinalityComponent, PpLengthComponent, PpConfLengthComponent, PpDatatypeComponent, PpValuesetComponent],
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
