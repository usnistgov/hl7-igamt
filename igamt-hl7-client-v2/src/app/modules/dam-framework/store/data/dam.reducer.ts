import { createEntityAdapter } from '@ngrx/entity';
import * as _ from 'lodash';
import { emptyRepository, ICollections, IDamResource } from '../../models/data/repository';
import { emptyDataModel, IDamDataModel } from '../../models/data/state';
import { emptyWorkspace } from '../../models/data/workspace';
import { DamActions, DamActionTypes } from './dam.actions';

export const initialState: IDamDataModel = emptyDataModel;
export const repositoryAdapter = createEntityAdapter<IDamResource>();

// tslint:disable-next-line: cognitive-complexity  no-big-function
export function reducer(state = initialState, action: DamActions): IDamDataModel {
  const current: ICollections = state.repository.collections;
  switch (action.type) {

    case DamActionTypes.InitWidgetId:
      return {
        ...state,
        setup: {
          widgetId: action.id,
          bootstrapped: false,
        },
      };

    case DamActionTypes.CloseAndClearState:
      return {
        ...initialState,
      };

    case DamActionTypes.ClearWidgetId:
      return {
        ...state,
        setup: {
          widgetId: undefined,
          bootstrapped: false,
        },
      };

    case DamActionTypes.CleanStateData:
      return {
        ...initialState,
        setup: state.setup,
        ui: state.ui,
      };

    case DamActionTypes.CleanWorkspace:
      return {
        ...state,
        values: {},
        repository: emptyRepository,
        workspace: emptyWorkspace,
      };

    case DamActionTypes.BootstrapWidget:
      return {
        ...state,
        setup: {
          ...state.setup,
          bootstrapped: true,
        },
      };

    case DamActionTypes.LoadPayloadData:
      return {
        ...state,
        payload: {
          data: action.payload,
          timestamp: new Date(),
        },
      };

    case DamActionTypes.OpenEditor:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          active: {
            display: {
              ...action.payload.display,
            },
            editor: action.payload.editor,
          },
          initial: {
            ...action.payload.initial,
          },
          current: {
            ..._.cloneDeep(action.payload.initial),
          },
          verification: {
            ...emptyWorkspace.verification,
            entries: [],
          },
          changeTime: new Date(),
          flags: {
            changed: false,
            valid: true,
          },
        },
      };

    case DamActionTypes.EditorChange:
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

    case DamActionTypes.EditorReset:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          changeTime: new Date(),
          current: {
            ..._.cloneDeep(state.workspace.initial),
          },
          flags: {
            ...state.workspace.flags,
            changed: false,
            valid: true,
          },
        },
      };

    case DamActionTypes.EditorSaveSuccess:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          initial: {
            ..._.cloneDeep(state.workspace.current),
          },
          flags: {
            ...state.workspace.flags,
            changed: false,
          },
        },
      };

    case DamActionTypes.EditorUpdate:
      const currentWs = (action.payload.value ? action.payload.value : state.workspace.current);
      const initialWs = _.cloneDeep(currentWs);
      return {
        ...state,
        workspace: {
          ...state.workspace,
          changeTime: action.payload.updateDate ? new Date() : state.workspace.changeTime,
          current: currentWs,
          initial: initialWs,
        },
      };

    case DamActionTypes.EditorVerificationResult:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          verification: {
            supported: action.payload.supported,
            endpoint: action.payload.url,
            verificationTime: new Date(),
            entries: action.payload.entries,
            loading: false,
            failed: false,
            failure: undefined,
          },
        },
      };

    case DamActionTypes.EditorVerificationFailure:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          verification: {
            ...state.workspace.verification,
            supported: true,
            verificationTime: new Date(),
            loading: false,
            failed: true,
            failure: action.payload.message,
          },
        },
      };

    case DamActionTypes.EditorVerify:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          verification: {
            ...state.workspace.verification,
            loading: true,
          },
        },
      };

    case DamActionTypes.UpdateActiveResource:
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

    case DamActionTypes.SetValue:
      return {
        ...state,
        values: {
          ...state.values,
          ...action.payload,
        },
      };

    case DamActionTypes.SetUIStateValue:
      return {
        ...state,
        ui: {
          ...state.ui,
          state: {
            ...state.ui.state,
            ...action.payload,
          },
        },
      };

    case DamActionTypes.LoadResourcesInRepostory:
      const loaded: ICollections = {};
      action.payload.collections.forEach((value) => {
        loaded[value.key] = repositoryAdapter.addAll(value.values, repositoryAdapter.getInitialState());
      });
      return {
        ...state,
        repository: {
          collections: {
            ...state.repository.collections,
            ...loaded,
          },
        },
      };

    case DamActionTypes.InsertResourcesInRepostory:
      action.payload.collections.forEach((value) => {
        current[value.key] = repositoryAdapter.upsertMany(value.values, current[value.key] ? current[value.key] : repositoryAdapter.getInitialState());
      });

      return {
        ...state,
        repository: {
          collections: current,
        },
      };

    case DamActionTypes.DeleteResourcesFromRepostory:
      action.payload.collections.forEach((value) => {
        current[value.key] = repositoryAdapter.removeMany(value.values, current[value.key]);
      });

      return {
        ...state,
        repository: {
          collections: current,
        },
      };

    case DamActionTypes.LoadForRouteSuccess:
      const repository: ICollections = state.repository.collections;
      repository[action.payload.collection] = repositoryAdapter.upsertOne(action.payload.resource, repository[action.payload.collection] || repositoryAdapter.getInitialState());
      return {
        ...state,
        repository: {
          collections: repository,
        },
      };

    case DamActionTypes.ClearRepository:
      return {
        ...state,
        repository: {
          collections: {},
        },
      };

    case DamActionTypes.CollapseSideBar:
      return {
        ...state,
        ui: {
          ...state.ui,
          sideBarCollapsed: true,
        },
      };

    case DamActionTypes.CollapseBottomDrawer:
      return {
        ...state,
        ui: {
          ...state.ui,
          bottomDrawerCollapsed: true,
        },
      };

    case DamActionTypes.ToggleFullScreen:
      return {
        ...state,
        ...state,
        ui: {
          ...state.ui,
          fullscreen: !state.ui.fullscreen,
        },
      };

    case DamActionTypes.ExpandSideBar:
      return {
        ...state,
        ui: {
          ...state.ui,
          sideBarCollapsed: false,
        },
      };

    case DamActionTypes.ExpandBottomDrawer:
      return {
        ...state,
        ui: {
          ...state.ui,
          bottomDrawerCollapsed: false,
        },
      };
    default:
      return state;
  }
}
