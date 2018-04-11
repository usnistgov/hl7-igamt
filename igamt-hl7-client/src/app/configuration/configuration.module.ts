import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Configuration} from './configuration';
import {ConfigurationRoutingModule} from './configuration-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    AccordionModule,
    ButtonModule,
    TabViewModule,
    GrowlModule
  ],
  declarations: [
    Configuration
  ]
})
export class ConfigurationModule {}
