/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
// import {ValuesetEditStructureComponent} from "./valueset-structure/valueset-edit-structure.component";
import {ValuesetEditMetadataComponent} from "./valueset-metadata/valueset-edit-metadata.component";
import {ValuesetEditPredefComponent} from "./valueset-predef/valueset-edit-predef.component";
import {ValuesetEditPostdefComponent} from "./valueset-postdef/valueset-edit-postdef.component";
// import {ValuesetCrossRefComponent} from "./valueset-cross-ref/valueset-cross-ref.component";
// import {ValuesetCrossRefResolver} from "./valueset-cross-ref/valueset-cross-ref.resolver";

@NgModule({
    imports: [
        RouterModule.forChild([
            // {
            //     path: ':valuesetId', component: ValuesetEditStructureComponent,
            // },
            // {
            //     path: ':valuesetId/structure', component: ValuesetEditStructureComponent,
            // },
            {
                path: ':valuesetId/metadata', component: ValuesetEditMetadataComponent,
            },
            {
                path: ':valuesetId/preDef', component: ValuesetEditPredefComponent,
            },
            {
                path: ':valuesetId/postDef', component: ValuesetEditPostdefComponent,
            }
            // ,
            // {
            //     path: ':valuesetId/crossRef', component: ValuesetCrossRefComponent,resolve: { refs : ValuesetCrossRefResolver}
            // }

        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ValuesetEditRoutingModule {}
