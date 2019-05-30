import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenIgMetadataEditorNode, OpenNarrativeEditorNode } from '../../root-store/ig/ig-edit/ig-edit.actions';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { AuthenticatedGuard } from './../core/services/auth-guard.guard';
import { CreateIGComponent } from './components/create-ig/create-ig.component';
import { IgEditContainerComponent } from './components/ig-edit-container/ig-edit-container.component';
import { IgListContainerComponent } from './components/ig-list-container/ig-list-container.component';
import { IgMetadataEditorComponent } from './components/ig-metadata-editor/ig-metadata-editor.component';
import { IgSectionEditorComponent } from './components/ig-section-editor/ig-section-editor.component';
import { IgEditResolverService } from './services/ig-edit-resolver.service';
import { IgEditorActivateGuard } from './services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from './services/ig-editor-deactivate.service';

const routes: Routes = [
  {
    path: 'list',
    component: IgListContainerComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'create',
    component: CreateIGComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: ':igId',
    component: IgEditContainerComponent,
    canActivate: [IgEditResolverService],
    children: [
      {
        path: '',
        redirectTo: 'metadata',
        pathMatch: 'full',
      },
      {
        path: 'metadata',
        component: IgMetadataEditorComponent,
        canActivate: [IgEditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.IG_METADATA,
            title: 'Metadata',
            resourceType: Type.IGDOCUMENT,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenIgMetadataEditorNode,
          idKey: 'igId',
        },
        canDeactivate: [IgEditSaveDeactivateGuard],
      },
      {
        path: 'text/:sectionId',
        component: IgSectionEditorComponent,
        canActivate: [IgEditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.SECTION_NARRATIVE,
            resourceType: Type.TEXT,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenNarrativeEditorNode,
          idKey: 'sectionId',
        },
        canDeactivate: [IgEditSaveDeactivateGuard],
      },
      {
        path: 'conformanceprofile',
        loadChildren: 'src/app/modules/conformance-profile/conformance-profile.module#ConformanceProfileModule',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'list',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class IgRoutingModule {
}
