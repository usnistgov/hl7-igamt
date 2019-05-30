import { createFeatureSelector } from '@ngrx/store';
import { IConformanceProfile } from 'src/app/modules/conformance-profile/models/conformance-profile.model';
import { ConformanceProfileEditActions, ConformanceProfileEditActionTypes } from './conformance-profile-edit.actions';

export const featureName = 'conformanceProfileEdit';

export interface IState {
  conformanceProfile: IConformanceProfile;
}

export const initialState: IState = {
  conformanceProfile: undefined,
};

export function reducer(state = initialState, action: ConformanceProfileEditActions): IState {
  switch (action.type) {
    case ConformanceProfileEditActionTypes.LoadConformanceProfileSuccess:
      return {
        ...state,
        conformanceProfile: action.payload,
      };

    default:
      return state;
  }
}

export const selectConformanceProfileFeature = createFeatureSelector(featureName);
