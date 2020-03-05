
import {createEntityAdapter, Dictionary, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {
  DocumentationType,
  IDocumentation,
  IDocumentationWorkspace, IDocumentationWorkspaceActive, IDocumentationWorkspaceCurrent,
} from '../../modules/documentation/models/documentation.interface';
import {DocumentationActionTypes, DocumentationsActions, UpdateDocumentationListSuccess} from './documentation.actions';
export interface IState {
  documentations: EntityState<IDocumentation>;
  workspace: IDocumentationWorkspace;
  editMode: boolean;

}

export const initialState: IState = {
    documentations: {  entities: {}, ids: []},
    workspace: {
      active: {
        display: null,
        editor: { id: null},
      },
      initial: {},
      current: {},
      changeTime: undefined,
      flags: {
        changed: false,
        valid: true,
      },
    },
  editMode: false,
};

export const selectDocumentationState = createFeatureSelector('documentation');

export const documentationEntityAdapter = createEntityAdapter<IDocumentation>();
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = documentationEntityAdapter.getSelectors();

export const selectDocumentations = createSelector(
  selectDocumentationState,
  (state: IState) => {
    return state.documentations;
  },
);
export const selectEditMode = createSelector(
  selectDocumentationState,
  (state: IState) => {
    return state.editMode;
  },
);

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
  ( sections: IDocumentation[], props: { type: DocumentationType }) => {
    return sections.filter((x) => x.type === props.type).sort((n1, n2) => n1.position - n2.position);
  },
);
export const selectWorkspace = createSelector(
  selectDocumentationState,
  (state: IState) => {
    return state.workspace;
  },
);
export const selectWorkspaceActive = createSelector(
  selectWorkspace,
  (state: IDocumentationWorkspace) => {
    return state.active;
  },
);

export const selectEditorTitle = createSelector(
  selectWorkspaceActive,
  (state: IDocumentationWorkspaceActive) => {
    if (state.editor) {
      return state.editor.title;
    } else {
      return '';
    }
  },
);
export const selectSubTitle = createSelector(
  selectWorkspaceActive,
  (state: IDocumentationWorkspaceActive) => {
    if (state.display) {
       return state.display.label;
    } else {
      return '';
    }
  },
);
export const selectWorkspaceCurrentIsValid = createSelector(
  selectWorkspace,
  (state: IDocumentationWorkspace) => {
    return state.flags.valid;
  },
);

export const selectWorkspaceCurrentChangeTime = createSelector(
  selectWorkspace,
  (state: IDocumentationWorkspace) => {
    return state.changeTime;
  },
);

export const selectWorkspaceCurrent = createSelector(
  selectWorkspace,
  selectWorkspaceCurrentIsValid,
  selectWorkspaceCurrentChangeTime,
  (state: IDocumentationWorkspace, valid: boolean, time: Date) => {
    return {
      data: state.current,
      valid,
      time,
    };
  },
);

export const selectLatestUpdate = createSelector(
  selectWorkspaceCurrent,
  (state: IDocumentationWorkspaceCurrent) => {
    return {
      time: state.data.dateUpdated ,
      author: state.data.authors,
    };
  },
);

export const selectWorkspaceCurrentIsChanged = createSelector(
  selectWorkspace,
  (state: IDocumentationWorkspace) => {
    return state.flags.changed;
  },
);

function  getUpdates(list: IDocumentation[]) {
  return  list.map((x) => {
    return {id: x.id, changes : {...x}};
    },
  );
}

export function reducer(state = initialState, action: DocumentationsActions): IState {
  switch (action.type) {

    case DocumentationActionTypes.LoadDocumentations:
      return state;
      case DocumentationActionTypes.ToggleEditMode:
        return {... state, editMode: action.payload};
    case DocumentationActionTypes.LoadDocumentationsSuccess:
      return {... state, documentations: documentationEntityAdapter.upsertMany(action.payload, state.documentations)};
    case DocumentationActionTypes.AddDocumentationState:
      return {... state, documentations: documentationEntityAdapter.upsertOne(action.payload, state.documentations)};
    case DocumentationActionTypes.DeleteDocumentationState:
      return {... state, documentations: documentationEntityAdapter.removeOne(action.id, state.documentations)};
    case DocumentationActionTypes.UpdateDocumentationState:
      return {... state, editMode: false, documentations: documentationEntityAdapter.updateOne({id: action.payload.id, changes: {... action.payload}}, state.documentations),
        workspace: {... state.workspace, flags: {changed: false, valid: true}, current: action.payload, initial: action.payload, active: {... state.workspace.active,
      display: action.payload}},
      };
    case DocumentationActionTypes.UpdateDocumentationListSuccess:
      return {... state, editMode: false, documentations: documentationEntityAdapter.updateMany(
        getUpdates(action.list), state.documentations),
      };
    case DocumentationActionTypes.OpenDocumentationEditor:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          active: {
            display: {
              ...action.payload.element,
            },
            editor: action.payload.editor,
          },
          initial: {
            ...action.payload.initial,
          },
          current: {
            ...action.payload.initial,
          },
          changeTime: new Date(),
          flags: {
            changed: false,
            valid: true,
          },
        },
      };

    case DocumentationActionTypes.DocumentationEditorChange:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          current: {
           ...state.workspace.current,  ...action.payload.data,
          },
          changeTime: action.payload.date,
          flags: {
            changed: true,
            valid: action.payload.valid,
          },
        },
      };

    case DocumentationActionTypes.DocumentationEditorReset:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          changeTime: new Date(),
          current: {
            ...state.workspace.initial,
          },
          flags: {
            ...state.workspace.flags,
            changed: false,
            valid: true,
          },
        },
        editMode: false,
      };
      case DocumentationActionTypes.DocumentationEditorSaveSuccess:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          current: {
            ...(action.current ? action.current : state.workspace.current),
          },
          initial: {
            ...(action.current ? action.current : state.workspace.current),
          },
          flags: {
            ...state.workspace.flags,
            changed: false,
          },
        },
      };
    default:
      return state;
  }
}
