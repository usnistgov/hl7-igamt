import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLibraryList from './library-list/library-list.reducer';

// Feature
export const featureName = 'library';

// State
export interface IState {
  list: fromLibraryList.IState;
}

// Reducers
export const reducers: ActionReducerMap<IState> = {
  list: fromLibraryList.reducer,
};

// Selectors
export const selectLibraryFeature = createFeatureSelector(featureName);
export const selectLibraryList = createSelector(
  selectLibraryFeature,
  (state: IState) => {
    return state.list;
  },
);
