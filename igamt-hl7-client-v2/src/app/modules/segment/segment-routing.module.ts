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
import { OpenSegmentDeltaEditor } from '../../root-store/segment-edit/segment-edit.actions';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { SegmentConformanceStatementEditorComponent } from './components/conformance-statement-editor/segment-conformance-statement-editor.component';
import { SegmentCrossRefsComponent } from './components/cross-refs/segment-cross-refs.component';
import { DeltaEditorComponent } from './components/delta-editor/delta-editor.component';
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
    canActivate: [DataLoaderGuard],
    children: [
      {
        path: '',
        redirectTo: 'structure',
        pathMatch: 'full',
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
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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
        children: [
          {
            path: '',
            component: SegmentStructureEditorComponent,
            canActivate: [EditorActivateGuard],
            canDeactivate: [EditorDeactivateGuard],
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
            path: 'delta',
            component: DeltaEditorComponent,
            canActivate: [EditorActivateGuard],
            canDeactivate: [EditorDeactivateGuard],
            data: {
              editorMetadata: {
                id: EditorID.SEGMENT_DELTA,
                title: 'Delta',
                resourceType: Type.SEGMENT,
              },
              onLeave: {
                saveEditor: true,
                saveTableOfContent: true,
              },
              action: OpenSegmentDeltaEditor,
              idKey: 'segmentId',
            },
          },
        ],
      },
      {
        path: 'metadata',
        component: MetadataEditorComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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

      // {
      //   path: 'dynamic-mapping',
      //   component: DynamicMappingEditorComponent,
      //   canActivate: [EditorActivateGuard],
      //   canDeactivate: [EditorDeactivateGuard],
      //   data: {
      //     editorMetadata: {
      //       id: EditorID.DYNAMIC_MAPPING,
      //       title: 'Dynamic mapping',
      //       resourceType: Type.SEGMENT,
      //     },
      //     onLeave: {
      //       saveEditor: true,
      //       saveTableOfContent: true,
      //     },
      //     action: OpenSegmentDynamicMappingEditor,
      //     idKey: 'segmentId',
      //   },
      // },
      {
        path: 'cross-references',
        component: SegmentCrossRefsComponent,
        canActivate: [EditorActivateGuard],
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
