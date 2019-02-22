/**
 * Created by hnt5 on 10/30/17.
 */
import {NgModule} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {DisplayBadgeComponent} from "../common/badge/display-badge.component";
import {EditFreeConstraintComponent} from "../common/constraint/edit-freeconstraint.component";
import {EditSimpleConstraintComponent} from "../common/constraint/edit-simpleconstraint.component";
import {EditSimplePropositionComponent} from "../common/constraint/edit-simpleproposition.component";
import {EditSimplePropositionConstraintComponent}  from "../common/constraint/edit-simplepropositionconstraint.component";
import {EditComplexConstraintComponent} from "../common/constraint/edit-complexconstraint.component";

import {DtFlavorPipe} from "../igdocuments/igdocument-edit/segment-edit/coconstraint-table/datatype-name.pipe";
import {CommonModule} from "@angular/common";
import {EntityHeaderComponent} from "../common/entity-header/entity-header.component";
import {DisplayLabelComponent} from "../common/label/display-label.component";
import {Routes, RouterModule, ActivatedRouteSnapshot} from "@angular/router";

import {ButtonModule, ProgressSpinnerModule, OrganizationChartModule, DragDropModule, ToggleButtonModule} from 'primeng/primeng';
import {DndListModule} from 'ngx-drag-and-drop-lists';
import {DisplayRefComponent} from "../common/tree-table-label/display-ref.component";
import {DisplaySingleCodeComponent} from "../common/tree-table-label/display-singlecode.component";
import {DisplayConstantValueComponent} from "../common/tree-table-label/display-constantvalue.component";
import {DisplayCommentComponent} from "../common/tree-table-label/display-comment.component";
import {DisplayPathComponent} from "../common/constraint/display-path.component";

import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {TreeModule} from 'primeng/tree';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {FieldsetModule} from 'primeng/fieldset';
import {CrossReferenceComponent} from "../common/cross-reference/cross-reference.component";
import {DatatypeListManagerComponent} from "../common/datatype-list-manager/datatype-list-manager.component";
import {TableModule} from "primeng/components/table/table";
import {KeyFilterModule} from 'primeng/keyfilter';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {DisplayMenuComponent} from "../common/display-menu/display-menu.component";
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton";
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {SelectButtonModule} from 'primeng/selectbutton';
import {ScrollPanelModule} from 'primeng/scrollpanel';

import {NameColComponent} from "../common/tree-table/name/name-col.component";
import {UsageColComponent} from "../common/tree-table/usage/usage-col.component";
import {UsageReadonlyColComponent} from "../common/tree-table/usage/usage-readonly-col.component";
import {CardinalityColComponent} from "../common/tree-table/cardinality/cardinality-col.component";
import {CardinalityReadonlyColComponent} from "../common/tree-table/cardinality/cardinality-readonly-col.component";
import {LengthColComponent} from "../common/tree-table/length/length-col.component";
import {LengthReadonlyColComponent} from "../common/tree-table/length/length-readonly-col.component";
import {ConfLengthColComponent} from "../common/tree-table/conflength/conflength-col.component";
import {ConfLengthReadonlyColComponent} from "../common/tree-table/conflength/conflength-readonly-col.component";
import {DatatypeColComponent} from "../common/tree-table/datatype/datatype-col.component";
import {DatatypeReadonlyColComponent} from "../common/tree-table/datatype/datatype-readonly-col.component";
import {ValuesetColComponent} from "../common/tree-table/valueset/valueset-col.component";
import {ValuesetReadonlyColComponent} from "../common/tree-table/valueset/valueset-readonly-col.component";
import {SingleCodeColComponent} from "../common/tree-table/singlecode/singlecode-col.component";
import {SingleCodeReadonlyColComponent} from "../common/tree-table/singlecode/singlecode-readonly-col.component";
import {ConstantValueColComponent} from "../common/tree-table/constantvalue/constantvalue-col.component";
import {ConstantValueReadonlyColComponent} from "../common/tree-table/constantvalue/constantvalue-readonly-col.component";
import {TextdefColComponent} from "../common/tree-table/textdef/textdef-col.component";
import {TextdefReadonlyColComponent} from "../common/tree-table/textdef/textdef-readonly-col.component";
import {CommentColComponent} from "../common/tree-table/comment/comment-col.component";
import {CommentReadonlyColComponent} from "../common/tree-table/comment/comment-readonly-col.component";
import {ElementLabelComponent} from "../common/element-label/element-label.component";
import {DatatypeColService} from "../common/tree-table/datatype/datatype-col.service";
import {SegmentColComponent} from "../common/tree-table/segment/segment-col.component";
import {SegmentColService} from "../common/tree-table/segment/segment-col.service";
import {PredicateColComponent} from "../common/tree-table/predicate/predicate-col.component";

