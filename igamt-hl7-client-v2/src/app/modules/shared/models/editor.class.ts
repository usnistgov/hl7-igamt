import { IWorkspaceActive } from '../../dam-framework/models/state/workspace';
import { IDisplayElement } from './display-element.interface';
import { IHL7EditorMetadata } from './editor.enum';

export interface IWorkspace {
  active: IHL7WorkspaceActive;
  flags: {
    changed: boolean;
    valid: boolean;
  };
  changeTime: Date;
  current: any;
  initial: any;
}

export interface IHL7WorkspaceActive extends IWorkspaceActive {
  display: IDisplayElement;
  editor: IHL7EditorMetadata;
}
