import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWorkspaceList from './workspace-list/workspace-list.reducer';

// Feature
export const featureName = 'workspace';

// State
export interface IState {
  list: fromWorkspaceList.IState;
}

// Reducers
export const reducers: ActionReducerMap<IState> = {
  list: fromWorkspaceList.reducer,
};

// Selectors
export const selectWorkspaceFeature = createFeatureSelector(featureName);
export const selectWorkspaceList = createSelector(
  selectWorkspaceFeature,
  (state: IState) => {
    return state.list;
  },
);
