import { emptyRepository, IRepositoryStore } from './repository';
import { emptyWorkspace, IWorkspace } from './workspace';

export interface IDamDataModel {
  setup: {
    widgetId: string;
    bootstrapped: boolean;
  };
  ui: {
    sideBarCollapsed: boolean,
    fullscreen: boolean,
    bottomDrawerCollapsed: boolean,
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
  setup: {
    widgetId: undefined,
    bootstrapped: false,
  },
  ui: {
    sideBarCollapsed: false,
    bottomDrawerCollapsed: true,
    fullscreen: false,
  },
  payload: {
    data: undefined,
    timestamp: undefined,
  },
  values: {},
  repository: emptyRepository,
  workspace: emptyWorkspace,
};
