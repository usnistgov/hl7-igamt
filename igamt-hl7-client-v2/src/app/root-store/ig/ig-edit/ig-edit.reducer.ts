import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {IgDocument} from '../../../modules/ig/models/ig/ig-document.class';
import {Type} from '../../../modules/shared/constants/type.enum';
import {IContent} from '../../../modules/shared/models/content.interface';
import {IDisplayElement} from '../../../modules/shared/models/display-element.interface';
import { EditorID } from '../../../modules/shared/models/editor.enum';
import {IgEditActions, IgEditActionTypes} from './ig-edit.actions';

export interface IState {
  document: IgDocument;
  segments: EntityState<IDisplayElement>;
  valueSets: EntityState<IDisplayElement>;
  datatypes: EntityState<IDisplayElement>;
  messages: EntityState<IDisplayElement>;
  workspace: {
    active: {
      display: IDisplayElement,
      editor: EditorID,
    },
    payload: any;
  };
}

export const initialState: IState = {
  document: null,
  segments: {
    entities: {},
    ids: [],
  },
  valueSets: {
    entities: {},
    ids: [],
  },
  datatypes: {
    entities: {},
    ids: [],
  },
  messages: {
    entities: {},
    ids: [],
  },
  workspace: {
    active: undefined,
    payload: undefined,
  },
};

export const igElementAdapter = createEntityAdapter<IDisplayElement>();

export function reducer(state = initialState, action: IgEditActions): IState {
  switch (action.type) {

    case IgEditActionTypes.IgEditResolverLoadSuccess:
      return {
        ...state,
        document: action.igInfo.ig,
        datatypes: igElementAdapter.upsertMany(action.igInfo.datatypes, state.datatypes),
        segments: igElementAdapter.upsertMany(action.igInfo.segments, state.segments),
        messages: igElementAdapter.upsertMany(action.igInfo.messages, state.messages),
        valueSets: igElementAdapter.upsertMany(action.igInfo.valueSets, state.valueSets),
      };

    case IgEditActionTypes.IgEditResolverLoadFailure:
      return {
        ...state,
      };
    case IgEditActionTypes.UpdateSections:
      return {
        ...state, document: {...state.document, content: updateSections(action.payload)},
      };

    case IgEditActionTypes.OpenEditorNode:
      return {
        ...state,
        workspace : {
          ...state.workspace,
          active: {
            display: {
              ...action.payload.element,
            },
            editor: action.payload.editor,
          },
        },
      };
    default:
      return state;
  }
}

function updatePositions(children: IContent[]) {
  for (let i = 0; i < children.length; i++) {
    children[i].position = i + 1;
  }
}

function createSectionFromIDisplay(iDisplayElement: IDisplayElement, i: number): IContent {
  const ret = {
    id: iDisplayElement.id,
    description: iDisplayElement.description,
    type: iDisplayElement.type,
    position: i + 1,
    label: iDisplayElement.variableName,
    children: [],
  };
  if (iDisplayElement.type === Type.TEXT || iDisplayElement.type === Type.PROFILE) {
    ret.children = updateSections(iDisplayElement.children);
  }
  return ret;
}

export function updateSections(children: IDisplayElement[]) {
  const ret: IContent[] = [];
  for (let i = 0; i < children.length; i++) {
    ret.push(createSectionFromIDisplay(children[i], i));
  }
  return ret;
}

export function removeNode(children: IContent[], node: IDisplayElement) {

  for (let i = 0; i < children.length; i++) {
    if (node.id === children[i].id) {
      children.splice(i, 1);
      updatePositions(children);
      return true;
    }
    if (children.length[i].children) {
      return removeNode(children.length[i].children, node);
    }
  }
}
