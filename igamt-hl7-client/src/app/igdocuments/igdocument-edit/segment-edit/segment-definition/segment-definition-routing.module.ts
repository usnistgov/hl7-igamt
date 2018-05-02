import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {CoConstraintTableComponent} from "./coconstraint-table/coconstraint-table.component";
import {SegmentStructureComponent} from "./segment-structure/segment-structure.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: SegmentStructureComponent
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class SegmentDefinitionRouting {}
