import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatypeEvolutionComponent } from './datatype-evolution.component';
import {DatatypeEvolutionRoutingModule} from "./datatype-evolution-routing.module";
import {DatatypeEvolutionResolver} from "./datatype-evolution.resolver";
import {DatatypeEvolutionService} from "./datatype-evolution.service";
import {TableModule} from 'primeng/table';

import {TreeTableModule} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    DatatypeEvolutionRoutingModule,
    TableModule,TreeTableModule

  ],
  declarations: [DatatypeEvolutionComponent],
  providers:[DatatypeEvolutionService,DatatypeEvolutionResolver]

})
export class DatatypeEvolutionModule { }
