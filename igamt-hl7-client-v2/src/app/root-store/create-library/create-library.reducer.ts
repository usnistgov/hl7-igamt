import {createFeatureSelector, createSelector} from '@ngrx/store';
import {CreateLibraryActions} from './create-library.actions';

export interface IState {
  selected: any[];
}

export const initialState: IState = {
  selected: [],
};

export function reducer(state = initialState, action: CreateLibraryActions): IState {
  return state;
}

export const getCreateIgState = createFeatureSelector<IState>('createLibrary');
