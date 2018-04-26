/**
 * Created by ena3 on 12/5/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {DatatypeEditComponent} from "./datatype-edit.component";
import {DatatypeGuard} from "./datatype-edit.guard";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: DatatypeEditComponent,
        canActivate : [ DatatypeGuard ],
        children: [
          {
            path: 'definition',
            loadChildren: './datatype-definition/datatype-definition.module#DatatypeDefinitionModule'
          }
        ]
      }

    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DatatypeEditRoutingModule {}
