import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LoadContext,
  LoadProfileComponent,
  OpenContextStructureEditor, OpenProfileComponentMetadataEditor, OpenSegmentContextDynamicMappingEditor,
  ProfileComponentActionTypes,
} from '../../root-store/profile-component/profile-component.actions';
import { OpenProfileComponentMessageCoConstraintsEditor, OpenProfileComponentMessageConformanceStatementEditor, OpenProfileComponentSegmentConformanceStatementEditor } from '../../root-store/profile-component/profile-component.actions';
import { DataLoaderGuard, EditorActivateGuard, EditorDeactivateGuard } from '../dam-framework';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { CoConstraintsEditorComponent, PC_CC_EDITOR_METADATA } from './components/co-constraints-editor/co-constraints-editor.component';
import { MessageConformanceStatementEditorComponent } from './components/message-conformance-statement-editor/message-conformance-statement-editor.component';
import { MessageContextStructureEditorComponent } from './components/message-context-structure-editor/message-context-structure-editor.component';
import { ProfileComponentMetadataComponent } from './components/profile-component-metadata/profile-component-metadata.component';
import { SegmentConformanceStatementEditorComponent } from './components/segment-conformance-statement-editor/segment-conformance-statement-editor.component';
import {SegmentContextDynamicMappingComponent} from './components/segment-context-dynamic-mapping/segment-context-dynamic-mapping.component';
import { SegmentContextStructureEditorComponent } from './components/segment-context-structure-editor/segment-context-structure-editor.component';

const routes: Routes = [
  {
    path: ':pcId',
    data: {
      routeParam: 'pcId',
      loadAction: LoadProfileComponent,
      successAction: ProfileComponentActionTypes.LoadProfileComponentSuccess,
      failureAction: ProfileComponentActionTypes.LoadProfileComponentFailure,
      redirectTo: ['ig', 'error'],
    },
    canActivate: [DataLoaderGuard],
    children: [
      {
        path: '',
        redirectTo: 'metadata',
        pathMatch: 'full',
      },
      {
        path: 'metadata',
        component: ProfileComponentMetadataComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.PC_METADATA,
            title: 'Metadata',
            resourceType: Type.PROFILECOMPONENT,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenProfileComponentMetadataEditor,
          idKey: 'pcId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: '',
        children: [
          {
            path: 'segment',
            children: [
              {
                path: ':contextId',
                data: {
                  routeParam: 'contextId',
                  loadAction: LoadContext,
                  successAction: ProfileComponentActionTypes.LoadContextSuccess,
                  failureAction: ProfileComponentActionTypes.LoadContextFailure,
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
                    path: 'conformance-statement',
                    component: SegmentConformanceStatementEditorComponent,
                    canActivate: [EditorActivateGuard],
                    canDeactivate: [EditorDeactivateGuard],
                    data: {
                      editorMetadata: {
                        id: EditorID.PC_SEGMENT_CTX_CS,
                        title: 'Conformance Statements',
                        resourceType: Type.SEGMENTCONTEXT,
                      },
                      onLeave: {
                        saveEditor: true,
                        saveTableOfContent: true,
                      },
                      action: OpenProfileComponentSegmentConformanceStatementEditor,
                      idKey: 'contextId',
                    },
                  },
                  {
                    path: 'structure',
                    component: SegmentContextStructureEditorComponent,
                    canActivate: [EditorActivateGuard],
                    canDeactivate: [EditorDeactivateGuard],
                    data: {
                      editorMetadata: {
                        id: EditorID.PC_SEGMENT_CTX_STRUCTURE,
                        title: 'Structure',
                        resourceType: Type.SEGMENTCONTEXT,
                      },
                      onLeave: {
                        saveEditor: true,
                        saveTableOfContent: true,
                      },
                      action: OpenContextStructureEditor,
                      idKey: 'contextId',
                    },
                  },
                  {
                    path: 'dynamic-mapping',
                    component: SegmentContextDynamicMappingComponent,
                    canActivate: [EditorActivateGuard],
                    canDeactivate: [EditorDeactivateGuard],
                    data: {
                      editorMetadata: {
                        id: EditorID.PC_SEGMENT_CTX_DYNAMIC_MAPPING,
                        title: 'Dynamic Mapping',
                        resourceType: Type.SEGMENTCONTEXT,
                      },
                      onLeave: {
                        saveEditor: true,
                        saveTableOfContent: true,
                      },
                      action: OpenSegmentContextDynamicMappingEditor,
                      idKey: 'contextId',
                    },
                  },
                ],
              },
            ],
          },
          {
            path: 'message',
            children: [
              {
                path: ':contextId',
                data: {
                  routeParam: 'contextId',
                  loadAction: LoadContext,
                  successAction: ProfileComponentActionTypes.LoadContextSuccess,
                  failureAction: ProfileComponentActionTypes.LoadContextFailure,
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
                    component: MessageContextStructureEditorComponent,
                    canActivate: [EditorActivateGuard],
                    canDeactivate: [EditorDeactivateGuard],
                    data: {
                      editorMetadata: {
                        id: EditorID.PC_CONFP_CTX_STRUCTURE,
                        title: 'Structure',
                        resourceType: Type.MESSAGECONTEXT,
                      },
                      onLeave: {
                        saveEditor: true,
                        saveTableOfContent: true,
                      },
                      action: OpenContextStructureEditor,
                      idKey: 'contextId',
                    },
                  },
                  {
                    path: 'conformance-statement',
                    component: MessageConformanceStatementEditorComponent,
                    canActivate: [EditorActivateGuard],
                    canDeactivate: [EditorDeactivateGuard],
                    data: {
                      editorMetadata: {
                        id: EditorID.PC_CONFP_CTX_CS,
                        title: 'Conformance Statements',
                        resourceType: Type.MESSAGECONTEXT,
                      },
                      onLeave: {
                        saveEditor: true,
                        saveTableOfContent: true,
                      },
                      action: OpenProfileComponentMessageConformanceStatementEditor,
                      idKey: 'contextId',
                    },
                  },
                  {
                    path: 'co-constraint',
                    component: CoConstraintsEditorComponent,
                    canActivate: [EditorActivateGuard],
                    canDeactivate: [EditorDeactivateGuard],
                    data: {
                      editorMetadata: PC_CC_EDITOR_METADATA,
                      onLeave: {
                        saveEditor: true,
                        saveTableOfContent: true,
                      },
                      action: OpenProfileComponentMessageCoConstraintsEditor,
                      idKey: 'contextId',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ProfileComponentRoutingModule {
}
