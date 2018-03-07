/**
 * Created by ena3 on 12/29/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {IgDocumentCreateComponent} from "./igdocument-create.component";
import {AuthGuard} from "../../login/auth-guard.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate : [ AuthGuard],

        component: IgDocumentCreateComponent,
        children: [

        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class IgDocumentCreateRoutingModule {}
