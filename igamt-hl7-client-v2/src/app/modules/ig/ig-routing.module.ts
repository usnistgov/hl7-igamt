import { OpenIgVerificationEditor } from './../../root-store/ig/ig-edit/ig-edit.actions';
import { IgVerificationComponent } from './components/ig-verification/ig-verification.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IgEditActionTypes, IgEditResolverLoad, OpenConformanceStatementSummaryEditorNode, OpenIgMetadataEditorNode, OpenNarrativeEditorNode } from '../../root-store/ig/ig-edit/ig-edit.actions';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';
import { DamWidgetContainerComponent } from '../dam-framework/components/data-widget/dam-widget-container/dam-widget-container.component';
import { AuthenticatedGuard } from '../dam-framework/guards/auth-guard.guard';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { EditorActivateGuard } from '../dam-framework/guards/editor-activate.guard';
import { EditorDeactivateGuard } from '../dam-framework/guards/editor-deactivate.guard';
import { WidgetDeactivateGuard } from '../dam-framework/guards/widget-deactivate.guard';
import { WidgetSetupGuard } from '../dam-framework/guards/widget-setup.guard';
import { Type } from '../shared/constants/type.enum';
import { EditorID } from '../shared/models/editor.enum';
import { ConformanceStatementsSummaryEditorComponent } from './components/conformance-statements-summary-editor/conformance-statements-summary-editor.component';
import { CreateIGComponent } from './components/create-ig/create-ig.component';
import { IG_EDIT_WIDGET_ID, IgEditContainerComponent } from './components/ig-edit-container/ig-edit-container.component';
import { IgListContainerComponent } from './components/ig-list-container/ig-list-container.component';
import { IgMetadataEditorComponent } from './components/ig-metadata-editor/ig-metadata-editor.component';
import { IgSectionEditorComponent } from './components/ig-section-editor/ig-section-editor.component';

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
    data: {
      widgetId: IG_EDIT_WIDGET_ID,
      routeParam: 'igId',
      loadAction: IgEditResolverLoad,
      successAction: IgEditActionTypes.IgEditResolverLoadSuccess,
      failureAction: IgEditActionTypes.IgEditResolverLoadFailure,
      redirectTo: ['ig', 'error'],
      component: IgEditContainerComponent,
    },
    component: DamWidgetContainerComponent,
    canActivate: [
      WidgetSetupGuard,
      DataLoaderGuard,
    ],
    canDeactivate: [
      WidgetDeactivateGuard,
    ],
    path: ':igId',
    children: [
      {
        path: '',
        redirectTo: 'metadata',
        pathMatch: 'full',
      },
      {
        path: 'conformance-statements',
        component: ConformanceStatementsSummaryEditorComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.CS_SUMMARY,
            title: 'Conformance Statements Summary',
            resourceType: Type.CONFORMANCESTATEMENTSUMMARY,
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenConformanceStatementSummaryEditorNode,
          idKey: 'igId',
        },
        canDeactivate: [EditorDeactivateGuard],
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
        path: 'verification',
        component: IgVerificationComponent,
        canActivate: [EditorActivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.IG_VERIFICATION,
            title: 'Verification',
            resourceType: Type.IGDOCUMENT,
          },
          onLeave: {
            saveEditor: false,
            saveTableOfContent: false,
          },
          action: OpenIgVerificationEditor,
          idKey: 'igId',
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
      {
        path: 'profilecomponent',
        loadChildren: 'src/app/modules/profile-component/profile-component.module#ProfileComponentModule',
      },
      {
        path: 'compositeprofile',
        loadChildren: 'src/app/modules/composite-profile/composite-profile.module#CompositeProfileModule',
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
