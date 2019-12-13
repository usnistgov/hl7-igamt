import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoConstraintGroupEditActionTypes, LoadCoConstraintGroup, OpenCoConstraintGroupEditor } from '../../root-store/co-constraint-group-edit/co-constraint-group-edit.actions';
import { DataLoaderResolverService } from '../ig/services/data-loader-resolver.service';
import { IgEditorActivateGuard } from '../ig/services/ig-editor-activate.guard.';
import { IgEditSaveDeactivateGuard } from '../ig/services/ig-editor-deactivate.service';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
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
    canActivate: [DataLoaderResolverService],
    children: [
      {
        path: '',
        redirectTo: 'structure',
        pathMatch: 'full',
      },
      {
        path: 'structure',
        component: CoConstraintGroupEditorComponent,
        canActivate: [IgEditorActivateGuard],
        canDeactivate: [IgEditSaveDeactivateGuard],
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoConstraintGroupRoutingModule { }
