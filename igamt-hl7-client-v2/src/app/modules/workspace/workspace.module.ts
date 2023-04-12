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
import { AddUserDialogComponent } from './components/add-user-dialog/add-user-dialog.component';
import { CreateWorkspaceComponent } from './components/create-workspace/create-workspace.component';
import { DeleteWorkspaceDialogComponent } from './components/delete-workspace-dialog/delete-workspace-dialog.component';
import { DocumentMoveDialogComponent } from './components/document-move-dialog/document-move-dialog.component';
import { FolderAddDialogComponent } from './components/folder-add-dialog/folder-add-dialog.component';
import { PermissionSelectorComponent } from './components/permission-selector/permission-selector.component';
import { WorkspaceActiveTitlebarComponent } from './components/workspace-active-titlebar/workspace-active-titlebar.component';
import { WorkspaceEditComponent } from './components/workspace-edit/workspace-edit.component';
import { WorkspaceFolderEditorComponent } from './components/workspace-folder-editor/workspace-folder-editor.component';
import { WorkspaceHomeEditorComponent } from './components/workspace-home-editor/workspace-home-editor.component';
import { WorkspaceListCardComponent } from './components/workspace-list-card/workspace-list-card.component';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceMetadataEditorComponent } from './components/workspace-metadata-editor/workspace-metadata-editor.component';
import { WorkspaceSideBarComponent } from './components/workspace-side-bar/workspace-side-bar.component';
import { PermsPipe, WorkspaceUserManagementComponent } from './components/workspace-user-management/workspace-user-management.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';

@NgModule({
  declarations: [
    CreateWorkspaceComponent,
    WorkspaceListComponent,
    WorkspaceEditComponent,
    WorkspaceListCardComponent,
    WorkspaceSideBarComponent,
    WorkspaceHomeEditorComponent,
    WorkspaceActiveTitlebarComponent,
    FolderAddDialogComponent,
    WorkspaceMetadataEditorComponent,
    WorkspaceFolderEditorComponent,
    WorkspaceUserManagementComponent,
    AddUserDialogComponent,
    PermissionSelectorComponent,
    PermsPipe,
    DocumentMoveDialogComponent,
    DeleteWorkspaceDialogComponent,
  ],
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
    FolderAddDialogComponent,
    AddUserDialogComponent,
    DocumentMoveDialogComponent,
    WorkspaceEditComponent,
    DeleteWorkspaceDialogComponent,
  ],
  providers: [],
  exports: [],
})
export class WorkspaceModule { }
