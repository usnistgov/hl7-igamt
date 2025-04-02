import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { ICodeSetInfo, ICodeSetVersionInfo } from 'src/app/modules/code-set-editor/models/code-set.models';
import { selectFromCollection, selectPayloadData } from '../../../modules/dam-framework/store/data/dam.selectors';

export const selectCodeSetInfo = createSelector(
  selectPayloadData,
  (state: ICodeSetInfo) => {
    return state;
  },
);

export const selectCodeSetId = createSelector(
  selectCodeSetInfo,
  (state: ICodeSetInfo) => {
    return state.id;
  },
);

export const selectCodeSetMetadata = createSelector(
  selectCodeSetInfo,
  (state: ICodeSetInfo) => {
    return state.metadata;
  },
);

export const selectCodeSetIsViewOnly = createSelector(
  selectCodeSetInfo,
  (state: ICodeSetInfo) => {
    return state.viewOnly;
  },
);

export const selectCodeSetIsPublic = createSelector(
  selectCodeSetInfo,
  (state: ICodeSetInfo) => {
    return state.published;
  },
);

export const selectCodeSetFolders = createSelector(
  selectCodeSetInfo,
  (state: ICodeSetInfo) => {
    return state.metadata;
  },
);

export const displayEntityAdapter = createEntityAdapter<ICodeSetVersionInfo>();
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = displayEntityAdapter.getSelectors();

export const selectCodeSetVersions = selectFromCollection<ICodeSetVersionInfo>('codeSetVersions');
export const selectCodeSetVersionsEntites = createSelector(
  selectCodeSetVersions,
  selectEntities,
);
export const selectAllCodeSetVersions = createSelector(
  selectCodeSetVersions,
  selectAll,
);
export const selectCodeSetVersionById = createSelector(
  selectCodeSetVersionsEntites,
  (dictionary: Dictionary<ICodeSetVersionInfo>, props: { id: string }) => {
    return dictionary[props.id];
  },
);
