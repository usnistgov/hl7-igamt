import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { selectUsername } from 'src/app/modules/dam-framework/store/authentication';
import { selectFromCollection, selectPayloadData } from '../../../modules/dam-framework/store/data/dam.selectors';
import { IFolderInfo, IWorkspaceInfo } from '../../../modules/workspace/models/models';

export const selectWorkspaceInfo = createSelector(
  selectPayloadData,
  (state: IWorkspaceInfo) => {
    return state;
  },
);

export const selectIsWorkspaceAdmin = createSelector(
  selectWorkspaceInfo,
  (state: IWorkspaceInfo) => {
    return state.admin;
  },
);

export const selectWorkspaceId = createSelector(
  selectWorkspaceInfo,
  (state: IWorkspaceInfo) => {
    return state.id;
  },
);

export const selectWorkspaceOwner = createSelector(
  selectWorkspaceInfo,
  (state: IWorkspaceInfo) => {
    return state.owner;
  },
);

export const selectIsWorkspaceOwner = createSelector(
  selectWorkspaceInfo,
  selectUsername,
  (state: IWorkspaceInfo, username: string) => {
    return state.owner === username;
  },
);

export const selectWorkspaceHomePage = createSelector(
  selectWorkspaceInfo,
  (state: IWorkspaceInfo) => {
    return state.homePageContent;
  },
);

export const selectWorkspaceMetadata = createSelector(
  selectWorkspaceInfo,
  (state: IWorkspaceInfo) => {
    return state.metadata;
  },
);

export const selectWorkspaceFolders = createSelector(
  selectWorkspaceInfo,
  (state: IWorkspaceInfo) => {
    return state.metadata;
  },
);

export const displayEntityAdapter = createEntityAdapter<IFolderInfo>();
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = displayEntityAdapter.getSelectors();

export const selectFolders = selectFromCollection<IFolderInfo>('folders');
export const selectFolderEntites = createSelector(
  selectFolders,
  selectEntities,
);
export const selectAllFolders = createSelector(
  selectFolders,
  selectAll,
);
export const selectFolderById = createSelector(
  selectFolderEntites,
  (dictionary: Dictionary<IFolderInfo>, props: { id: string }) => {
    return dictionary[props.id];
  },
);
