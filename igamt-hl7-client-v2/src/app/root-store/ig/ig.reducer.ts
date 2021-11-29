import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromIgList from './ig-list/ig-list.reducer';

// Feature
export const featureName = 'ig';

// State
export interface IState {
  list: fromIgList.IState;
}

// Reducers
export const reducers: ActionReducerMap<IState> = {
  list: fromIgList.reducer,
};

// Selectors
export const selectIgFeature = createFeatureSelector(featureName);
export const selectIgList = createSelector(
  selectIgFeature,
  (state: IState) => {
    return state.list;
  },
);
