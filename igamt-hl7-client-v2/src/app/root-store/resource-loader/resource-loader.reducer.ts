import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ResourceLoaderActions, ResourceLoaderActionTypes} from './resource-loader.actions';

export interface IState {
  data: any[];
}

export const initialState: IState = {
  data : [],
};

export function reducer(state = initialState, action: ResourceLoaderActions): IState {
  switch (action.type) {
    case ResourceLoaderActionTypes.LoadResourceSuccess:
       return   { ...state, data: action.payload.response.data };
    case ResourceLoaderActionTypes.LoadResourceFailure:
       return { ...state, data: [] };
    case ResourceLoaderActionTypes.ClearResource:
       return { ...state, data: [] };
    default:
       return state;
  }
}
export const getLoadedResources = createFeatureSelector<IState>('loadedResources');
export const getData = createSelector(
  getLoadedResources,
  (state: IState) => state.data,
);
