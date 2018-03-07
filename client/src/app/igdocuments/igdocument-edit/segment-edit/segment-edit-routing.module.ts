/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {SegmentEditComponent} from "./segment-edit.component";
import {SegmentGuard} from "./segment-edit.guard";
import {CanDeactivateGuard} from "./segment-can-desactivate.service";
import {AuthGuard} from "./../../../login/auth-guard.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: SegmentEditComponent,
        canActivate : [ SegmentGuard],
        canDeactivate: [CanDeactivateGuard],

        children: [
          {
            path: 'definition',
            loadChildren: './segment-definition/segment-definition.module#SegmentDefinitionModule'
          },
          {
            path: 'metadata',
            loadChildren: './segment-metadata/segment-metadata.module#SegmentMetadataModule'
          }
        ]
      }

    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SegmentEditRoutingModule {}
