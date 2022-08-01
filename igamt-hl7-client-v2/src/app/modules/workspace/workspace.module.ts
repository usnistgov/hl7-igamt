import { DamWidgetComponent } from 'src/app/modules/dam-framework';
import { WorkspaceEditEffects } from './../../root-store/workspace/workspace-edit/workspace-edit.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { DamFrameworkModule } from './../dam-framework/dam-framework.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { CreateWorkspaceComponent } from './components/create-workspace/create-workspace.component';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceEditComponent } from './components/workspace-edit/workspace-edit.component';
import { WorkspaceListEffects } from 'src/app/root-store/workspace/workspace-list/workspace-list.effects';
import * as fromWorkspace from '../../root-store/workspace/workspace.reducer';
import { WorkspaceListCardComponent } from './components/workspace-list-card/workspace-list-card.component';
import { WorkspaceEditTitleBarComponent } from './components/workspace-edit/workspace-edit-title-bar/workspace-edit-title-bar.component';
import { WorkspaceMetadataComponent } from './components/workspace-edit/workspace-metadata/workspace-metadata.component';

@NgModule({
  declarations: [CreateWorkspaceComponent, WorkspaceListComponent, WorkspaceEditComponent, WorkspaceListCardComponent, WorkspaceEditTitleBarComponent, WorkspaceMetadataComponent],
  imports: [
    CommonModule,
    DamFrameworkModule.forRoot(),
    SharedModule,
    WorkspaceRoutingModule,
    CoreModule,
    EffectsModule.forFeature([WorkspaceListEffects, WorkspaceEditEffects]),
    StoreModule.forFeature(fromWorkspace.featureName, fromWorkspace.reducers),
    CoreModule,
    SharedModule,

  ],
  entryComponents: [
  ],
  providers: [],
})
export class WorkspaceModule { }
