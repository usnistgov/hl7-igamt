import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ProfileComponentEffects } from '../../root-store/profile-component/profile-component.effects';
import { CoConstraintsModule } from '../co-constraints/co-constraints.module';
import { ConformanceProfileModule } from '../conformance-profile/conformance-profile.module';
import { SegmentModule } from '../segment/segment.module';
import { SharedModule } from '../shared/shared.module';
import { AddProfileComponentItemComponent } from './components/add-profile-component-item/add-profile-component-item.component';
import { CoConstraintsEditorComponent } from './components/co-constraints-editor/co-constraints-editor.component';
import { MessageConformanceStatementEditorComponent } from './components/message-conformance-statement-editor/message-conformance-statement-editor.component';
import { MessageContextStructureEditorComponent } from './components/message-context-structure-editor/message-context-structure-editor.component';
import { PcDynamicMappingSelectorComponent } from './components/pc-dynamic-mapping-selector/pc-dynamic-mapping-selector.component';
import { ProfileComponentMetadataComponent } from './components/profile-component-metadata/profile-component-metadata.component';
import { PpCardinalityComponent } from './components/profile-component-structure-tree/columns/pp-cardinality/pp-cardinality.component';
import { PpConfLengthComponent } from './components/profile-component-structure-tree/columns/pp-conf-length/pp-conf-length.component';
import { PpConstantValueComponent } from './components/profile-component-structure-tree/columns/pp-constant-value/pp-constant-value.component';
import { PpDatatypeComponent } from './components/profile-component-structure-tree/columns/pp-datatype/pp-datatype.component';
import { PpLengthComponent } from './components/profile-component-structure-tree/columns/pp-length/pp-length.component';
import { PpNameComponent } from './components/profile-component-structure-tree/columns/pp-name/pp-name.component';
import { PpSegmentComponent } from './components/profile-component-structure-tree/columns/pp-segment/pp-segment.component';
import { PpUsageComponent } from './components/profile-component-structure-tree/columns/pp-usage/pp-usage.component';
import { PpValuesetComponent } from './components/profile-component-structure-tree/columns/pp-valueset/pp-valueset.component';
import { ProfileComponentStructureTreeComponent } from './components/profile-component-structure-tree/profile-component-structure-tree.component';
import { SegmentConformanceStatementEditorComponent } from './components/segment-conformance-statement-editor/segment-conformance-statement-editor.component';
import { SegmentContextDynamicMappingComponent } from './components/segment-context-dynamic-mapping/segment-context-dynamic-mapping.component';
import { SegmentContextStructureEditorComponent } from './components/segment-context-structure-editor/segment-context-structure-editor.component';
import { ProfileComponentRoutingModule } from './profile-component-routing.module';
import { ProfileComponentService } from './services/profile-component.service';

@NgModule({
  declarations: [
    ProfileComponentMetadataComponent,
    SegmentContextStructureEditorComponent,
    MessageContextStructureEditorComponent,
    AddProfileComponentItemComponent,
    ProfileComponentStructureTreeComponent,
    PpNameComponent,
    PpUsageComponent,
    PpConstantValueComponent,
    PpCardinalityComponent,
    PpLengthComponent,
    PpConfLengthComponent,
    PpDatatypeComponent,
    PpValuesetComponent,
    PpSegmentComponent,
    SegmentConformanceStatementEditorComponent,
    MessageConformanceStatementEditorComponent,
    SegmentContextDynamicMappingComponent,
    PcDynamicMappingSelectorComponent,
    CoConstraintsEditorComponent,
  ],
  imports: [
    CommonModule,
    ProfileComponentRoutingModule,
    SegmentModule,
    ConformanceProfileModule,
    CoConstraintsModule,
    EffectsModule.forFeature([ProfileComponentEffects]),
    SharedModule,
  ],
  providers: [
    ProfileComponentService
  ],
  entryComponents: [AddProfileComponentItemComponent, CoConstraintsEditorComponent],
})
export class ProfileComponentModule { }
