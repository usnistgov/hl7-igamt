import { IDisplayElement } from './display-element.interface';
import { IWorkspace } from './editor.class';
import { IEditorMetadata } from './editor.enum';

export interface IWorkspace {
  active: IWorkspaceActive;
  flags: {
    changed: boolean;
    valid: boolean;
  };
  changeTime: Date;
  current: any;
  initial: any;
}

export interface IWorkspaceActive {
  display: IDisplayElement;
  editor: IEditorMetadata;
}

export interface IWorkspaceCurrent {
  data: any;
  valid: boolean;
  time: Date;
}