import {CsSegmentTreeComponent} from '../common/cs-segment-tree/cs-segment-tree.component';
import {PatternEditorDemoComponent} from '../common/pattern-editor-demo/pattern-editor-demo.component';
import {PatternDialogComponent} from '../common/pattern-dialog/pattern-dialog.component';
import {NameDeltaColComponent} from '../common/tree-table/name/name-delta-col/name-delta-col.component';
import {CardinalityDeltaColComponent} from '../common/tree-table/cardinality/cardinality-delta-col/cardinality-delta-col.component';
import {DeltaDisplayComponent} from '../common/delta/delta-display/delta-display.component';
import {UsageDeltaColComponent} from '../common/tree-table/usage/usage-delta-col/usage-delta-col.component';
import {ConflengthDeltaColComponent} from '../common/tree-table/conflength/conflength-delta-col/conflength-delta-col.component';
import {LengthDeltaColComponent} from '../common/tree-table/length/length-delta-col/length-delta-col.component';
import {DatatypeDeltaColComponent} from '../common/tree-table/datatype/datatype-delta-col/datatype-delta-col.component';
import {ValuesetDeltaColComponent} from '../common/tree-table/valueset/valueset-delta-col/valueset-delta-col.component';
import {ConformanceProfilesService} from "../igdocuments/igdocument-edit/conformanceprofile-edit/conformance-profiles.service";
import {SlideToggleModule} from 'ngx-slide-toggle';
import {DeltaService} from '../common/delta/service/delta.service';
import {DeltaResolver} from '../common/delta/service/delta.resolver';
import {DeltaHeaderComponent} from '../common/delta/delta-header/delta-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    TreeModule,
    DialogModule,
    PanelModule,
    FieldsetModule,
    RadioButtonModule,
    TableModule,
    ProgressSpinnerModule,
    DragDropModule,
    OrganizationChartModule,
    TreeTableModule,
    KeyFilterModule,
    MessageModule,
    MessagesModule,
    DndListModule,
    SelectButtonModule,
    ScrollPanelModule,
    SlideToggleModule,
    ToggleButtonModule
  ],
  declarations: [
    DisplayBadgeComponent,
    EntityHeaderComponent,
    DisplayMenuComponent,
    DtFlavorPipe,
    DisplayLabelComponent,
    DisplayRefComponent,
    DisplaySingleCodeComponent,
    DisplayConstantValueComponent,
    DisplayCommentComponent,
    EditFreeConstraintComponent,
    EditSimpleConstraintComponent,
    EditSimplePropositionComponent,
    EditSimplePropositionConstraintComponent,
    EditComplexConstraintComponent,
    DisplayPathComponent,
    CrossReferenceComponent,
    DatatypeListManagerComponent,
    NameColComponent,
    UsageColComponent,
    UsageReadonlyColComponent,
    CardinalityColComponent,
    CardinalityReadonlyColComponent,
    LengthColComponent,
    LengthReadonlyColComponent,
    ConfLengthColComponent,
    ConfLengthReadonlyColComponent,
    DatatypeColComponent,
    DatatypeReadonlyColComponent,
    SegmentColComponent,
    ValuesetColComponent,
    ValuesetReadonlyColComponent,
    SingleCodeColComponent,
    SingleCodeReadonlyColComponent,
    ConstantValueColComponent,
    ConstantValueReadonlyColComponent,
    TextdefColComponent,
    TextdefReadonlyColComponent,
    CommentColComponent,
    CommentReadonlyColComponent,
    CsSegmentTreeComponent,
    PatternEditorDemoComponent,
    PatternDialogComponent,
    CommentReadonlyColComponent,
    ElementLabelComponent,
    DeltaDisplayComponent,
    NameDeltaColComponent,
    CardinalityDeltaColComponent,
    UsageDeltaColComponent,
    ConflengthDeltaColComponent,
    LengthDeltaColComponent,
    DatatypeDeltaColComponent,
    ValuesetDeltaColComponent,
    PredicateColComponent,
    DeltaHeaderComponent
  ],

  exports: [
    DisplayBadgeComponent,
    EntityHeaderComponent,
    DtFlavorPipe,
    DisplayLabelComponent,
    DisplayRefComponent,
    DisplaySingleCodeComponent,
    DisplayConstantValueComponent,
    DisplayCommentComponent,
    EditFreeConstraintComponent,
    EditSimpleConstraintComponent,
    EditSimplePropositionComponent,
    EditSimplePropositionConstraintComponent,
    EditComplexConstraintComponent,
    DisplayPathComponent,
    CrossReferenceComponent,
    DatatypeListManagerComponent,
    DisplayMenuComponent,
    NameColComponent,
    UsageColComponent,
    UsageReadonlyColComponent,
    CardinalityColComponent,
    CardinalityReadonlyColComponent,
    LengthColComponent,
    LengthReadonlyColComponent,
    ConfLengthColComponent,
    ConfLengthReadonlyColComponent,
    DatatypeColComponent,
    DatatypeReadonlyColComponent,
    SegmentColComponent,
    ValuesetColComponent,
    ValuesetReadonlyColComponent,
    SingleCodeColComponent,
    SingleCodeReadonlyColComponent,
    ConstantValueColComponent,
    ConstantValueReadonlyColComponent,
    TextdefColComponent,
    TextdefReadonlyColComponent,
    CommentColComponent,
    CommentReadonlyColComponent,
    CsSegmentTreeComponent,
    PatternEditorDemoComponent,
    PatternDialogComponent,
    ElementLabelComponent,
    DeltaDisplayComponent,
    NameDeltaColComponent,
    CardinalityDeltaColComponent,
    UsageDeltaColComponent,
    ConflengthDeltaColComponent,
    LengthDeltaColComponent,
    DatatypeDeltaColComponent,
    ValuesetDeltaColComponent,
    PredicateColComponent
  ],
  providers: [DatatypeColService, SegmentColService, ConformanceProfilesService,
    PredicateColComponent, DeltaService, DeltaResolver,
    DeltaHeaderComponent
  ]

})
export class UtilsModule {}
