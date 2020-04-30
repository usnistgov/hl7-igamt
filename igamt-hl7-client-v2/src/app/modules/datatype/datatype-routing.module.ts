import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DatatypeEditActionTypes,
  LoadDatatype,
  OpenDatatypeCrossRefEditor,
  OpenDatatypeMetadataEditorNode,
  OpenDatatypePostDefEditor,
  OpenDatatypePreDefEditor,
  OpenDatatypeStructureEditor,
} from '../../root-store/datatype-edit/datatype-edit.actions';
import { OpenDatatypeConformanceStatementEditor, OpenDatatypeDeltaEditor } from '../../root-store/datatype-edit/datatype-edit.actions';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { DatatypeConformanceStatementEditorComponent } from './components/conformance-statement-editor/datatype-conformance-statement-editor.component';
import { DatatypeCrossRefsComponent } from './components/datatype-cross-refs/datatype-cross-refs.component';
import { DatatypeStructureEditorComponent } from './components/datatype-structure-editor/datatype-structure-editor.component';
import { DeltaEditorComponent } from './components/delta-editor/delta-editor.component';
import { MetadataEditComponent } from './components/metadata-edit/metadata-edit.component';
import { PostdefEditorComponent } from './components/postdef-editor/postdef-editor.component';
import { PredefEditorComponent } from './components/predef-editor/predef-editor.component';

const routes: Routes = [
  {
    path: ':datatypeId',
    data: {
      routeParam: 'datatypeId',
      loadAction: LoadDatatype,
      successAction: DatatypeEditActionTypes.LoadDatatypeSuccess,
      failureAction: DatatypeEditActionTypes.LoadDatatypeFailure,
      redirectTo: ['ig', 'error'],
    },
    canActivate: [DataLoaderGuard],
    children: [
      {
        path: '',
        redirectTo: 'structure',
        pathMatch: 'full',
      },
      {
        path: 'metadata',
        component: MetadataEditComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.DATATYPE_METADATA,
            title: 'Metadata',
            resourceType: Type.DATATYPE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenDatatypeMetadataEditorNode,
          idKey: 'datatypeId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'pre-def',
        component: PredefEditorComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.PREDEF,
            title: 'Pre-definition',
            resourceType: Type.DATATYPE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenDatatypePreDefEditor,
          idKey: 'datatypeId',
        },
      },
      {
        path: 'post-def',
        component: PostdefEditorComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.POSTDEF,
            title: 'Post-definition',
            resourceType: Type.DATATYPE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenDatatypePostDefEditor,
          idKey: 'datatypeId',
        },
      },
      {
        path: 'cross-references',
        component: DatatypeCrossRefsComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CROSSREF,
            title: 'Cross references',
            resourceType: Type.DATATYPE,
          },
          idKey: 'datatypeId',
          resourceType: Type.DATATYPE,
          action: OpenDatatypeCrossRefEditor,
        },
      },
      {
        path: 'conformance-statement',
        component: DatatypeConformanceStatementEditorComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.DATATYPE_CS,
            title: 'Conformance Statements',
            resourceType: Type.DATATYPE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenDatatypeConformanceStatementEditor,
          idKey: 'datatypeId',
        },
      },
      {
        path: 'structure',
        children: [
          {
            path: '',
            component: DatatypeStructureEditorComponent,
            canActivate: [EditorActivateGuard],
            canDeactivate: [EditorDeactivateGuard],
            data: {
              editorMetadata: {
                id: EditorID.DATATYPE_STRUCTURE,
                title: 'Structure',
                resourceType: Type.DATATYPE,
              },
              onLeave: {
                saveEditor: true,
                saveTableOfContent: true,
              },
              action: OpenDatatypeStructureEditor,
              idKey: 'datatypeId',
            },
          },
          {
            path: 'delta',
            component: DeltaEditorComponent,
            canActivate: [EditorActivateGuard],
            canDeactivate: [EditorDeactivateGuard],
            data: {
              editorMetadata: {
                id: EditorID.DATATYPE_DELTA,
                title: 'Delta',
                resourceType: Type.DATATYPE,
              },
              onLeave: {
                saveEditor: true,
                saveTableOfContent: true,
              },
              action: OpenDatatypeDeltaEditor,
              idKey: 'datatypeId',
            },
          },
        ],
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatypeRoutingModule {
}
