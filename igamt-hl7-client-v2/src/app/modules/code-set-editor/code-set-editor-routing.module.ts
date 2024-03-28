import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeSetEditActionTypes, CodeSetEditResolverLoad, OpenCodeSetDashboardEditor, OpenCodeSetVersionEditor } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.actions';
import { ErrorPageComponent } from './../core/components/error-page/error-page.component';
import { DamWidgetContainerComponent } from './../dam-framework/components/data-widget/dam-widget-container/dam-widget-container.component';
import { AuthenticatedGuard } from './../dam-framework/guards/auth-guard.guard';
import { DataLoaderGuard } from './../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from './../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from './../dam-framework/guards/editor-deactivate.guard';
import { WidgetDeactivateGuard } from './../dam-framework/guards/widget-deactivate.guard';
import { WidgetSetupGuard } from './../dam-framework/guards/widget-setup.guard';
import { Type } from './../shared/constants/type.enum';
import { EditorID } from './../shared/models/editor.enum';
import { CodeSetDashBoardComponent } from './components/code-set-dash-board/code-set-dash-board.component';
import { CodeSetEditorCreateComponent } from './components/code-set-editor-create/code-set-editor-create.component';
import { CodeSetEditorListComponent } from './components/code-set-editor-list/code-set-editor-list.component';
import { CODE_SET_EDIT_WIDGET_ID, CodeSetEditorComponent } from './components/code-set-editor/code-set-editor.component';
import { CodeSetVersionEditorComponent } from './components/code-set-version-editor/code-set-version-editor.component';

const routes: Routes = [
  {
    path: 'list',
    component: CodeSetEditorListComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'create',
    component: CodeSetEditorCreateComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  }
  ,
  {
    data: {
      widgetId: CODE_SET_EDIT_WIDGET_ID,
      routeParam: 'codeSetId',
      loadAction: CodeSetEditResolverLoad,
      successAction: CodeSetEditActionTypes.CodeSetEditResolverLoadSuccess,
      failureAction: CodeSetEditActionTypes.CodeSetEditResolverLoadFailure,
      redirectTo: ['code-set', 'error'],
      component: CodeSetEditorComponent,
    },
    component: DamWidgetContainerComponent,
    canActivate: [
      WidgetSetupGuard,
      DataLoaderGuard,
    ],
    canDeactivate: [
      WidgetDeactivateGuard,
    ],
    path: ':codeSetId',
    children: [
      {
        path: 'dashboard',
        component: CodeSetDashBoardComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CODE_SET_DASHBOARD,
            title: 'Code Set Dashboard',
            resourceType: Type.CODESET,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenCodeSetDashboardEditor,
          idKey: 'codeSetId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'code-set-version/:versionId',
        component: CodeSetVersionEditorComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CODE_SET_VERSION,
            resourceType: Type.CODESETVERSION,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenCodeSetVersionEditor,
          idKey: 'versionId',
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
export class CodeSetRoutingModule { }
