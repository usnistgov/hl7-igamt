import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {RadioButtonModule} from 'primeng/primeng';
import {StepsModule} from 'primeng/steps';
import {TableModule} from 'primeng/table';
import { IgListEffects } from 'src/app/root-store/ig/ig-list/ig-list.effects';
import {CreateIgEffects} from '../../root-store/create-ig/create-ig.effects';
import * as fromIg from '../../root-store/ig/ig.reducer';
import { IgEditEffects } from './../../root-store/ig/ig-edit/ig-edit.effects';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { CreateIGComponent } from './components/create-ig/create-ig.component';
import { IgEditContainerComponent } from './components/ig-edit-container/ig-edit-container.component';
import { IgEditSidebarComponent } from './components/ig-edit-sidebar/ig-edit-sidebar.component';
import { IgEditTitlebarComponent } from './components/ig-edit-titlebar/ig-edit-titlebar.component';
import { IgEditToolbarComponent } from './components/ig-edit-toolbar/ig-edit-toolbar.component';
import { IgListContainerComponent } from './components/ig-list-container/ig-list-container.component';
import { IgListItemCardComponent } from './components/ig-list-item-card/ig-list-item-card.component';
import { IgRoutingModule } from './ig-routing.module';
import { IgEditResolverService } from './services/ig-edit-resolver.service';
import { IgListService } from './services/ig-list.service';
import { IgService } from './services/ig.service';

@NgModule({
  declarations: [
    IgListContainerComponent,
    IgListItemCardComponent,
    IgEditContainerComponent,
    IgEditSidebarComponent,
    IgEditToolbarComponent,
    IgEditTitlebarComponent,
    CreateIGComponent,
  ],  imports: [
    IgRoutingModule,
    EffectsModule.forFeature([IgListEffects, CreateIgEffects, IgEditEffects]),
    StoreModule.forFeature(fromIg.featureName, fromIg.reducers),
    CoreModule,
    SharedModule,
    StepsModule,
    RadioButtonModule,
    TableModule,
  ],
  providers: [
    IgListService,
    IgService,
    IgEditResolverService,
  ],
  exports: [
    IgListContainerComponent,
    IgListItemCardComponent,
    IgEditContainerComponent,
    IgEditSidebarComponent,
    IgEditToolbarComponent,
    IgEditTitlebarComponent,
  ],
})
export class IgModule { }
