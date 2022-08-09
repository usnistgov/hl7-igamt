import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WorkspaceListEffects } from 'src/app/root-store/workspace/workspace-list/workspace-list.effects';
import * as fromWorkspace from '../../root-store/workspace/workspace.reducer';
import { WorkspaceEditEffects } from './../../root-store/workspace/workspace-edit/workspace-edit.effects';
import { CoreModule } from './../core/core.module';
import { DamFrameworkModule } from './../dam-framework/dam-framework.module';
import { SharedModule } from './../shared/shared.module';
import { CreateWorkspaceComponent } from './components/create-workspace/create-workspace.component';
import { FolderAddDialogComponent } from './components/folder-add-dialog/folder-add-dialog.component';
import { WorkspaceActiveTitlebarComponent } from './components/workspace-active-titlebar/workspace-active-titlebar.component';
import { WorkspaceEditComponent } from './components/workspace-edit/workspace-edit.component';
import { WorkspaceFolderEditorComponent } from './components/workspace-folder-editor/workspace-folder-editor.component';
import { WorkspaceHomeEditorComponent } from './components/workspace-home-editor/workspace-home-editor.component';
import { WorkspaceListCardComponent } from './components/workspace-list-card/workspace-list-card.component';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceMetadataEditorComponent } from './components/workspace-metadata-editor/workspace-metadata-editor.component';
import { WorkspaceSideBarComponent } from './components/workspace-side-bar/workspace-side-bar.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';

@NgModule({
  declarations: [CreateWorkspaceComponent, WorkspaceListComponent, WorkspaceEditComponent, WorkspaceListCardComponent, WorkspaceSideBarComponent, WorkspaceHomeEditorComponent, WorkspaceActiveTitlebarComponent, FolderAddDialogComponent, WorkspaceMetadataEditorComponent, WorkspaceFolderEditorComponent],
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
    FolderAddDialogComponent],
  providers: [],
})
export class WorkspaceModule { }
