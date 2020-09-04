import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LoadMessageStructure,
  LoadUserStructures,
  OpenMessageStructureEditor,
  OpenMessageStructureMetadataEditor,
  StructureEditorActionTypes,
} from '../../root-store/structure-editor/structure-editor.actions';
import { LoadSegmentStructure, OpenSegmentStructureEditor, OpenSegmentStructureMetadataEditor } from '../../root-store/structure-editor/structure-editor.actions';
import { DamWidgetContainerComponent } from '../dam-framework/components/data-widget/dam-widget-container/dam-widget-container.component';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { WidgetDeactivateGuard } from '../dam-framework/guards/widget-deactivate.guard';
import { WidgetSetupGuard } from '../dam-framework/guards/widget-setup.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { MessageMetadataEditorComponent } from './components/message-metadata-editor/message-metadata-editor.component';
import { MessageStructureEditorComponent } from './components/message-structure-editor/message-structure-editor.component';
import { SegmentMetadataEditorComponent } from './components/segment-metadata-editor/segment-metadata-editor.component';
import { SegmentStructureEditorComponent } from './components/segment-structure-editor/segment-structure-editor.component';
import { STRUCT_EDIT_WIDGET_ID, StructureEditorContainerComponent } from './components/structure-editor-container/structure-editor-container.component';

const ConformanceProfileRoutes = {
  path: ':conformanceProfileId',
  data: {
    routeParam: 'conformanceProfileId',
    loadAction: LoadMessageStructure,
    successAction: StructureEditorActionTypes.LoadMessageStructureSuccess,
    failureAction: StructureEditorActionTypes.LoadMessageStructureFailure,
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
      path: 'structure',
      children: [
        {
          path: '',
          component: MessageStructureEditorComponent,
          canActivate: [EditorActivateGuard],
          canDeactivate: [EditorDeactivateGuard],
          data: {
            editorMetadata: {
              id: EditorID.CONFP_CUSTOM_STRUCTURE,
              title: 'Structure',
              resourceType: Type.CONFORMANCEPROFILE,
            },
            onLeave: {
              saveEditor: true,
              saveTableOfContent: true,
            },
            action: OpenMessageStructureEditor,
            idKey: 'conformanceProfileId',
          },
        },
      ],
    },
    {
      path: 'metadata',
      component: MessageMetadataEditorComponent,
      canActivate: [EditorActivateGuard],
      canDeactivate: [EditorDeactivateGuard],
      data: {
        editorMetadata: {
          id: EditorID.CUSTOM_MESSAGE_STRUC_METADATA,
          title: 'Metadata',
          resourceType: Type.CONFORMANCEPROFILE,
        },
        onLeave: {
          saveEditor: true,
          saveTableOfContent: true,
        },
        action: OpenMessageStructureMetadataEditor,
        idKey: 'conformanceProfileId',
      },
    },
  ],
};

const SegmentRoutes = {
  path: ':segmentId',
  data: {
    routeParam: 'segmentId',
    loadAction: LoadSegmentStructure,
    successAction: StructureEditorActionTypes.LoadSegmentStructureSuccess,
    failureAction: StructureEditorActionTypes.LoadSegmentStructureFailure,
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
      path: 'structure',
      children: [
        {
          path: '',
          component: SegmentStructureEditorComponent,
          canActivate: [EditorActivateGuard],
          canDeactivate: [EditorDeactivateGuard],
          data: {
            editorMetadata: {
              id: EditorID.SEGMENT_CUSTOM_STRUCTURE,
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
      ],
    },
    {
      path: 'metadata',
      component: SegmentMetadataEditorComponent,
      canActivate: [EditorActivateGuard],
      canDeactivate: [EditorDeactivateGuard],
      data: {
        editorMetadata: {
          id: EditorID.CUSTOM_SEGMENT_STRUC_METADATA,
          title: 'Metadata',
          resourceType: Type.SEGMENT,
        },
        onLeave: {
          saveEditor: true,
          saveTableOfContent: true,
        },
        action: OpenSegmentStructureMetadataEditor,
        idKey: 'segmentId',
      },
    },
  ],
};

const routes: Routes = [
  {
    data: {
      widgetId: STRUCT_EDIT_WIDGET_ID,
      loadAction: LoadUserStructures,
      successAction: StructureEditorActionTypes.LoadUserStructuresSuccess,
      failureAction: StructureEditorActionTypes.LoadUserStructuresFailure,
      redirectTo: ['documentation', 'error'],
      component: StructureEditorContainerComponent,
    },
    component: DamWidgetContainerComponent,
    canActivate: [
      WidgetSetupGuard,
      DataLoaderGuard,
    ],
    canDeactivate: [
      WidgetDeactivateGuard,
    ],
    path: '',
    children: [{
      path: 'conformanceprofile',
      children: [ConformanceProfileRoutes],
    }, {
      path: 'segment',
      children: [SegmentRoutes],
    }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StructureEditorRoutingModule { }
