import { Type } from 'src/app/modules/shared/constants/type.enum';

export interface IEditorMetadata {
  id: string;
  title?: string;
  data?: any;
}

export interface IWorkspaceVerification {
  supported: boolean;
  endpoint: string;
  verificationTime: Date;
  loading: boolean;
  failed: boolean;
  failure?: string;
  entries: IVerificationEnty[];
}

export interface IVerificationEnty {
  code: string;
  pathId: string;
  property: string;
  location: string;
  targetId: string;
  targetType: string;
  message: string;
  severity: string;
  subTarget?: {
    id: string;
    type: Type;
  };
}

export interface IWorkspace {
  active: IWorkspaceActive;
  verification: IWorkspaceVerification;
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
  verification: {
    supported: false,
    endpoint: undefined,
    verificationTime: undefined,
    loading: false,
    failed: false,
    entries: [],
  },
  initial: undefined,
  current: undefined,
  changeTime: undefined,
  flags: {
    changed: false,
    valid: true,
  },
};
