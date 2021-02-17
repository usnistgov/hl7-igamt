import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LoadSegmentContext,
  OpenProfileComponent, OpenSegmentContextStructureEditor,
   ProfileComponentActionTypes,
} from '../../root-store/profile-component/profile-component.actions';
import {DataLoaderGuard, EditorActivateGuard, EditorDeactivateGuard} from '../dam-framework';
import {Type} from '../shared/constants/type.enum';
import {EditorID} from '../shared/models/editor.enum';
import {ProfileComponentMetadataComponent} from './components/profile-component-metadata/profile-component-metadata.component';
import {ProfileComponentStructureEditorComponent} from './components/profile-component-structure-editor/profile-component-structure-editor.component';

const routes: Routes = [
  {
    path: ':pcId',
    children: [
      {
        path: '',
        component: ProfileComponentMetadataComponent,
        // canActivate: [EditorActivateGuard],
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
          action: OpenProfileComponent,
          idKey: 'pcId',
        },
         // canDeactivate: [EditorDeactivateGuard],
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
                  loadAction: LoadSegmentContext,
                  successAction: ProfileComponentActionTypes.LoadSegmentContextSuccess,
                  failureAction: ProfileComponentActionTypes.LoadSegmentContextFailure,
                  redirectTo: ['ig', 'error'],
                },
                // canActivate: [DataLoaderGuard],
                children: [
                  {
                    path: '',
                    redirectTo: 'structure',
                    pathMatch: 'full',
                  },
                  {
                    path: 'structure',
                    component: ProfileComponentStructureEditorComponent,
                    // canActivate: [EditorActivateGuard],
                    // canDeactivate: [EditorDeactivateGuard],
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
                      action: OpenSegmentContextStructureEditor,
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
                  loadAction: LoadSegmentContext,
                  successAction: ProfileComponentActionTypes.LoadSegmentContextSuccess,
                  failureAction: ProfileComponentActionTypes.LoadSegmentContextFailure,
                  redirectTo: ['ig', 'error'],
                },
                // canActivate: [DataLoaderGuard],
                children: [
                  {
                    path: '',
                    redirectTo: 'structure',
                    pathMatch: 'full',
                  },
                  {
                    path: 'structure',
                    component: ProfileComponentStructureEditorComponent,
                    // canActivate: [EditorActivateGuard],
                    // canDeactivate: [EditorDeactivateGuard],
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
                      action: OpenSegmentContextStructureEditor,
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
