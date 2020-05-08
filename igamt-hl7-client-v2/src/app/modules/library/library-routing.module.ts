import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LibOpenNarrativeEditorNode,
  LibraryEditActionTypes,
  LibraryEditResolverLoad,
  OpenLibraryMetadataEditorNode,
} from '../../root-store/library/library-edit/library-edit.actions';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';
import { AuthenticatedGuard } from '../dam-framework/guards/auth-guard.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { DamWidgetRoute } from '../dam-framework/services/router-helpers.service';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { CreateLibraryComponent } from './components/create-library/create-library.component';
import { LIBRARY_EDIT_WIDGET_ID, LibraryEditContainerComponent } from './components/library-edit-container/library-edit-container.component';
import { LibraryListContainerComponent } from './components/library-list-container/library-list-container.component';
import { LibraryMetadataEditorComponent } from './components/library-metadata-editor/library-metadata-editor.component';
import { LibrarySectionEditorComponent } from './components/library-section-editor/library-section-editor.component';

const routes: Routes = [
  {
    path: 'list',
    component: LibraryListContainerComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'create',
    component: CreateLibraryComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    ...DamWidgetRoute({
      widgetId: LIBRARY_EDIT_WIDGET_ID,
      routeParam: 'libraryId',
      loadAction: LibraryEditResolverLoad,
      successAction: LibraryEditActionTypes.LibraryEditResolverLoadSuccess,
      failureAction: LibraryEditActionTypes.LibraryEditResolverLoadFailure,
      redirectTo: ['library', 'error'],
      component: LibraryEditContainerComponent,
    }),
    path: ':libraryId',
    children: [
      {
        path: '',
        redirectTo: 'metadata',
        pathMatch: 'full',
      },
      {
        path: 'metadata',
        component: LibraryMetadataEditorComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.LIBRARY_METADATA,
            title: 'Metadata',
            resourceType: Type.DATATYPELIBRARY,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenLibraryMetadataEditorNode,
          idKey: 'libraryId',
        },
        canDeactivate: [EditorDeactivateGuard],
      },
      {
        path: 'text/:sectionId',
        component: LibrarySectionEditorComponent,
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
          action: LibOpenNarrativeEditorNode,
          idKey: 'sectionId',
        },
        canDeactivate: [EditorDeactivateGuard],
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
export class LibraryRoutingModule {
}
