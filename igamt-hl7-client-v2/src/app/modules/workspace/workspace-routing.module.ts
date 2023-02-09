import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WORKSPACE_EDIT_WIDGET_ID } from 'src/app/modules/workspace/components/workspace-edit/workspace-edit.component';
import { OpenWorkspaceFolderEditor, OpenWorkspaceHomeEditor } from '../../root-store/workspace/workspace-edit/workspace-edit.actions';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';
import { OpenWorkspaceAccessManagementEditor, OpenWorkspaceMetadataEditor, WorkspaceEditActionTypes, WorkspaceEditResolverLoad } from './../../root-store/workspace/workspace-edit/workspace-edit.actions';
import { DamWidgetContainerComponent } from './../dam-framework/components/data-widget/dam-widget-container/dam-widget-container.component';
import { AuthenticatedGuard } from './../dam-framework/guards/auth-guard.guard';
import { DataLoaderGuard } from './../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from './../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from './../dam-framework/guards/editor-deactivate.guard';
import { WidgetDeactivateGuard } from './../dam-framework/guards/widget-deactivate.guard';
import { WidgetSetupGuard } from './../dam-framework/guards/widget-setup.guard';
import { Type } from './../shared/constants/type.enum';
import { EditorID } from './../shared/models/editor.enum';
import { CreateWorkspaceComponent } from './components/create-workspace/create-workspace.component';
import { WorkspaceEditComponent } from './components/workspace-edit/workspace-edit.component';
import { WorkspaceFolderEditorComponent } from './components/workspace-folder-editor/workspace-folder-editor.component';
import { WorkspaceHomeEditorComponent } from './components/workspace-home-editor/workspace-home-editor.component';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceMetadataEditorComponent } from './components/workspace-metadata-editor/workspace-metadata-editor.component';
import { WorkspaceUserManagementComponent } from './components/workspace-user-management/workspace-user-management.component';

const routes: Routes = [
  {
    path: 'list',
    component: WorkspaceListComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'create',
    component: CreateWorkspaceComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    data: {
      widgetId: WORKSPACE_EDIT_WIDGET_ID,
      routeParam: 'workspaceId',
      loadAction: WorkspaceEditResolverLoad,
      successAction: WorkspaceEditActionTypes.WorkspaceEditResolverLoadSuccess,
      failureAction: WorkspaceEditActionTypes.WorkspaceEditResolverLoadFailure,
      redirectTo: ['workspace', 'error'],
      component: WorkspaceEditComponent,
    },
    component: DamWidgetContainerComponent,
    canActivate: [
      WidgetSetupGuard,
      DataLoaderGuard,
    ],
    canDeactivate: [
      WidgetDeactivateGuard,
    ],
    path: ':workspaceId',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: WorkspaceHomeEditorComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.WORKSPACE_HOME,
            title: 'Home',
            resourceType: Type.WORKSPACE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenWorkspaceHomeEditor,
          idKey: 'workspaceId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'metadata',
        component: WorkspaceMetadataEditorComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.WORKSPACE_METADTATA,
            title: 'Metadata',
            resourceType: Type.WORKSPACE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenWorkspaceMetadataEditor,
          idKey: 'workspaceId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'users',
        component: WorkspaceUserManagementComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.WORKSPACE_USERS,
            title: 'Manage Access',
            resourceType: Type.WORKSPACE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenWorkspaceAccessManagementEditor,
          idKey: 'workspaceId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'folder/:folderId',
        component: WorkspaceFolderEditorComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.WORKSPACE_FOLDER,
            resourceType: Type.FOLDER,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenWorkspaceFolderEditor,
          idKey: 'folderId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule { }
