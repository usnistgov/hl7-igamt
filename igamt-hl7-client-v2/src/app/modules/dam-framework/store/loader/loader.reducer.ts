
import { emptyLoaderState, ILoaderState } from '../../models/loader/state';
import { LoaderActions, LoaderActionTypes } from './loader.actions';

export const loaderInitialState: ILoaderState = emptyLoaderState;

export function loaderReducer(state = loaderInitialState, action: LoaderActions): ILoaderState {
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
