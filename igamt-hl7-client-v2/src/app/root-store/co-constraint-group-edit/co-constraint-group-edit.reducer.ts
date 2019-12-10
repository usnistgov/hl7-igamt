
import { createFeatureSelector } from '@ngrx/store';
import { CoConstraintGroupEditActions, CoConstraintGroupEditActionTypes } from './co-constraint-group-edit.actions';

export const featureName = 'coConstraintGroup';

export interface IState {
  placeholder: any;
}

export const initialState: IState = {
  placeholder: undefined,
};

export function reducer(state = initialState, action: CoConstraintGroupEditActions): IState {
  return state;
}

export const selectCoConstraingGroupFeature = createFeatureSelector(featureName);
