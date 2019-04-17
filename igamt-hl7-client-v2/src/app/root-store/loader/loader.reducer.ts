
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoaderActions, LoaderActionTypes } from './loader.actions';

export interface IState {
  isLoading: boolean;
  uiIsBlocked: boolean;
}

export const initialState: IState = {
  isLoading: false,
  uiIsBlocked: false,
};

export function reducer(state = initialState, action: LoaderActions): IState {
  switch (action.type) {

    case LoaderActionTypes.TurnOnLoader:
      return {
        isLoading: true,
        uiIsBlocked: action.payload.blockUI,
      };
    case LoaderActionTypes.TurnOffLoader:
      return {
        isLoading: false,
        uiIsBlocked: false,
      };
    default:
      return state;
  }
}

export const selectLoader = createFeatureSelector<IState>('loader');
export const selectLoaderIsLoading = createSelector(
  selectLoader,
  (state: IState) => {
    return state.isLoading;
  },
);
export const selectLoaderUiIsBlocked = createSelector(
  selectLoader,
  (state: IState) => {
    return state.uiIsBlocked;
  },
);
