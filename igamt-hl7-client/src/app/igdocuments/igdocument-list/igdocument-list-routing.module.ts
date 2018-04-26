import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {IgDocumentListComponent} from './igdocument-list.component';
import {MyIgsComponent} from './my-igs/my-igs.component';
import {PreloadedIgsComponent} from './preloaded-igs/preloaded-igs.component';
import {SharedIgsComponent} from './shared-igs/shared-igs.component';
import {AllIgsComponent} from './all-igs/all-igs.component';
import {MyIGsresolver} from "./my-igs/my-igs.resolver";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: IgDocumentListComponent,
				children: [
					{
						path: '',
						children: [
							{ path: 'my-igs', component: MyIgsComponent,

                resolve:{
						        myIgs: MyIGsresolver
                  }
							},
							{ path: 'preloaded-igs', component: PreloadedIgsComponent },
							{ path: 'shared-igs', component: SharedIgsComponent },
							{ path: 'all-igs', component: AllIgsComponent },
							{ path: '', component: MyIgsComponent }
						]
					}
				]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class IgDocumentListRoutingModule {}
