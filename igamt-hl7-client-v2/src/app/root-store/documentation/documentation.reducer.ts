import { createEntityAdapter, Dictionary, EntityState } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IWorkspace, IWorkspaceActive } from '../../modules/dam-framework/models/state/workspace';
import {
  DocumentationType,
  IDocumentation,
} from '../../modules/documentation/models/documentation.interface';
import { IDocumentationWorkspaceActive } from '../../modules/documentation/models/documentation.interface';
import { DocumentationsActions } from './documentation.actions';

export interface IState {
  placeholder: any;
}

export const initialState: IState = {
  placeholder: undefined,
};

export const documentationEntityAdapter = createEntityAdapter<IDocumentation>();
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = documentationEntityAdapter.getSelectors();

export const selectDocumentations = createSelector(
  fromDAM.selectPayloadData,
  (state: any): EntityState<IDocumentation> => {
    return state;
  },
);

export const selectEditMode = fromDAM.selectValue<boolean>('editMode');

export const selectDocumentationEntities = createSelector(
  selectDocumentations,
  selectEntities,
);

export const selectDocumentationById = createSelector(
  selectDocumentationEntities,
  (sections: Dictionary<IDocumentation>, props: { id: string }) => {
    return sections[props.id];
  },
);
export const selectAllDocumentations = createSelector(
  selectDocumentations,
  selectAll,
);

export const selectDocumentationByType = createSelector(
  selectAllDocumentations,
  (sections: IDocumentation[], props: { type: DocumentationType }) => {
    return sections.filter((x) => x.type === props.type).sort((n1, n2) => n1.position - n2.position);
  },
);

export const selectWorkspaceActive = createSelector(
  fromDAM.selectWorkspace,
  (state: IWorkspace): IDocumentationWorkspaceActive => {
    return state.active as IDocumentationWorkspaceActive;
  },
);

export const isUser = createSelector(
  selectWorkspaceActive,
  (active: IWorkspaceActive) => {
    if (active) {
      return active.display.type === DocumentationType.USERNOTES;
    } else {
      return false;
    }
  },
);

export const selectOpenDocumentationId = createSelector(
  selectWorkspaceActive,
  (active: IWorkspaceActive) => {
    if (active) {
      return active.display.id;
    } else {
      return '';
    }
  },
);

export const selectEditorTitle = createSelector(
  selectWorkspaceActive,
  (active: IDocumentationWorkspaceActive) => {
    if (active) {
      return active.editor.title;
    } else {
      return '';
    }
  },
);

export const selectSubTitle = createSelector(
  selectWorkspaceActive,
  (active: IDocumentationWorkspaceActive) => {
    if (active) {
      return active.display.label;
    } else {
      return '';
    }
  },
);

export const selectActiveTitleBar = createSelector(
  selectEditorTitle,
  selectSubTitle,
  (title: string, subtitle: string) => {
    return {
      title,
      subtitle,
    };
  },
);

export const selectLatestUpdate = createSelector(
  fromDAM.selectWorkspaceActive,
  (active) => {
    if (active) {
      return {
        time: active.display.dateUpdated,
        author: active.display.authors,
      };
    } else {
      return {
        time: '',
        author: '',
      };
    }
  },
);

export function reducer(state = initialState, action: DocumentationsActions): IState {
  return state;
}
