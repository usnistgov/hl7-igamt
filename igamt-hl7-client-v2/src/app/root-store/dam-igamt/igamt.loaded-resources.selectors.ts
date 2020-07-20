import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { Type } from '../../modules/shared/constants/type.enum';
import { IDatatype } from '../../modules/shared/models/datatype.interface';
import { IResource } from '../../modules/shared/models/resource.interface';
import { ISegment } from '../../modules/shared/models/segment.interface';

export const resourceAdapter = createEntityAdapter<IResource>();
export const resourceAdapterSelectors = resourceAdapter.getSelectors();

// GET 'resources' collection from DAM repository
export const selectLoadedResource = fromDAM.selectFromCollection<IResource>('resources');

export const selectLoadedResourceEntities = createSelector(
  selectLoadedResource,
  resourceAdapterSelectors.selectEntities,
);

// RESOURCES GETTERS
export const selectLoadedResourceById = createSelector(
  selectLoadedResourceEntities,
  (resources: Dictionary<IResource>, props: { id: string }): IResource => {
    return resources[props.id];
  },
);

export const selectLoadedSegmentById = createSelector(
  selectLoadedResourceById,
  (resource: IResource): ISegment => {
    if (resource && resource.type === Type.SEGMENT) {
      return resource as ISegment;
    }
  },
);

export const selectLoadedDatatypeById = createSelector(
  selectLoadedResourceById,
  (resource: IResource): IDatatype => {
    if (resource && resource.type === Type.SEGMENT) {
      return resource as IDatatype;
    }
  },
);

// RESOURCES INFO GETTERS
export const selectReferencesAreLeaf = createSelector(
  selectLoadedResourceEntities,
  (resources: Dictionary<IResource>, props: { ids: string[] }): { [id: string]: boolean } => {
    const leafs = {};
    props.ids.forEach((id) => {
      if (resources[id]) {
        switch (resources[id].type) {
          case Type.SEGMENT:
            leafs[id] = !(resources[id] as ISegment).children || (resources[id] as ISegment).children.length === 0;
            break;
          case Type.DATATYPE:
            leafs[id] = !(resources[id] as IDatatype).components || (resources[id] as IDatatype).components.length === 0;
            break;
        }
      }
    });
    return leafs;
  },
);
