import { createSelector } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IWorkspace } from '../../modules/dam-framework/models/data/workspace';
import { Scope } from '../../modules/shared/constants/scope.enum';
import { IAbstractDomain, IDocumentRef, Status } from '../../modules/shared/models/abstract-domain.interface';
import { IHL7WorkspaceActive } from '../../modules/shared/models/editor.class';

export const selectWorkspaceActive = createSelector(
  fromDAM.selectWorkspace,
  (state: IWorkspace): IHL7WorkspaceActive => {
    return state.active as IHL7WorkspaceActive;
  },
);

export const selectDocument = createSelector(
  fromDAM.selectPayloadData,
  (state: IAbstractDomain): IAbstractDomain => {
    return state;
  },
);

export const selectLoadedDocumentInfo = createSelector(
  selectDocument,
  (state: IAbstractDomain): IDocumentRef => {
    return {
      documentId: state.id,
      type: state.type,
    };
  },
);

export const selectViewOnly = createSelector(
  selectDocument,
  (document: IAbstractDomain): boolean => {
    return document.domainInfo.scope !== Scope.USER || document.status === Status.PUBLISHED;
  },
);

export const selectDelta = fromDAM.selectValue<boolean>('delta');
