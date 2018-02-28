/**
 * Created by hnt5 on 10/30/17.
 */
import {NgModule}     from '@angular/core';
import {DisplayBadgeComponent} from "../common/badge/display-badge.component";
import {DtFlavorPipe} from "../igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/datatype-name.pipe";
import {CommonModule} from "@angular/common";
import {EntityHeaderComponent} from "../common/entity-header/entity-header.component";
import {DisplayLabelComponent} from "../common/label/display-label.component";
import {Routes, RouterModule, ActivatedRouteSnapshot} from "@angular/router";

import {ButtonModule} from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule
  ],
  declarations: [ DisplayBadgeComponent, EntityHeaderComponent, DtFlavorPipe, DisplayLabelComponent ],
  exports: [ DisplayBadgeComponent, EntityHeaderComponent, DtFlavorPipe, DisplayLabelComponent]
})
export class UtilsModule {}
