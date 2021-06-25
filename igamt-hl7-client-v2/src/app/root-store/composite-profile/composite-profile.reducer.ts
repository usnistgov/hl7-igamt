
import { CompositeProfileActions, CompositeProfileActionTypes } from './composite-profile.actions';

export const featureName = 'compositeProfileEdit';

export interface IState {
  placeholder: any;
}

export const initialState: IState = {
  placeholder: undefined,
};
export function reducer(state = initialState, action: CompositeProfileActions): IState {
  return state;
}
