import { createSelector } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IWorkspace } from '../../modules/dam-framework/models/data/workspace';
import { IgDocument } from '../../modules/ig/models/ig/ig-document.class';
import { Scope } from '../../modules/shared/constants/scope.enum';
import {
  IAbstractDomain,
  IDocumentRef,
  SharePermission,
  Status,
} from '../../modules/shared/models/abstract-domain.interface';
import { IHL7WorkspaceActive } from '../../modules/shared/models/editor.class';
import { VerificationTab } from '../../modules/shared/services/verification.service';
import { selectIgDocument } from '../ig/ig-edit/ig-edit.selectors';

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
  selectIgDocument,
  (document: IgDocument): boolean => {
    return document.domainInfo.scope !== Scope.USER || document.status === Status.PUBLISHED || document.status === Status.LOCKED  || (document.sharePermission && document.sharePermission === SharePermission.READ);
  },
);

export const selectDelta = fromDAM.selectValue<boolean>('delta');
export const selectActiveVerificationTab = fromDAM.selectUIValue<VerificationTab>('activeVerificationTab');
