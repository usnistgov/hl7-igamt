import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DamWidgetContainerComponent } from '../dam-framework/components/data-widget/dam-widget-container/dam-widget-container.component';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { WidgetDeactivateGuard } from '../dam-framework/guards/widget-deactivate.guard';
import { WidgetSetupGuard } from '../dam-framework/guards/widget-setup.guard';
import { EXAMPLE_MESSAGES_WIDGET_ID, ExampleMessagesContainerComponent } from './components/example-messages-container/example-messages-container.component';
import { ExampleMessagesActionTypes, LoadExampleMessages, OpenExampleMessageEditor } from 'src/app/root-store/example-messages/example-messages.actions';
import { MessageEditorComponent } from './components/message-editor/message-editor.component';
import { EditorActivateGuard, EditorDeactivateGuard } from '../dam-framework';
import { EditorID } from '../shared/models/editor.enum';


const routes: Routes = [
  {
    data: {
      widgetId: EXAMPLE_MESSAGES_WIDGET_ID,
      routeParam: 'igId',
      loadAction: LoadExampleMessages,
      successAction: ExampleMessagesActionTypes.LoadExampleMessagesSuccess,
      failureAction: ExampleMessagesActionTypes.LoadExampleMessagesFailure,
      redirectTo: ['error'],
      component: ExampleMessagesContainerComponent,
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
        path: 'message/:messageId',
        component: MessageEditorComponent,
        canActivate: [EditorActivateGuard],
        canDeactivate: [EditorDeactivateGuard],
        data: {
          editorMetadata: {
            id: EditorID.EXAMPLE_MESSAGE,
            title: 'Message',
          },
          onLeave: {
            saveEditor: true,
            saveTableOfContent: true,
          },
          action: OpenExampleMessageEditor,
          idKey: 'messageId',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleMessagesRoutingModule { }
