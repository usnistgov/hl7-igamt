import { WORKSPACE_EDIT_WIDGET_ID } from 'src/app/modules/workspace/components/workspace-edit/workspace-edit.component';
import { WorkspaceEditResolverLoad, WorkspaceEditActionTypes, OpenWorkspaceMetadataEditorNode } from './../../root-store/workspace/workspace-edit/workspace-edit.actions';
import { WorkspaceMetadataComponent } from './components/workspace-edit/workspace-metadata/workspace-metadata.component';
import { Type } from './../shared/constants/type.enum';
import { EditorID } from './../shared/models/editor.enum';
import { IG_EDIT_WIDGET_ID } from './../ig/components/ig-edit-container/ig-edit-container.component';
import { EditorActivateGuard } from './../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from './../dam-framework/guards/editor-deactivate.guard';
import { WidgetDeactivateGuard } from './../dam-framework/guards/widget-deactivate.guard';
import { DataLoaderGuard } from './../dam-framework/guards/data-loader.guard';
import { WidgetSetupGuard } from './../dam-framework/guards/widget-setup.guard';
import { WorkspaceEditComponent } from './components/workspace-edit/workspace-edit.component';
import { DamWidgetContainerComponent } from './../dam-framework/components/data-widget/dam-widget-container/dam-widget-container.component';
import { CreateWorkspaceComponent } from './components/create-workspace/create-workspace.component';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { AuthenticatedGuard } from './../dam-framework/guards/auth-guard.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';

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
      // {
      //   path: '',
      //   redirectTo: 'metadata',
      //   pathMatch: 'full',
      // },
      {
        path: 'metadata',
        component: WorkspaceMetadataComponent,
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
          action: OpenWorkspaceMetadataEditorNode,
          idKey: 'workspaceId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      // {
      //   path: 'folder/:folderId',
      //   component: WorkspaceFolderEditorComponent,
      //   canActivate: [EditorActivateGuard],
      //   data: {
      //     editorMetadata: {
      //       id: EditorID.SECTION_NARRATIVE,
      //       resourceType: Type.TEXT,
      //     },
      //     onLeave: {
      //       saveEditor: true,
      //       saveTableOfContent: true,
      //     },
      //     action: OpenFolderEditorNode,
      //     idKey: 'folderId',
      //   },
      //   canDeactivate: [EditorDeactivateGuard],
      // },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
