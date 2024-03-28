
import { CodeSetEditActions, CodeSetEditActionTypes } from './code-set-edit.actions';

export interface IState {

}

export const initialState: IState = {

};

export function reducer(state = initialState, action: CodeSetEditActions): IState {
  switch (action.type) {

    case CodeSetEditActionTypes.CodeSetEditResolverLoad:

    default:
      return state;
  }
}
