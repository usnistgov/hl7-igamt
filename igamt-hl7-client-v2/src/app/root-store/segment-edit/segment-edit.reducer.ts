
import { SegmentEditActions } from './segment-edit.actions';

export interface IState {
  placeholder: any;
}

export const initialState: IState = {
  placeholder: undefined,
};

export function reducer(state = initialState, action: SegmentEditActions): IState {
  return state;
}
