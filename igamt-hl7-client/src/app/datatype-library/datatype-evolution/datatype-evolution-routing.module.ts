import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {DatatypeEvolutionComponent} from "./datatype-evolution.component";
import {DatatypeEvolutionResolver} from "./datatype-evolution.resolver";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: DatatypeEvolutionComponent,
        resolve:{
          matrix: DatatypeEvolutionResolver
        }


			}
		])
	],
	exports: [
		RouterModule
	]
})
export class IgDocumentListRoutingModule {}
