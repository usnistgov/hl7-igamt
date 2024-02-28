import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

// Feature
export const featureName = 'code-set';

// State
export interface IState {

}

// Reducers
export const reducers: ActionReducerMap<IState> = {
};

// Selectors
export const selectCodeSetFeature = createFeatureSelector(featureName);
