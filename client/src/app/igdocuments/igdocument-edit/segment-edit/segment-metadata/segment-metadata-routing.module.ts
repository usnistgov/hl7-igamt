import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {SegmentMetadataComponent} from "./segment-metadata.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: SegmentMetadataComponent
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class SegmentMetaDataRouting {}
