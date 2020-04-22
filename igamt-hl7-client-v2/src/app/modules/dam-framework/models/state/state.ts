import { emptyRepository, IRepositoryStore } from './repository';
import { emptyWorkspace, IWorkspace } from './workspace';

export interface IDamDataModel {
  ui: {
    sideBarCollapsed: boolean,
    fullscreen: boolean,
  };
  payload: {
    data: any,
    timestamp: Date,
  };
  values: any;
  repository: IRepositoryStore;
  workspace: IWorkspace;
}

export const emptyDataModel: IDamDataModel = {
  ui: {
    sideBarCollapsed: false,
    fullscreen: false,
  },
  payload: {
    data: undefined,
    timestamp: undefined,
  },
  values: {

  },
  repository: emptyRepository,
  workspace: emptyWorkspace,
};
