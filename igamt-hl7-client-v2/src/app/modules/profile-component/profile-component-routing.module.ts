import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LoadContext,
  LoadProfileComponent,
  LoadProfileComponentFailure,
  LoadProfileComponentSuccess,
  OpenContextStructureEditor, OpenProfileComponentMetadataEditor,
  ProfileComponentActionTypes,
} from '../../root-store/profile-component/profile-component.actions';
import {LoadSegment, SegmentEditActionTypes} from '../../root-store/segment-edit/segment-edit.actions';
import {DataLoaderGuard, EditorActivateGuard, EditorDeactivateGuard} from '../dam-framework';
import {Type} from '../shared/constants/type.enum';
import {EditorID} from '../shared/models/editor.enum';
import {MessageContextStructureEditorComponent} from './components/message-context-structure-editor/message-context-structure-editor.component';
import {ProfileComponentMetadataComponent} from './components/profile-component-metadata/profile-component-metadata.component';
import {SegmentContextStructureEditorComponent} from './components/segment-context-structure-editor/segment-context-structure-editor.component';

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
                    path: 'structure',
                    component: SegmentContextStructureEditorComponent,
                    canActivate: [EditorActivateGuard],
                    canDeactivate: [EditorDeactivateGuard],
                    data: {
                      editorMetadata: {
                        id: EditorID.SEGMENT_STRUCTURE,
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
                        id: EditorID.CONFP_STRUCTURE,
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
                ],
              },
            ],
          },
        ],
      },
    ]}];

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
