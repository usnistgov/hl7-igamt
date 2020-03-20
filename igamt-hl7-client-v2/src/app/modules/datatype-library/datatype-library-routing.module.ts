import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IgEditActionTypes, IgEditResolverLoad, OpenIgMetadataEditorNode, OpenNarrativeEditorNode } from '../../root-store/document/document-edit/ig-edit.actions';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';
import {CreateDocumentComponent} from '../document/components/create-document/create-document.component';
import { DocumentEditContainerComponent } from '../document/components/document-edit-container/document-edit-container.component';
import { DocumentListContainerComponent } from '../document/components/document-list-container/document-list-container.component';
import { DocumentMetadataEditorComponent } from '../document/components/document-metadata-editor/document-metadata-editor.component';
import { DocumentSectionEditorComponent } from '../document/components/document-section-editor/document-section-editor.component';
import { DataLoaderResolverService } from '../document/services/data-loader-resolver.service';
import { IgEditorActivateGuard } from '../document/services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from '../document/services/ig-editor-deactivate.service';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { AuthenticatedGuard } from './../core/services/auth-guard.guard';
import {CreateDatatypeLibraryComponent} from './create-datatype-library/create-datatype-library.component';

const routes: Routes = [
  {
    path: 'list',
    component: DocumentListContainerComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'create',
    component: CreateDocumentComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: ':igId',
    component: DocumentEditContainerComponent,
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
        component: DocumentMetadataEditorComponent,
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
        component: DocumentSectionEditorComponent,
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
        path: 'datatype',
        loadChildren: 'src/app/modules/datatype/datatype.module#DatatypeModule',
      },
      {
        path: 'valueset',
        loadChildren: 'src/app/modules/value-set/value-set.module#ValueSetModule',
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
export class DatatypeLibraryRoutingModule {
}
