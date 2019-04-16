/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {ValuesetEditStructureComponent} from "./valueset-structure/valueset-edit-structure.component";
import {ValuesetEditMetadataComponent} from "./valueset-metadata/valueset-edit-metadata.component";
import {ValuesetEditPredefComponent} from "./valueset-predef/valueset-edit-predef.component";
import {ValuesetEditPostdefComponent} from "./valueset-postdef/valueset-edit-postdef.component";
import {ValuesetCrossRefComponent} from "./valueset-cross-ref/valueset-cross-ref.component";
import {ValuesetCrossRefResolver} from "./valueset-cross-ref/valueset-cross-ref.resolver";
import {SaveFormsGuard} from "../../../guards/save.guard";
import {ValuesetEditMetadataResolver} from "./valueset-metadata/valueset-edit-metadata.resolver";
import {ValuesetEditPostdefResolver} from "./valueset-postdef/valueset-edit-postdef.resolver";
import {ValuesetEditPredefResolver} from "./valueset-predef/valueset-edit-predef.resolver";
import {ValuesetEditStructureResolver} from "./valueset-structure/valueset-edit-structure.resolver";


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: ':valuesetId',
                component: ValuesetEditStructureComponent,
                canDeactivate: [SaveFormsGuard],
                resolve: {valuesetStructure: ValuesetEditStructureResolver}
            },
            {
                path: ':valuesetId/structure',
                component: ValuesetEditStructureComponent,
                canDeactivate: [SaveFormsGuard],
                resolve: {valuesetStructure: ValuesetEditStructureResolver}
            },
            {
                path: ':valuesetId/metadata',
                component: ValuesetEditMetadataComponent,
                canDeactivate: [SaveFormsGuard],
                resolve: {valuesetMetadata: ValuesetEditMetadataResolver}
            },
            {
                path: ':valuesetId/preDef',
                component: ValuesetEditPredefComponent,
                canDeactivate: [SaveFormsGuard],
                resolve: {valuesetPredef: ValuesetEditPredefResolver}
            },
            {
                path: ':valuesetId/postDef',
                component: ValuesetEditPostdefComponent,
                canDeactivate: [SaveFormsGuard],
                resolve: {valuesetPostdef: ValuesetEditPostdefResolver}
            },
            {
                path: ':valuesetId/crossRef', component: ValuesetCrossRefComponent,resolve: { refs : ValuesetCrossRefResolver}
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ValuesetEditRoutingModule {}
