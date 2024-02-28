import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { selectFromCollection, selectPayloadData } from '../../../modules/dam-framework/store/data/dam.selectors';
import { ICodeSetInfo, ICodeSetVersionInfo } from 'src/app/modules/code-set-editor/models/code-set.models';

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
export const selectFolderById = createSelector(
  selectCodeSetVersionsEntites,
  (dictionary: Dictionary<ICodeSetVersionInfo>, props: { id: string }) => {
    return dictionary[props.id];
  },
);
