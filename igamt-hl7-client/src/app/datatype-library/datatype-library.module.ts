import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatatypeLibraryComponent} from './datatype-library.component';
import {DatatypeLibraryRoutingModule} from './datatype-library-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';

@NgModule({
	imports: [
		CommonModule,
		DatatypeLibraryRoutingModule,
        AccordionModule,
        ButtonModule,
        TabViewModule,
        GrowlModule
	],
	declarations: [
		DatatypeLibraryComponent
	]
})
export class DatatypeLibraryModule {}
