import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DocumentationActionTypes,
  LoadDocumentations,
  OpenDocumentationSection,
} from '../../root-store/documentation/documentation.actions';
import { DamWidgetContainerComponent } from '../dam-framework/components/data-widget/dam-widget-container/dam-widget-container.component';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { WidgetDeactivateGuard } from '../dam-framework/guards/widget-deactivate.guard';
import { WidgetSetupGuard } from '../dam-framework/guards/widget-setup.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { DOC_WIDGET_ID, DocumentationContainerComponent } from './components/documentation-container/documentation-contrainer.component';
import { DocumentationContentComponent } from './components/documentation-content/documentation-content.component';

const routes: Routes = [
  {
    data: {
      widgetId: DOC_WIDGET_ID,
      loadAction: LoadDocumentations,
      successAction: DocumentationActionTypes.LoadDocumentationsSuccess,
      failureAction: DocumentationActionTypes.LoadDocumentationsFailure,
      redirectTo: ['documentation', 'error'],
      component: DocumentationContainerComponent,
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
