/**
 * Created by hnt5 on 10/30/17.
 */
import {NgModule}     from '@angular/core';

import {FormsModule} from '@angular/forms';
import {DisplayBadgeComponent} from "../common/badge/display-badge.component";
import {EditFreeConstraintComponent} from "../common/constraint/edit-freeconstraint.component";
import {EditSimpleConstraintComponent} from "../common/constraint/edit-simpleconstraint.component";
import {EditSimpleMessageConstraintComponent} from "../common/message-constraint/edit-simplemessageconstraint.component";
import {EditComplexConstraintComponent} from "../common/constraint/edit-complexconstraint.component";
import {EditAndOrConstraintComponent} from "../common/constraint/edit-andorconstraint.component";
import {EditNotConstraintComponent} from "../common/constraint/edit-notconstraint.component";
import {EditIfThenConstraintComponent} from "../common/constraint/edit-ifthenconstraint.component";

import {DtFlavorPipe} from "../igdocuments/igdocument-edit/segment-edit/coconstraint-table/datatype-name.pipe";
import {CommonModule} from "@angular/common";
import {EntityHeaderComponent} from "../common/entity-header/entity-header.component";
import {DisplayLabelComponent} from "../common/label/display-label.component";
import {Routes, RouterModule, ActivatedRouteSnapshot} from "@angular/router";

import {ButtonModule} from 'primeng/primeng';
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
    FieldsetModule
  ],
  declarations: [
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
    EditSimpleMessageConstraintComponent,
    EditComplexConstraintComponent,
    DisplayPathComponent,
    EditAndOrConstraintComponent,
    EditNotConstraintComponent,
    EditIfThenConstraintComponent,
    CrossReferenceComponent

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
    EditSimpleMessageConstraintComponent,
    EditComplexConstraintComponent,
    DisplayPathComponent,
    EditAndOrConstraintComponent,
    EditNotConstraintComponent,
    EditIfThenConstraintComponent,
    CrossReferenceComponent
  ]
})
export class UtilsModule {}
