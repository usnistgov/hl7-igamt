import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ILoaderState } from '../../models/loader/state';

export const loaderFeatureName = 'damf-loader';
export const selectDamfLoaderFeature = createFeatureSelector(loaderFeatureName);

export const selectLoader = createSelector(
  selectDamfLoaderFeature,
  (state: ILoaderState) => {
    return state;
  },
);

export const selectLoaderIsLoading = createSelector(
  selectLoader,
  (state) => {
    return state ? state.isLoading : false;
  },
);
export const selectLoaderUiIsBlocked = createSelector(
  selectLoader,
  (state) => {
    return state ? state.uiIsBlocked : false;
  },
);
