
import { LibraryActions, LibraryActionTypes } from './library.actions';

export interface IState {
  placeholder: any;
}

export const initialState: IState = {
  placeholder: undefined,
};

export function reducer(state = initialState, action: LibraryActions): IState {
  // tslint:disable-next-line: no-commented-code
  // switch (action.type) {

  //   // case LibraryActionTypes.LoadLibrarys:
  //   //   return state;

  //   default:
  return state;
  // }
}
