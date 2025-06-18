import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserConfig } from './../../modules/shared/models/config.class';
import { UserConfigActions, UserConfigActionTypes } from './user-config.actions';

export interface IState {
  userConfig: IUserConfig;
}

export const initialState: IState = {
  userConfig: null,
};

export function reducer(state = initialState, action: UserConfigActions): IState {
  if (action.type === UserConfigActionTypes.LoadUserConfigSuccess ||  action.type === UserConfigActionTypes.SaveUserConfigSuccess  ) {
    state = { ...state, userConfig: action.payload.data };
    return state;
  } else {
    return state;
  }
}

export const getConfigState = createFeatureSelector<IState>('userConfig');

export const getUserConfigState = createSelector(
  getConfigState,
  (state: IState) => state.userConfig,
);
