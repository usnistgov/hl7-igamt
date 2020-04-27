import { ActivatedRouteSnapshot } from '@angular/router';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './authentication/authentication.reducer';
import * as fromConfig from './config/config.reducer';
import * as formCreateIg from './create-ig/create-ig.reducer';
import * as fromDocumentation from './documentation/documentation.reducer';
import * as fromLoadedResources from './resource-loader/resource-loader.reducer';

export interface IRouteState {
  auth: fromAuth.IState;
  createIg: formCreateIg.IState;
  config: fromConfig.IState;
  loadedResources: fromLoadedResources.IState;
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<IRouteState> = {
  auth: fromAuth.reducer,
  createIg: formCreateIg.reducer,
  config: fromConfig.reducer,
  loadedResources: fromLoadedResources.reducer,
  router: routerReducer,
};

// ROUTER SELECTORS
export const selectRouterURL = (state: IRouteState) => {
  if (state.router) {
    return state.router.state.url;
  } else {
    return '';
  }
};

export const selectRouteParams = (state: IRouteState) => {
  const loop = (routes: ActivatedRouteSnapshot[]) => {
    const params = {};
    for (const route of routes) {
      Object.assign(params, route.params);
      Object.assign(params, loop(route.children));
    }
    return params;
  };
  return loop([state.router.state.root]);
};
