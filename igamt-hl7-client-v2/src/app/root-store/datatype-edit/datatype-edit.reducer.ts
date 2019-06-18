import { DatatypeEditActions, DatatypeEditActionTypes } from './datatype-edit.actions';

export interface IState {
  placeholder: any,
}

export const initialState: IState = {
  placeholder: undefined,
};

export function reducer(state = initialState, action: DatatypeEditActions): IState {
  return state;
}
