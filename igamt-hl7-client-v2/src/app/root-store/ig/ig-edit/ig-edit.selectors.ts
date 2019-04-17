import { createSelector } from '@ngrx/store';
import { selectIgEdit } from '../ig.reducer';
import { ITitleBarMetadata } from './../../../modules/ig/components/ig-edit-titlebar/ig-edit-titlebar.component';
import { IState } from './ig-edit.reducer';

export const selectIgDocument = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.document;
  },
);

export const selectTitleBar = createSelector(
  selectIgDocument,
  (document: IgDocument): ITitleBarMetadata => {
    return {
      title: document.metadata.title,
      domainInfo: document.domainInfo,
      creationDate: document.creationDate,
      updateDate: document.updateDate,
    };
  },
);

export const selectViewOnly = createSelector(
  selectIgDocument,
  (document: IgDocument): boolean => {
    return document.domainInfo.scope !== 'USER';
  },
);
