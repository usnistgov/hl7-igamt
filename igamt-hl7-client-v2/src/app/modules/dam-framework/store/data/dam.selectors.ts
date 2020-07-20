import { EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IDamResource, IRepositoryStore } from '../../models/data/repository';
import { IDamDataModel } from '../../models/data/state';
import { IWorkspace, IWorkspaceActive } from '../../models/data/workspace';

export const featureName = 'damf-data-editor';
export const selectDamfFeature = createFeatureSelector(featureName);

export const selectSetup = createSelector(
  selectDamfFeature,
  (state: IDamDataModel) => {
    return state ? state.setup : undefined;
  },
);

export const selectWidgetId = createSelector(
  selectSetup,
  (state) => {
    return state.widgetId;
  },
);

export const selectIsBootstrapped = createSelector(
  selectSetup,
  (state, props) => {
    return state.bootstrapped && state.widgetId === props.id;
  },
);

export const selectUI = createSelector(
  selectDamfFeature,
  (state: IDamDataModel) => {
    return state ? state.ui : undefined;
  },
);

export const selectIsFullScreen = createSelector(
  selectUI,
  (ui: any) => {
    return ui ? ui.fullscreen : false;
  },
);

export const selecIsSideBarCollaped = createSelector(
  selectUI,
  (ui: any) => {
    return ui.sideBarCollapsed;
  },
);

export const selectPayload = createSelector(
  selectDamfFeature,
  (state: IDamDataModel) => {
    return state ? state.payload : undefined;
  },
);

export const selectPayloadData = createSelector(
  selectPayload,
  (state: any) => {
    return state ? state.data : undefined;
  },
);

export const selectWorkspace = createSelector(
  selectDamfFeature,
  (state: IDamDataModel) => {
    return state.workspace;
  },
);

export const selectWorkspaceActive = createSelector(
  selectWorkspace,
  (state: IWorkspace) => {
    return state.active;
  },
);

export const selectWorkspaceHasActive = createSelector(
  selectWorkspaceActive,
  (state: IWorkspaceActive) => {
    return !!state;
  },
);

export const selectWorkspaceCurrentIsValid = createSelector(
  selectWorkspace,
  (state: IWorkspace) => {
    return state.flags.valid;
  },
);

export const selectWorkspaceCurrentChangeTime = createSelector(
  selectWorkspace,
  (state: IWorkspace) => {
    return state.changeTime;
  },
);

export const selectWorkspaceCurrent = createSelector(
  selectWorkspace,
  selectWorkspaceCurrentIsValid,
  selectWorkspaceCurrentChangeTime,
  (state: IWorkspace, valid: boolean, time: Date) => {
    return {
      data: state.current,
      valid,
      time,
    };
  },
);

export const selectWorkspaceCurrentIsChanged = createSelector(
  selectWorkspace,
  (state: IWorkspace) => {
    return state.flags.changed;
  },
);

export const selectRepository = createSelector(
  selectDamfFeature,
  (state: IDamDataModel) => {
    return state.repository;
  },
);

export const selectValues = createSelector(
  selectDamfFeature,
  (state: IDamDataModel) => {
    return state.values;
  },
);

export function selectCollection<T extends IDamResource>(collection: string): (IRepositoryStore) => EntityState<T> {
  return (repository: IRepositoryStore) => repository.collections[collection] as EntityState<T>;
}

export function selectFromCollection<T extends IDamResource>(collection: string): MemoizedSelector<object, EntityState<T>> {
  return createSelector(
    selectRepository,
    selectCollection<T>(collection),
  );
}

export function selectValue<T>(key: string): MemoizedSelector<object, T> {
  return createSelector(
    selectValues,
    (values: any) => {
      if (values[key]) {
        return values[key] as T;
      } else {
        return undefined;
      }
    },
  );
}
