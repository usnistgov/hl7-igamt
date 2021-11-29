import { ValueSetEditActions } from './value-set-edit.actions';

export interface IState {
 placeholder: any;
}

export const initialState: IState = {
  placeholder: null,
};

export function reducer(state = initialState, action: ValueSetEditActions): IState {
      return state;
}
