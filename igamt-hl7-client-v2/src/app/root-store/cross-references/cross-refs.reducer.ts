
import {IRelationShip} from '../../modules/shared/models/cross-reference';
import { CrossRefsActions, CrossRefsActionTypes } from './cross-refs.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface IState {
  data: IRelationShip[];
}

export const initialState: IState = {
 data : [],
};

export function reducer(state = initialState, action: CrossRefsActions): IState {
  switch (action.type) {

    case CrossRefsActionTypes.LoadCrossRefSuccess:
      return {
        data: action.payload.data};
    case CrossRefsActionTypes.ClearCrossRefs:
        return {
          data: []};
    default:
      return state;
  }
}
export const getCrossReferencesState = createFeatureSelector<IState>('crossReferences');
export const getCrossReferences = createSelector(
  getCrossReferencesState,
  (state: IState) => state.data,
);
