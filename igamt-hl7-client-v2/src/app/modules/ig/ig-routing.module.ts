import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IgEditActionTypes, IgEditResolverLoad, OpenIgMetadataEditorNode, OpenNarrativeEditorNode } from '../../root-store/ig/ig-edit/ig-edit.actions';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { AuthenticatedGuard } from './../core/services/auth-guard.guard';
import { CreateIGComponent } from './components/create-ig/create-ig.component';
import { IgEditContainerComponent } from './components/ig-edit-container/ig-edit-container.component';
import { IgListContainerComponent } from './components/ig-list-container/ig-list-container.component';
import { IgMetadataEditorComponent } from './components/ig-metadata-editor/ig-metadata-editor.component';
import { IgSectionEditorComponent } from './components/ig-section-editor/ig-section-editor.component';
import { DataLoaderResolverService } from './services/data-loader-resolver.service';

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
    data: {
      routeParam: 'igId',
      loadAction: IgEditResolverLoad,
      successAction: IgEditActionTypes.IgEditResolverLoadSuccess,
      failureAction: IgEditActionTypes.IgEditResolverLoadFailure,
      redirectTo: ['ig', 'error'],
    },
    canActivate: [DataLoaderResolverService],
    children: [
      {
        path: '',
        redirectTo: 'metadata',
        pathMatch: 'full',
      },
      {
        path: 'metadata',
        component: IgMetadataEditorComponent,
        canActivate: [EditorActivateGuard],
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
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'text/:sectionId',
        component: IgSectionEditorComponent,
        canActivate: [EditorActivateGuard],
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
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'conformanceprofile',
        loadChildren: 'src/app/modules/conformance-profile/conformance-profile.module#ConformanceProfileModule',
      },
      {
        path: 'segment',
        loadChildren: 'src/app/modules/segment/segment.module#SegmentModule',
      },
      {
        path: 'datatype',
        loadChildren: 'src/app/modules/datatype/datatype.module#DatatypeModule',
      },
      {
        path: 'valueset',
        loadChildren: 'src/app/modules/value-set/value-set.module#ValueSetModule',
      },
      {
        path: 'coconstraintgroup',
        loadChildren: 'src/app/modules/co-constraints/co-constraints.module#CoConstraintsModule',
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
