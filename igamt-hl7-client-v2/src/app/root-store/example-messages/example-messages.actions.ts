import { Action } from '@ngrx/store';
import { IEditorMetadata } from 'src/app/modules/dam-framework';
import { OpenEditorBase } from 'src/app/modules/dam-framework/store';

export enum ExampleMessagesActionTypes {
  LoadExampleMessages = '[ExampleMessages] Load Example Messages',
  LoadExampleMessagesSuccess = '[ExampleMessages] Load Example Messages Success',
  LoadExampleMessagesFailure = '[ExampleMessages] Load Example Messages Failure',
  OpenExampleMessageEditor = '[ExampleMessages] Open Example Message Editor',
}

export class LoadExampleMessages implements Action {
  readonly type = ExampleMessagesActionTypes.LoadExampleMessages;
  constructor(readonly id: string) { }
}

export class LoadExampleMessagesSuccess implements Action {
  readonly type = ExampleMessagesActionTypes.LoadExampleMessagesSuccess;
}

export class LoadExampleMessagesFailure implements Action {
  readonly type = ExampleMessagesActionTypes.LoadExampleMessagesFailure;
}

export class OpenExampleMessageEditor implements OpenEditorBase {
  readonly type = ExampleMessagesActionTypes.OpenExampleMessageEditor;

  constructor(readonly payload: { id: string, editor: IEditorMetadata }) { }
}

export type ExampleMessagesActions = LoadExampleMessages
  | LoadExampleMessagesSuccess
  | LoadExampleMessagesFailure
  | OpenExampleMessageEditor;
