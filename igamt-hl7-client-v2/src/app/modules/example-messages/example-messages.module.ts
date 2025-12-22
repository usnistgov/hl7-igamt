import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from '../shared/shared.module';
import { ExampleMessagesRoutingModule } from './example-messages-routing.module';
import { TreeModule } from 'angular-tree-component';
import { ExampleMessagesContainerComponent } from './components/example-messages-container/example-messages-container.component';
import { ActiveTitlebarComponent } from './components/active-titlebar/active-titlebar.component';
import { ExampleMessagesEffects } from 'src/app/root-store/example-messages/example-messages.effects';
import { TableOfContentComponent } from './components/table-of-content/table-of-content.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { CreateDialogComponent } from './components/create-dialog/create-dialog.component';
import { MessageEditorComponent } from './components/message-editor/message-editor.component';

import * as CodeMirror from 'codemirror';

import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MatProgressSpinnerModule } from '@angular/material';

CodeMirror.defineMode('hl7v2', () => {
  const separators = {
    field_separator: '|',
    component_separator: '^',
    subcomponent_separator: '&',
    continuation_separator: '~,'
  };
  return {
    token: (stream) => {
      const ch = stream.next();
      if (stream.column() <= 2) {
        return 'segment-name';
      } else {
        if (ch === separators.field_separator) {
          return 'field-separator';
        }
        if (ch === separators.component_separator) {
          return 'component-separator';
        }
        if (ch === separators.subcomponent_separator) {
          return 'subcomponent-separator';
        }
        if (ch === separators.continuation_separator) {
          return 'continuation-separator';
        }
        return '';
      }
    }
  };
});

@NgModule({
  declarations: [
    ExampleMessagesContainerComponent,
    ActiveTitlebarComponent,
    TableOfContentComponent,
    SideBarComponent,
    CreateDialogComponent,
    MessageEditorComponent
  ],
  imports: [
    CommonModule,
    TreeModule,
    ExampleMessagesRoutingModule,
    DamFrameworkModule.forRoot(),
    SharedModule,
    MatProgressSpinnerModule,
    EffectsModule.forFeature([ExampleMessagesEffects]),
    CodemirrorModule
  ],
  providers: [],
  exports: [],
  entryComponents: [CreateDialogComponent],
})
export class ExampleMessagesModule { }
