import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DocumentationActionTypes,
  LoadDocumentations,
  OpenDocumentationSection,
} from '../../root-store/documentation/documentation.actions';
import {Type} from '../shared/constants/type.enum';
import {EditorID} from '../shared/models/editor.enum';
import {DocumentationContainerComponent} from './components/documentation-container/documentation-contrainer.component';
import {DocumentationContentComponent} from './components/documentation-content/documentation-content.component';
import {CanActivateDocumentationGuard} from './guards/can-activate-documentation.guard';
import {CanDeactivateDocumentationGuard} from './guards/can-deactivate-documentation.guard';
import {DocumentationLoaderGuard} from './guards/documentation-loader.guard';

const routes: Routes = [
  {
    path: '', component: DocumentationContainerComponent,
    data: {
      loadAction: LoadDocumentations,
      successAction: DocumentationActionTypes.LoadDocumentationsSuccess,
      failureAction: DocumentationActionTypes.LoadDocumentationsFailure,
      redirectTo: ['documentation', 'error'],
    },
    canActivate: [DocumentationLoaderGuard],
    children: [
      { path: 'users-guides/:id', component: DocumentationContentComponent,
        canDeactivate: [CanDeactivateDocumentationGuard],
        canActivate: [CanActivateDocumentationGuard],
        data: {
          editorMetadata: {
            id: EditorID.SECTION_NARRATIVE,
            resourceType: Type.SECTION,
            title: 'Users Guides',
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: false,
          },
          idKey: 'id',
          action: OpenDocumentationSection,
        },
      },

      { path: 'faqs/:id', component: DocumentationContentComponent,
        canDeactivate: [CanDeactivateDocumentationGuard],
        canActivate: [CanActivateDocumentationGuard],
        data: {
          editorMetadata: {
            id: EditorID.SECTION_NARRATIVE,
            resourceType: Type.SECTION,
            title: 'faqs',

          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: false,
          },
          idKey: 'id',
          action: OpenDocumentationSection,
        },
      },

      { path: 'implementation-decisions/:id', component: DocumentationContentComponent,
        canDeactivate: [CanDeactivateDocumentationGuard],
        canActivate: [CanActivateDocumentationGuard],
        data: {
          editorMetadata: {
            id: EditorID.SECTION_NARRATIVE,
            resourceType: Type.SECTION,
            title: 'Implementation Decisions',
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: false,
          },
          idKey: 'id',
          action: OpenDocumentationSection,
        },
      },

      { path: 'releases-notes/:id', component: DocumentationContentComponent,
        canDeactivate: [CanDeactivateDocumentationGuard],
        canActivate: [CanActivateDocumentationGuard],
        data: {
          editorMetadata: {
            id: EditorID.SECTION_NARRATIVE,
            resourceType: Type.SECTION,
            title: 'Release Notes',
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          idKey: 'id',
          action: OpenDocumentationSection,
        },
      },

      { path: 'users-notes/:id', component: DocumentationContentComponent,
        canDeactivate: [CanDeactivateDocumentationGuard],
        canActivate: [CanActivateDocumentationGuard],
        data: {
          editorMetadata: {
            id: EditorID.SECTION_NARRATIVE,
            resourceType: Type.SECTION,
            title: 'Users Notes',

          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: false,
          },
          idKey: 'id',
          action: OpenDocumentationSection,
        },
      },

      { path: 'glossary/:id', component: DocumentationContentComponent,
        canDeactivate: [CanDeactivateDocumentationGuard],
        canActivate: [CanActivateDocumentationGuard],
        data: {
          editorMetadata: {
            id: EditorID.SECTION_NARRATIVE,
            resourceType: Type.SECTION,
            title: 'Glossary',
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: false,
          },
          idKey: 'id',
          action: OpenDocumentationSection,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule { }
