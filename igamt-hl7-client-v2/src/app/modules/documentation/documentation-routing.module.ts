import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DocumentationActionTypes,
  LoadDocumentations,
  OpenDocumentationSection,
} from '../../root-store/documentation/documentation.actions';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { DocumentationContainerComponent } from './components/documentation-container/documentation-contrainer.component';
import { DocumentationContentComponent } from './components/documentation-content/documentation-content.component';

const routes: Routes = [
  {
    path: '', component: DocumentationContainerComponent,
    data: {
      routeParam: 'none',
      loadAction: LoadDocumentations,
      successAction: DocumentationActionTypes.LoadDocumentationsSuccess,
      failureAction: DocumentationActionTypes.LoadDocumentationsFailure,
      redirectTo: ['documentation', 'error'],
    },
    canActivate: [DataLoaderGuard],
    children: [
      {
        path: 'users-guides/:id', component: DocumentationContentComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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

      {
        path: 'faqs/:id', component: DocumentationContentComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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

      {
        path: 'implementation-decisions/:id', component: DocumentationContentComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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

      {
        path: 'releases-notes/:id', component: DocumentationContentComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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

      {
        path: 'users-notes/:id', component: DocumentationContentComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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

      {
        path: 'glossary/:id', component: DocumentationContentComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
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
