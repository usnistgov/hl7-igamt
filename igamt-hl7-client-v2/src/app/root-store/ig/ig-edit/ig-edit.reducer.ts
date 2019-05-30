import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IWorkspace } from 'src/app/modules/shared/models/editor.class';
import { IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { IgTOCNodeHelper } from '../../../modules/ig/services/ig-toc-node-helper.service';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { IgEditActions, IgEditActionTypes } from './ig-edit.actions';

export interface IState {
  document: IgDocument;
  tocCollapsed: boolean;
  tableOfContentEdit: {
    changed: boolean;
  };
  segments: EntityState<IDisplayElement>;
  valueSets: EntityState<IDisplayElement>;
  datatypes: EntityState<IDisplayElement>;
  messages: EntityState<IDisplayElement>;
  sections: EntityState<IDisplayElement>;
  workspace: IWorkspace;
}

export const initialState: IState = {
  document: null,
  tocCollapsed: false,
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

    case IgEditActionTypes.EditorChange:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          current: action.payload.data,
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
            ... (action.current ? action.current : state.workspace.current),
          },
          initial: {
            ... (action.current ? action.current : state.workspace.current),
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

    case IgEditActionTypes.ExpandTOC:
      return {
        ...state,
        tocCollapsed: false,
      };
    default:
      return state;
  }
}
