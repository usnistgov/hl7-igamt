import { ActionReducerMap } from '@ngrx/store';
import * as fromConfig from './config/config.reducer';
import * as formCreateIg from './create-ig/create-ig.reducer';
import * as formCreateLibrary from './create-library/create-library.reducer';
import * as fromLoadedResources from './resource-loader/resource-loader.reducer';

export interface IRouteState {
  createIg: formCreateIg.IState;
  createLibray: formCreateLibrary.IState;
  config: fromConfig.IState;
  loadedResources: fromLoadedResources.IState;
}

export const reducers: ActionReducerMap<IRouteState> = {
  createIg: formCreateIg.reducer,
  createLibray: formCreateIg.reducer,
  config: fromConfig.reducer,
  loadedResources: fromLoadedResources.reducer,
};
