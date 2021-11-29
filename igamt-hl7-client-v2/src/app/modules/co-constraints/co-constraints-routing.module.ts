import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CoConstraintGroupEditActionTypes,
  LoadCoConstraintGroup,
  OpenCoConstraintGroupCrossRefEditor,
  OpenCoConstraintGroupEditor,
} from '../../root-store/co-constraint-group-edit/co-constraint-group-edit.actions';
import { OpenCoConstraintGroupDeltaEditor } from '../../root-store/co-constraint-group-edit/co-constraint-group-edit.actions';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { CoConstraintCrossRefComponent } from './components/co-constraint-cross-ref/co-constraint-cross-ref.component';
import { CoConstraintGroupDeltaEditorComponent } from './components/co-constraint-group-delta-editor/co-constraint-group-delta-editor.component';
import { CoConstraintGroupEditorComponent } from './components/co-constraint-group-editor/co-constraint-group-editor.component';

const routes: Routes = [
  {
    path: ':ccGroupId',
    data: {
      routeParam: 'ccGroupId',
      loadAction: LoadCoConstraintGroup,
      successAction: CoConstraintGroupEditActionTypes.LoadCoConstraintGroupSuccess,
      failureAction: CoConstraintGroupEditActionTypes.LoadCoConstraintGroupFailure,
      redirectTo: ['ig', 'error'],
    },
    canActivate: [DataLoaderGuard],
    children: [
      {
        path: '',
        redirectTo: 'structure',
        pathMatch: 'full',
      },
      {
        path: 'structure',
        component: CoConstraintGroupEditorComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CC_GROUP,
            title: 'Co-Constraint Group',
            resourceType: Type.COCONSTRAINTGROUP,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenCoConstraintGroupEditor,
          idKey: 'ccGroupId',
        },
      },
      {
        path: 'delta',
        component: CoConstraintGroupDeltaEditorComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CC_GROUP_DELTA,
            title: 'Delta',
            resourceType: Type.COCONSTRAINTGROUP,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenCoConstraintGroupDeltaEditor,
          idKey: 'ccGroupId',
        },
      },
      {
        path: 'cross-references',
        component: CoConstraintCrossRefComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CROSSREF,
            title: 'Cross references',
            resourceType: Type.COCONSTRAINTGROUP,
          },
          urlPath: 'coconstraintgroup',
          idKey: 'ccGroupId',
          resourceType: Type.COCONSTRAINTGROUP,
          action: OpenCoConstraintGroupCrossRefEditor,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoConstraintGroupRoutingModule { }
