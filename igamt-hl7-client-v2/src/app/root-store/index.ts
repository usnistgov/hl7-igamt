import { ActivatedRouteSnapshot } from '@angular/router';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './authentication/authentication.reducer';
import * as fromConfig from './config/config.reducer';
import * as formCreateIg from './create-ig/create-ig.reducer';
import * as fromLoader from './loader/loader.reducer';
import * as fromPageMessages from './page-messages/page-messages.reducer';

export interface IRouteState {
  auth: fromAuth.IState;
  loader: fromLoader.IState;
  createIg: formCreateIg.IState;
  pageMessages: fromPageMessages.IState;
  config: fromConfig.IState;
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<IRouteState> = {
  auth: fromAuth.reducer,
  loader: fromLoader.reducer,
  createIg: formCreateIg.reducer,
  pageMessages: fromPageMessages.reducer,
  config: fromConfig.reducer,
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
