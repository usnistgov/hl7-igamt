import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeltaComponent} from './delta.component';
import {DeltaRoutingModule} from './delta-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';

@NgModule({
	imports: [
		CommonModule,
		DeltaRoutingModule,
        AccordionModule,
        ButtonModule,
        TabViewModule,
        GrowlModule
	],
	declarations: [
    DeltaComponent
	]
})
export class DeltaModule {}
