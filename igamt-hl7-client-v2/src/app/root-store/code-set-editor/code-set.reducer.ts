import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as codeSetList from './code-set-list/code-set-list.reducer';

// Feature
export const featureName = 'code-set';

// State
export interface IState {
  list: codeSetList.IState;

}

// Reducers
export const reducers: ActionReducerMap<IState> = {
  list: codeSetList.reducer,

};

// Selectors
export const selectCodeSetFeature = createFeatureSelector(featureName);


// Selectors
export const selectCodeSetList = createSelector(
  selectCodeSetFeature,
  (state: IState) => {
    return state.list;
  },
);
