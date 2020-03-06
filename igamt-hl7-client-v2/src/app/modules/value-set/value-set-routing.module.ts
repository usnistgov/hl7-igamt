import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  LoadValueSet, OpenValueSetCrossRefEditor, OpenValueSetDeltaEditor, OpenValueSetMetadataEditor,
  OpenValueSetPostDefEditor, OpenValueSetPreDefEditor,
  OpenValueSetStructureEditor,
  ValueSetEditActionTypes,
} from '../../root-store/value-set-edit/value-set-edit.actions';
import { DataLoaderResolverService } from '../ig/services/data-loader-resolver.service';
import { IgEditorActivateGuard } from '../ig/services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from '../ig/services/ig-editor-deactivate.service';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { DeltaEditorComponent } from './components/delta-editor/delta-editor.component';
import {ValueSetCrossRefsComponent} from './components/value-set-cross-refs/value-set-cross-refs.component';
import {ValueSetMetadataEditorComponent} from './components/value-set-metadata-editor/value-set-metadata-editor.component';
import {ValueSetPostdefEditorComponent} from './components/value-set-postdef-editor/value-set-postdef-editor.component';
import {ValueSetPredefEditorComponent} from './components/value-set-predef-editor/value-set-predef-editor.component';
import {ValueSetStructureEditorComponent} from './components/value-set-structure-editor/value-set-structure-editor.component';

const routes: Routes = [
  {
    path: ':valuesetId',
    data: {
      routeParam: 'valuesetId',
      loadAction: LoadValueSet,
      successAction: ValueSetEditActionTypes.LoadValueSetSuccess,
      failureAction: ValueSetEditActionTypes.LoadValueSetFailure,
      redirectTo: ['ig', 'error'],
    },
    canActivate: [DataLoaderResolverService],
    children: [
      {
        path: '',
        redirectTo: 'structure',
        pathMatch: 'full',
      },
      {
        path: 'pre-def',
        component: ValueSetPredefEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.PREDEF,
            title: 'Pre-definition',
            resourceType: Type.VALUESET,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenValueSetPreDefEditor,
          idKey: 'valuesetId',
        },
      },
      {
        path: 'post-def',
        component: ValueSetPostdefEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.POSTDEF,
            title: 'Post-definition',
            resourceType: Type.VALUESET,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenValueSetPostDefEditor,
          idKey: 'valuesetId',
        },
      },
      {
        path: 'structure',
        component: ValueSetStructureEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.VALUESET_STRUCTURE,
            title: 'Structure',
            resourceType: Type.VALUESET,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenValueSetStructureEditor,
          idKey: 'valuesetId',
        },
      },
      {
        path: 'metadata',
        component: ValueSetMetadataEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.VALUESET_METADATA,
            title: 'Metadata',
            resourceType: Type.VALUESET,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenValueSetMetadataEditor,
          idKey: 'valuesetId',
        },
      },

      {
        path: 'cross-references',
        component: ValueSetCrossRefsComponent,
        canActivate: [IgEditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CROSSREF,
            title: 'Cross references',
            resourceType: Type.VALUESET,
          },
          urlPath: 'valueset',
          idKey: 'valuesetId',
          resourceType: Type.VALUESET,
          action: OpenValueSetCrossRefEditor,
        },
      },
      {
        path: 'delta',
        component: DeltaEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.VALUESET_DELTA,
            title: 'Delta',
            resourceType: Type.VALUESET,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenValueSetDeltaEditor,
          idKey: 'valuesetId',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValueSetRoutingModule { }
