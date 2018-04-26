import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search.component';
import {SearchRoutingModule} from './search-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';

@NgModule({
	imports: [
		CommonModule,
		SearchRoutingModule,
        AccordionModule,
        ButtonModule,
        TabViewModule,
        GrowlModule
	],
	declarations: [
    SearchComponent
	]
})
export class SearchModule {}
