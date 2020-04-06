export interface IDamDataModel {
  ui: {
    sideBarCollapsed: boolean,
    fullscreen: boolean,
  };
  payload: {
    data: any,
    timestamp: string,
  };
}
