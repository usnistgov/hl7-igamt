export interface IEditorMetadata {
  id: string;
  title?: string;
  data?: any;
}

export interface IWorkspace {
  active: IWorkspaceActive;
  flags: {
    changed: boolean;
    valid: boolean;
  };
  changeTime: Date;
  current: IWorkspaceCurrent;
  initial: any;
}

export interface IWorkspaceActive {
  display: any;
  editor: IEditorMetadata;
}

export interface IWorkspaceCurrent {
  data: any;
  valid: boolean;
  time: Date;
}

export const emptyWorkspace: IWorkspace = {
  active: undefined,
  initial: undefined,
  current: undefined,
  changeTime: undefined,
  flags: {
    changed: false,
    valid: true,
  },
};
