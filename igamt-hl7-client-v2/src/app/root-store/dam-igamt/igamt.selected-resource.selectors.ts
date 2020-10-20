import { createSelector } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IResourceMetadata } from '../../modules/core/components/resource-metadata-editor/resource-metadata-editor.component';
import { Type } from '../../modules/shared/constants/type.enum';
import { ICoConstraintGroup } from '../../modules/shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../modules/shared/models/conformance-profile.interface';
import { IDatatype } from '../../modules/shared/models/datatype.interface';
import { IResource } from '../../modules/shared/models/resource.interface';
import { ISegment } from '../../modules/shared/models/segment.interface';
import { IValueSet } from '../../modules/shared/models/value-set.interface';

// SELECT 'SELECTED' attribute from DAM state
export const selectSelectedResource = fromDAM.selectValue<IResource>('selected');

// SELECTED RESOURCE GETTERS
export const selectedConformanceProfile = createSelector(
  selectSelectedResource,
  (state: IResource): IConformanceProfile => {
    if (state && state.type === Type.CONFORMANCEPROFILE) {
      return state as IConformanceProfile;
    } else {
      return undefined;
    }
  },
);

export const selectedDatatype = createSelector(
  selectSelectedResource,
  (state: IResource): IDatatype => {
    if (state && state.type === Type.DATATYPE) {
      return state as IDatatype;
    } else {
      return undefined;
    }
  },
);

export const selectedCoConstraintGroup = createSelector(
  selectSelectedResource,
  (state: IResource): ICoConstraintGroup => {
    if (state && state.type === Type.COCONSTRAINTGROUP) {
      return state as ICoConstraintGroup;
    } else {
      return undefined;
    }
  },
);

export const selectedSegment = createSelector(
  selectSelectedResource,
  (state: IResource): ISegment => {
    if (state && state.type === Type.SEGMENT) {
      return state as ISegment;
    } else {
      return undefined;
    }
  },
);

export const selectedValueSet = createSelector(
  selectSelectedResource,
  (state: IResource): IValueSet => {
    if (state && state.type === Type.VALUESET) {
      return state as IValueSet;
    } else {
      return undefined;
    }
  },
);

// SELECTED RESOURCE INFO GETTERS
export const selectedResourceHasOrigin = createSelector(
  selectSelectedResource,
  (state: IResource) => {
    return state.derived;
  },
);

export const selectedResourcePreDef = createSelector(
  selectSelectedResource,
  (state: IResource) => {
    return state.preDef;
  },
);

export const selectedResourceMetadata = createSelector(
  selectSelectedResource,
  (state: any): IResourceMetadata => {
    return {
      name: state.name,
      bindingIdentifier: state.bindingIdentifier,
      ext: (state.type === Type.DATATYPE ? (state as IDatatype).ext : state.type === Type.SEGMENT) ? (state as ISegment).ext : undefined,
      description: state.description,
      authorNotes: state.authorNotes,
      usageNotes: state.usageNotes,
      compatibilityVersions: state.compatibilityVersions,
      shortDescription: state.shortDescription,
    };
  },
);

export const selectedResourcePostDef = createSelector(
  selectSelectedResource,
  (state: IResource) => {
    return state.postDef;
  },
);
