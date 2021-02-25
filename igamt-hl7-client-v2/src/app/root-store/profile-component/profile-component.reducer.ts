
import { ProfileComponentActions, ProfileComponentActionTypes } from './profile-component.actions';

export interface IState {
  placeholder: any;
}

export const initialState: IState = {
  placeholder: undefined,
};

export function reducer(state = initialState, action: ProfileComponentActions): IState {
     return state;
}
