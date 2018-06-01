import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedElementsComponent} from './shared-elements.component';
import {SharedElementsRoutingModule} from './shared-elements-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';

@NgModule({
	imports: [
		CommonModule,
		SharedElementsRoutingModule,
        AccordionModule,
        ButtonModule,
        TabViewModule,
        GrowlModule
	],
	declarations: [
		SharedElementsComponent
	]
})
export class SharedElementsModule {}
