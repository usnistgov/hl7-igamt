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
import { OpenDatatypeConformanceStatementEditor } from '../../root-store/datatype-edit/datatype-edit.actions';
import { DataLoaderResolverService } from '../ig/services/data-loader-resolver.service';
import { IgEditorActivateGuard } from '../ig/services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from '../ig/services/ig-editor-deactivate.service';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { DatatypeConformanceStatementEditorComponent } from './components/conformance-statement-editor/datatype-conformance-statement-editor.component';
import { DatatypeCrossRefsComponent } from './components/datatype-cross-refs/datatype-cross-refs.component';
import { DatatypeStructureEditorComponent } from './components/datatype-structure-editor/datatype-structure-editor.component';
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
    canActivate: [DataLoaderResolverService],
    children: [
      {
        path: '',
        redirectTo: 'structure',
        pathMatch: 'full',
      },
      {
        path: 'metadata',
        component: MetadataEditComponent,
        canActivate: [IgEditorActivateGuard],
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
        canDeactivate: [IgEditSaveDeactivateGuard],
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
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
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
        canActivate: [IgEditorActivateGuard],
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
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
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
        component: DatatypeStructureEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatypeRoutingModule {
}
