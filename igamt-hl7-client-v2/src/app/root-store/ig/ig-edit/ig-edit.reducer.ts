import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IWorkspace } from 'src/app/modules/shared/models/editor.class';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { IgTOCNodeHelper } from '../../../modules/ig/services/ig-toc-node-helper.service';
import { Type } from '../../../modules/shared/constants/type.enum';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import {IRegistry} from '../../../modules/shared/models/registry.interface';
import { IgEditActions, IgEditActionTypes, ToggleFullScreen } from './ig-edit.actions';

export interface IResourcesState {
  selected: IResource;
  resources: EntityState<IResource>;
}

export interface IState {
  document: IgDocument;
  tocCollapsed: boolean;
  fullscreen: boolean;
  tableOfContentEdit: {
    changed: boolean;
  };
  segments: EntityState<IDisplayElement>;
  valueSets: EntityState<IDisplayElement>;
  datatypes: EntityState<IDisplayElement>;
  messages: EntityState<IDisplayElement>;
  sections: EntityState<IDisplayElement>;
  resources: IResourcesState;
  workspace: IWorkspace;
}

export const initialState: IState = {
  document: null,
  tocCollapsed: false,
  fullscreen: false,
  tableOfContentEdit: {
    changed: false,
  },
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
  sections: {
    entities: {},
    ids: [],
  },
  resources: {
    selected: undefined,
    resources: {
      entities: {},
      ids: [],
    },
  },
  workspace: {
    active: undefined,
    initial: undefined,
    current: undefined,
    changeTime: undefined,
    flags: {
      changed: false,
      valid: true,
    },
  },
};

export const igElementAdapter = createEntityAdapter<IDisplayElement>();
export const loadedResourceAdapter = createEntityAdapter<IResource>();

function removeById( reg: IRegistry, id: string): IRegistry {
  return  {... reg, children: reg.children.filter((elm) => elm.id !== id)};
}

// tslint:disable-next-line: no-big-function
export function reducer(state = initialState, action: IgEditActions): IState {
  switch (action.type) {

    case IgEditActionTypes.IgEditResolverLoadSuccess:
      const sections: IDisplayElement[] = IgTOCNodeHelper.getIDisplayFromSections(action.igInfo.ig.content, '');
      return {
        ...state,
        document: action.igInfo.ig,
        datatypes: igElementAdapter.upsertMany(action.igInfo.datatypes, state.datatypes),
        segments: igElementAdapter.upsertMany(action.igInfo.segments, state.segments),
        messages: igElementAdapter.upsertMany(action.igInfo.messages, state.messages),
        valueSets: igElementAdapter.upsertMany(action.igInfo.valueSets, state.valueSets),
        sections: igElementAdapter.upsertMany(sections, state.sections),
      };

    case IgEditActionTypes.ClearIgEdit:
      return {
        ...initialState,
      };

    case IgEditActionTypes.LoadResourceReferencesSuccess:
      return {
        ...state,
        resources: {
          ...state.resources,
          resources: loadedResourceAdapter.upsertMany(action.payload, state.resources.resources),
        },
      };

    case IgEditActionTypes.LoadSelectedResource:
      return {
        ...state,
        resources: {
          resources: {
            entities: {},
            ids: [],
          },
          selected: action.resource,
        },
      };

    case IgEditActionTypes.OpenEditor:
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

    case IgEditActionTypes.AddResourceSuccess:
      return {
        ...state,
        document: {
          ...state.document, conformanceProfileRegistry: action.payload.ig.conformanceProfileRegistry,
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

      if (action.payload.display.type === Type.VALUESET) {
        return {
          ...state,
          document: { ...state.document, valueSetRegistry: action.payload.reg },
          valueSets: igElementAdapter.upsertOne(action.payload.display, state.valueSets),
        };
      } else if (action.payload.display.type === Type.CONFORMANCEPROFILE) {
        return {
          ...state,
          document: { ...state.document, conformanceProfileRegistry: action.payload.reg },
          messages: igElementAdapter.upsertOne(action.payload.display, state.messages),
        };
      } else if (action.payload.display.type === Type.DATATYPE) {
        return {
          ...state,
          document: { ...state.document, datatypeRegistry: action.payload.reg },
          datatypes: igElementAdapter.upsertOne(action.payload.display, state.datatypes),
        };
      } else if (action.payload.display.type === Type.SEGMENT) {
        return {
          ...state,
          document: { ...state.document, segmentRegistry: action.payload.reg },
          segments: igElementAdapter.upsertOne(action.payload.display, state.segments),
        };
      } else {
        return state;
      }
      case IgEditActionTypes.DeleteResourceSuccess:
        if (action.payload.type === Type.VALUESET) {
          return {
            ...state,
            document: { ...state.document, valueSetRegistry: removeById(state.document.valueSetRegistry, action.payload.id) },
            valueSets: igElementAdapter.removeOne(action.payload.id, state.valueSets),
          };
        } else if (action.payload.type === Type.CONFORMANCEPROFILE) {
          return {
            ...state,
            document: { ...state.document, conformanceProfileRegistry: removeById(state.document.conformanceProfileRegistry, action.payload.id) },
            messages: igElementAdapter.removeOne(action.payload.id, state.messages),
          };
        } else if (action.payload.type === Type.DATATYPE) {
          return {
            ...state,
            document: { ...state.document, datatypeRegistry: removeById(state.document.datatypeRegistry, action.payload.id)},
            datatypes: igElementAdapter.removeOne(action.payload.id, state.datatypes),
          };
        } else if (action.payload.type === Type.SEGMENT) {
          return {
            ...state,
            document: { ...state.document, segmentRegistry: removeById(state.document.segmentRegistry, action.payload.id) },
            segments: igElementAdapter.removeOne(action.payload.id, state.segments),
          };
        } else {
          return state;
        }
    case IgEditActionTypes.EditorChange:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          current: {
            ...action.payload.data,
          },
          changeTime: action.payload.date,
          flags: {
            changed: true,
            valid: action.payload.valid,
          },
        },
      };

    case IgEditActionTypes.EditorReset:
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
          },
        },
      };
    case IgEditActionTypes.EditorSaveSuccess:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          changeTime: new Date(),
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

    case IgEditActionTypes.UpdateActiveResource:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          active: {
            ...state.workspace.active,
            display: {
              ...action.payload,
            },
          },
        },
      };

    case IgEditActionTypes.TableOfContentSaveSuccess:
      return {
        ...state,
        tableOfContentEdit: {
          changed: false,
        },
      };

    case IgEditActionTypes.UpdateSections:
      const content: IContent[] = IgTOCNodeHelper.updateSections(action.payload);
      const sectionList: IDisplayElement[] = IgTOCNodeHelper.getIDisplayFromSections(content, '');
      return {
        ...state,
        tableOfContentEdit: {
          changed: true,
        },
        document: { ...state.document, content },
        sections: igElementAdapter.upsertMany(sectionList, state.sections),
      };

    case IgEditActionTypes.CollapseTOC:
      return {
        ...state,
        tocCollapsed: true,
      };

    case IgEditActionTypes.ToggleFullScreen:
      return {
        ...state,
        fullscreen: !state.fullscreen,
      };

    case IgEditActionTypes.ExpandTOC:
      return {
        ...state,
        tocCollapsed: false,
      };
    default:
      return state;
  }
}
