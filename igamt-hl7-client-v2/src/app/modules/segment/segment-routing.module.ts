import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LoadSegment,
  OpenSegmentConformanceStatementEditor,
  OpenSegmentCrossRefEditor,
  OpenSegmentMetadataEditor,
  OpenSegmentPostDefEditor,
  OpenSegmentPreDefEditor,
  OpenSegmentStructureEditor,
  SegmentEditActionTypes,
} from '../../root-store/segment-edit/segment-edit.actions';
import { DataLoaderResolverService } from '../ig/services/data-loader-resolver.service';
import { IgEditorActivateGuard } from '../ig/services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from '../ig/services/ig-editor-deactivate.service';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { CoconstraintsEditorComponent } from './components/coconstraints-editor/coconstraints-editor.component';
import { SegmentConformanceStatementEditorComponent } from './components/conformance-statement-editor/segment-conformance-statement-editor.component';
import { SegmentCrossRefsComponent } from './components/cross-refs/segment-cross-refs.component';
import { MetadataEditorComponent } from './components/metadata-editor/metadata-editor.component';
import { PostdefEditorComponent } from './components/postdef-editor/postdef-editor.component';
import { PredefEditorComponent } from './components/predef-editor/predef-editor.component';
import { SegmentStructureEditorComponent } from './components/segment-structure-editor/segment-structure-editor.component';

const routes: Routes = [
  {
    path: ':segmentId',
    data: {
      routeParam: 'segmentId',
      loadAction: LoadSegment,
      successAction: SegmentEditActionTypes.LoadSegmentSuccess,
      failureAction: SegmentEditActionTypes.LoadSegmentFailure,
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
        path: 'pre-def',
        component: PredefEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.PREDEF,
            title: 'Pre-definition',
            resourceType: Type.SEGMENT,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenSegmentPreDefEditor,
          idKey: 'segmentId',
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
            resourceType: Type.CONFORMANCEPROFILE,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenSegmentPostDefEditor,
          idKey: 'segmentId',
        },
      },
      {
        path: 'structure',
        component: SegmentStructureEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.SEGMENT_STRUCTURE,
            title: 'Structure',
            resourceType: Type.SEGMENT,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenSegmentStructureEditor,
          idKey: 'segmentId',
        },
      },
      {
        path: 'metadata',
        component: MetadataEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.SEGMENT_METADATA,
            title: 'Metadata',
            resourceType: Type.SEGMENT,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenSegmentMetadataEditor,
          idKey: 'segmentId',
        },
      },
      {
        path: 'conformance-statement',
        component: SegmentConformanceStatementEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.SEGMENT_CS,
            title: 'Conformance Statements',
            resourceType: Type.SEGMENT,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenSegmentConformanceStatementEditor,
          idKey: 'segmentId',
        },
      },
      {
        path: 'cross-references',
        component: SegmentCrossRefsComponent,
        canActivate: [IgEditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CROSSREF,
            title: 'Cross references',
            resourceType: Type.SEGMENT,
          },
          urlPath: 'segment',
          idKey: 'segmentId',
          resourceType: Type.SEGMENT,
          action: OpenSegmentCrossRefEditor,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SegmentRoutingModule { }
