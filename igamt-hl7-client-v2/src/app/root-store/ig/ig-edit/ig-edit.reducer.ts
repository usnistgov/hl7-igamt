
import { IgEditActions, IgEditActionTypes } from './ig-edit.actions';

export interface IState {
  document: IgDocument;
}

export const initialState: IState = {
  document: undefined,
};

export function reducer(state = initialState, action: IgEditActions): IState {
  switch (action.type) {

    case IgEditActionTypes.IgEditResolverLoadSuccess:
      return {
        ...state,
        document: action.ig,
      };

    case IgEditActionTypes.IgEditResolverLoadFailure:
      return {
        ...state,
      };

    default:
      return state;
  }
}
