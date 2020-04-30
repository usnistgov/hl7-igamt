import { ActionReducerMap } from '@ngrx/store';
import * as fromConfig from './config/config.reducer';
import * as formCreateIg from './create-ig/create-ig.reducer';
import * as fromLoadedResources from './resource-loader/resource-loader.reducer';

export interface IRouteState {
  createIg: formCreateIg.IState;
  config: fromConfig.IState;
  loadedResources: fromLoadedResources.IState;
}

export const reducers: ActionReducerMap<IRouteState> = {
  createIg: formCreateIg.reducer,
  config: fromConfig.reducer,
  loadedResources: fromLoadedResources.reducer,
};
