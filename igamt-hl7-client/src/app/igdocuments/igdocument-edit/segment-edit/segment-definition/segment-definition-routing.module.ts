import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {SegmentDefinitionComponent} from "./segment-definition.component";
import {CoConstraintTableComponent} from "./coconstraint-table/coconstraint-table.component";
import {SegmentStructureComponent} from "./segment-structure/segment-structure.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: SegmentDefinitionComponent,
				children: [
          { path: 'coconstraints', component : CoConstraintTableComponent },
          { path: 'structure', component : SegmentStructureComponent },
				]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class SegmentDefinitionRouting {}
