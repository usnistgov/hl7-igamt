import { createFeatureSelector } from '@ngrx/store';
import { ConformanceProfileEditActions } from './conformance-profile-edit.actions';

export const featureName = 'conformanceProfileEdit';

export interface IState {
  placeholder: any;
}

export const initialState: IState = {
  placeholder: undefined,
};

export function reducer(state = initialState, action: ConformanceProfileEditActions): IState {
  return state;
}

export const selectConformanceProfileFeature = createFeatureSelector(featureName);
