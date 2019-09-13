import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadConformanceProfile, OpenConformanceProfileDeltaEditor, OpenConformanceProfilePreDefEditor } from 'src/app/root-store/conformance-profile-edit/conformance-profile-edit.actions';
import { ConformanceProfileEditActionTypes, OpenConformanceProfilePostDefEditor, OpenConformanceProfileStructureEditor, OpenCPConformanceStatementEditor } from '../../root-store/conformance-profile-edit/conformance-profile-edit.actions';
import { DataLoaderResolverService } from '../ig/services/data-loader-resolver.service';
import { IgEditorActivateGuard } from '../ig/services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from '../ig/services/ig-editor-deactivate.service';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { ConformanceProfileStructureEditorComponent } from './components/conformance-profile-structure-editor/conformance-profile-structure-editor.component';
import { CPConformanceStatementEditorComponent } from './components/conformance-statement-editor/cp-conformance-statement-editor.component';
import { DeltaEditorComponent } from './components/delta-editor/delta-editor.component';
import { PostdefEditorComponent } from './components/postdef-editor/postdef-editor.component';
import { PredefEditorComponent } from './components/predef-editor/predef-editor.component';

const routes: Routes = [
  {
    path: ':conformanceProfileId',
    data: {
      routeParam: 'conformanceProfileId',
      loadAction: LoadConformanceProfile,
      successAction: ConformanceProfileEditActionTypes.LoadConformanceProfileSuccess,
      failureAction: ConformanceProfileEditActionTypes.LoadConformanceProfileFailure,
      redirectTo: ['ig', 'error'],
    },
    canActivate: [DataLoaderResolverService],
    children: [
      {
        path: '',
        redirectTo: 'structure',
        pathMatch: 'full',
      },
      {
        path: 'conformance-statement',
        component: CPConformanceStatementEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CP_CS,
            title: 'Conformance Statements',
            resourceType: Type.CONFORMANCEPROFILE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenCPConformanceStatementEditor,
          idKey: 'conformanceProfileId',
        },
      },
      {
        path: 'pre-def',
        component: PredefEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.PREDEF,
            title: 'Pre-definition',
            resourceType: Type.CONFORMANCEPROFILE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenConformanceProfilePreDefEditor,
          idKey: 'conformanceProfileId',
        },
      },
      {
        path: 'structure',
        children: [
          {
            path: '',
            component: ConformanceProfileStructureEditorComponent,
            canActivate: [IgEditorActivateGuard],
            canDeactivate: [IgEditSaveDeactivateGuard],
            data: {
              editorMetadata: {
                id: EditorID.CONFP_STRUCTURE,
                title: 'Structure',
                resourceType: Type.CONFORMANCEPROFILE,
              },
              onLeave: {
                saveEditor: true,
                saveTableOfContent: true,
              },
              action: OpenConformanceProfileStructureEditor,
              idKey: 'conformanceProfileId',
            },
          },
          {
            path: 'delta',
            component: DeltaEditorComponent,
            canActivate: [IgEditorActivateGuard],
            canDeactivate: [IgEditSaveDeactivateGuard],
            data: {
              editorMetadata: {
                id: EditorID.CONFP_DELTA,
                title: 'Delta',
                resourceType: Type.CONFORMANCEPROFILE,
              },
              onLeave: {
                saveEditor: true,
                saveTableOfContent: true,
              },
              action: OpenConformanceProfileDeltaEditor,
              idKey: 'conformanceProfileId',
            },
          },
        ],
      },
      {
        path: 'post-def',
        component: PostdefEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.POSTDEF,
            title: 'Post-definition',
            resourceType: Type.CONFORMANCEPROFILE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenConformanceProfilePostDefEditor,
          idKey: 'conformanceProfileId',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConformanceProfileRoutingModule { }
