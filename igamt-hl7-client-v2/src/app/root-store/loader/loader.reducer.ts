import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoaderActions, LoaderActionTypes } from './loader.actions';

export interface IState {
  isLoading: boolean;
  uiIsBlocked: boolean;
  loading: number;
}

export const initialState: IState = {
  isLoading: false,
  uiIsBlocked: false,
  loading: 0,
};

export function reducer(state = initialState, action: LoaderActions): IState {
  switch (action.type) {

    case LoaderActionTypes.TurnOnLoader:
      return {
        isLoading: true,
        uiIsBlocked: action.payload.blockUI,
        loading: state.loading + 1,
      };
    case LoaderActionTypes.TurnOffLoader:
      const loading = state.loading - 1;
      return {
        isLoading: loading > 0,
        uiIsBlocked: (loading > 0) && state.uiIsBlocked,
        loading: loading >= 0 ? loading : 0,
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
