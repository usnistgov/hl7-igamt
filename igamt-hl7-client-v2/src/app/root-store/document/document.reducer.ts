import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {IDocumentType} from '../../modules/document/document.type';
import {Scope} from '../../modules/shared/constants/scope.enum';
import {Type} from '../../modules/shared/constants/type.enum';
import * as fromIgEdit from './document-edit/ig-edit.reducer';
import * as fromIgList from './document-list/document-list.reducer';
import {DocumentActions, DocumentActionTypes} from './document.actions';

// Feature
export const featureName = 'ig';

// State
export interface IState {
  list: fromIgList.IState;
  edit: fromIgEdit.IState;
  type: IDocumentType;
}
export const initialState: IState = {
  list: fromIgList.initialState,
  edit: fromIgEdit.initialState,
  type: {type: Type.IGDOCUMENT, scope: Scope.USER},
};
// Reducers

export function typereducer(state: IDocumentType = initialState.type, action: DocumentActions): IDocumentType {

  if (action.type === DocumentActionTypes.ToggleType) {
    return action.documentType;
  } else {
    return state;
  }
}
// Sele
export const reducers: ActionReducerMap<IState> = {
  list: fromIgList.reducer,
  edit: fromIgEdit.reducer,
  type: typereducer,
};

export const selectIgFeature = createFeatureSelector(featureName);
export const selectIgList = createSelector(
  selectIgFeature,
  (state: IState) => {
    return state.list;
  },
);
export const selectIgEdit = createSelector(
  selectIgFeature,
  (state: IState) => {
    return state ? state.edit : undefined;
  },
);
export const selectDocumentType = createSelector(
  selectIgFeature,
  (state: IState) => {
    return state ? state.type : undefined;
  },
);
