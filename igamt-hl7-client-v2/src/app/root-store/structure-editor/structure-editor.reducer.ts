import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IDisplayElement } from '../../modules/shared/models/display-element.interface';

export const adapter = createEntityAdapter<IDisplayElement>();
export const adapterSelectors = adapter.getSelectors();

export const selectMessageStructuresCollection = fromDAM.selectFromCollection('message-structures');

export const selectMessageStructures = createSelector(
  selectMessageStructuresCollection,
  adapterSelectors.selectAll,
);

export const selectMessageStructureEntities = createSelector(
  selectMessageStructuresCollection,
  adapterSelectors.selectEntities,
);

export const selectMessageStructureById = createSelector(
  selectMessageStructureEntities,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

export const selectSegmentStructuresCollection = fromDAM.selectFromCollection('segment-structures');

export const selectSegmentStructures = createSelector(
  selectSegmentStructuresCollection,
  adapterSelectors.selectAll,
);

export const selectSegmentEntities = createSelector(
  selectSegmentStructuresCollection,
  adapterSelectors.selectEntities,
);

export const selectSegmentStructureById = createSelector(
  selectSegmentEntities,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);
