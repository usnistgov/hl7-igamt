import { ActivatedRouteSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const routerFeatureName = 'damf-ngrx-router';
export const selectRouter = createFeatureSelector<fromRouter.RouterReducerState<any>>(routerFeatureName);

export const selectRouterURL = createSelector(
  selectRouter,
  (state) => {
    if (state) {
      return state.state.url;
    } else {
      return '';
    }
  },
);

export const selectRouteParams = createSelector(
  selectRouter,
  (state) => {
    const loop = (routes: ActivatedRouteSnapshot[]) => {
      const params = {};
      for (const route of routes) {
        Object.assign(params, route.params);
        Object.assign(params, loop(route.children));
      }
      return params;
    };
    return loop([state.state.root]);
  },
);
