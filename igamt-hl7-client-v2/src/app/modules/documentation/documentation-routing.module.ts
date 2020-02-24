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
import {DocumentationEditorComponent} from './components/documentation-editor/documentation-editor.component';
import {DocumentationResolver} from './documentation-resolver';
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
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          idKey: 'id',
          action: OpenDocumentationSection,
        },
      },

      {path: 'faqs/:id', component: DocumentationContentComponent, canDeactivate: [CanDeactivateDocumentationGuard]},

      {path: 'implementation-decesions/:id', component: DocumentationContentComponent, canDeactivate: [CanDeactivateDocumentationGuard]},

      {path: 'implementation-decisions/:id', component: DocumentationContentComponent, canDeactivate: [CanDeactivateDocumentationGuard]},

      {path: 'implementation-decesions/:id', component: DocumentationContentComponent, canDeactivate: [CanDeactivateDocumentationGuard]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule { }
