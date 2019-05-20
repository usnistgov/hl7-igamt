import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {IgDocument} from '../../../modules/ig/models/ig/ig-document.class';
import {Type} from '../../../modules/shared/constants/type.enum';
import {IContent} from '../../../modules/shared/models/content.interface';
import {IDisplayElement} from '../../../modules/shared/models/display-element.interface';
import {IgEditActions, IgEditActionTypes} from './ig-edit.actions';
import {ICopyResourceResponse} from "../../../modules/ig/models/toc/toc-operation.class";

export interface IState {
  document: IgDocument;
  segments: EntityState<IDisplayElement>;
  valueSets: EntityState<IDisplayElement>;
  datatypes: EntityState<IDisplayElement>;
  messages: EntityState<IDisplayElement>;
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
    case IgEditActionTypes.AddResourceSuccess:
      return {
        ...state,
        document: { ...state.document, conformanceProfileRegistry: action.payload.ig.conformanceProfileRegistry,
          datatypeRegistry: action.payload.ig.datatypeRegistry,
          segmentRegistry: action.payload.ig.segmentRegistry,
          valueSetRegistry: action.payload.ig.valueSetRegistry,
          content: state.document.content,
        },
        datatypes: igElementAdapter.upsertMany(action.payload.datatypes, state.datatypes),
        segments: igElementAdapter.upsertMany(action.payload.segments, state.segments),
        messages: igElementAdapter.upsertMany(action.payload.messages, state.messages),
        valueSets: igElementAdapter.upsertMany(action.payload.valueSets, state.valueSets),
      };
      case IgEditActionTypes.CopyResourceSuccess:
        return  applyCopy(state, action.payload);

    case IgEditActionTypes.UpdateSections:
      return {
        ...state, document: {...state.document, content: updateSections(action.payload)},
      };

    default:
      return state;
  }
}

function applyCopy(state: IState, payload: ICopyResourceResponse): IState {
  switch (payload.reg.type) {
    case Type.VALUESETREGISTRY:
      return {...state, document: {...state.document, valueSetRegistry: payload.reg}, valueSets: igElementAdapter.upsertOne(payload.display, state.valueSets) };
    case Type.CONFORMANCEPROFILEREGISTRY:
      return {...state, document: {...state.document, conformanceProfileRegistry: payload.reg}, messages: igElementAdapter.upsertOne(payload.display, state.messages) };
    case Type.DATATYPEREGISTRY:
      return {...state, document: {...state.document, datatypeRegistry: payload.reg}, datatypes: igElementAdapter.upsertOne(payload.display, state.datatypes) };
    case Type.SEGMENTREGISTRY:
      return {...state, document: {...state.document, segmentRegistry: payload.reg}, segments: igElementAdapter.upsertOne(payload.display, state.segments) };
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
