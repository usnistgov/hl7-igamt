import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IDisplayElement } from '../../modules/shared/models/display-element.interface';

export const displayEntityAdapter = createEntityAdapter<IDisplayElement>();
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = displayEntityAdapter.getSelectors();

// DATATYPE DISPLAY GETTERS
export const selectDatatypes = fromDAM.selectFromCollection<IDisplayElement>('datatypes');
export const selectDatatypesEntites = createSelector(
  selectDatatypes,
  selectEntities,
);
export const selectAllDatatypes = createSelector(
  selectDatatypes,
  selectAll,
);
export const selectDatatypesById = createSelector(
  selectDatatypesEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

// SEGMENT DISPLAY GETTERS
export const selectSegments = fromDAM.selectFromCollection<IDisplayElement>('segments');
export const selectSegmentsEntites = createSelector(
  selectSegments,
  selectEntities,
);

export const selectAllSegments = createSelector(
  selectSegments,
  selectAll,
);
export const selectSegmentsById = createSelector(
  selectSegmentsEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

// SECTION DISPLAY GETTERS
export const selectSections = fromDAM.selectFromCollection<IDisplayElement>('sections');
export const selectSectionsEntities = createSelector(
  selectSections,
  selectEntities,
);
export const selectSectionDisplayById = createSelector(
  selectSectionsEntities,
  (sections: Dictionary<IDisplayElement>, props: { id: string }) => {
    console.log(sections);
    return sections[props.id];
  },
);

// VALUESET DISPLAY GETTERS
export const selectValueSets = fromDAM.selectFromCollection<IDisplayElement>('valueSets');
export const selectAllValueSets = createSelector(
  selectValueSets,
  selectAll,
);
export const selectValueSetsEntities = createSelector(
  selectValueSets,
  selectEntities,
);
export const selectValueSetById = createSelector(
  selectValueSetsEntities,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

// MESSAGE DISPLAY GETTERS
export const selectMessages = fromDAM.selectFromCollection<IDisplayElement>('messages');
export const selectProfileComponents = fromDAM.selectFromCollection<IDisplayElement>('profileComponents');

export const selectCompositeProfiles = fromDAM.selectFromCollection<IDisplayElement>('compositeProfiles');

export const selectAllMessages = createSelector(
  selectMessages,
  selectAll,
);

export const selectMessagesEntites = createSelector(
  selectMessages,
  selectEntities,
);
export const selectMessagesById = createSelector(
  selectMessagesEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

export const selectProfileComponentsEntites = createSelector(
  selectProfileComponents,
  selectEntities,
);

export const selectProfileComponentById = createSelector(
  selectProfileComponentsEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

export const selectContexts = fromDAM.selectFromCollection<IDisplayElement>('contexts');
export const selectContextEntites = createSelector(
  selectContexts,
  selectEntities,
);
export const selectAllContexts = createSelector(
  selectContexts,
  selectAll,
);
export const selectContextById = createSelector(
  selectContextEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

export const selectCompositeProfilesEntites = createSelector(
  selectCompositeProfiles,
  selectEntities,
);
// COCONSTRAINT GROUP DISPLAY GETTERS
export const selectCoConstraintGroups = fromDAM.selectFromCollection<IDisplayElement>('coConstraintGroups');
export const selectCoConstraintGroupEntites = createSelector(
  selectCoConstraintGroups,
  selectEntities,
);
export const selectCoConstraintGroupsById = createSelector(
  selectCoConstraintGroupEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);
export const selectAllCoConstraintGroups = createSelector(
  selectCoConstraintGroups,
  selectAll,
);
