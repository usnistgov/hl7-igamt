
import { ProfileComponentActions, ProfileComponentActionTypes } from './profile-component.actions';

export interface IState {
/**/
}

export const initialState: IState = {

};

export function reducer(state = initialState, action: ProfileComponentActions): IState {
  switch (action.type) {

    case ProfileComponentActionTypes.OpenProfileComponent:
      return state;

    default:
      return state;
  }
}
