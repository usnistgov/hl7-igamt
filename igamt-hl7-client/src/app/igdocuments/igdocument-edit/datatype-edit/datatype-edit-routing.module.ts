/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {DatatypeEditStructureComponent} from "./datatype-structure/datatype-edit-structure.component";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':datatypeId', component: DatatypeEditStructureComponent,
        },
        {
            path: ':datatypeId/structure', component: DatatypeEditStructureComponent,
        }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DatatypeEditRoutingModule {}
