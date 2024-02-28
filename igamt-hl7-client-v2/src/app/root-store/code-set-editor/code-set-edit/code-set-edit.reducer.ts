
import { CodeSetEditActions, CodeSetEditActionTypes } from './code-set-edit.actions';

export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: CodeSetEditActions): State {
  switch (action.type) {

    case CodeSetEditActionTypes.CodeSetEditResolverLoad:
      return state;

    default:
      return state;
  }
}
