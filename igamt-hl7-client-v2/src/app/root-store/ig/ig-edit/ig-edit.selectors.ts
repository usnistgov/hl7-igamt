import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { IResourceMetadata } from 'src/app/modules/core/components/resource-metadata-editor/resource-metadata-editor.component';
import { IConformanceProfile } from 'src/app/modules/shared/models/conformance-profile.interface';
import { IWorkspace } from 'src/app/modules/shared/models/editor.class';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { IgTOCNodeHelper } from '../../../modules/ig/services/ig-toc-node-helper.service';
import { Scope } from '../../../modules/shared/constants/scope.enum';
import { Type } from '../../../modules/shared/constants/type.enum';
import { Status } from '../../../modules/shared/models/abstract-domain.interface';
import { ICoConstraintGroup } from '../../../modules/shared/models/co-constraint.interface';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { ILink } from '../../../modules/shared/models/link.interface';
import { IRegistry } from '../../../modules/shared/models/registry.interface';
import { IValueSet } from '../../../modules/shared/models/value-set.interface';
import { selectIgEdit } from '../ig.reducer';
import { ITitleBarMetadata } from './../../../modules/ig/components/ig-edit-titlebar/ig-edit-titlebar.component';
import { IDatatype } from './../../../modules/shared/models/datatype.interface';
import { igElementAdapter, IResourcesState, IState, loadedResourceAdapter } from './ig-edit.reducer';

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = igElementAdapter.getSelectors();

export const loadedResourceAdapterSelectors = loadedResourceAdapter.getSelectors();

export const selectIgDocument = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.document;
  },
);

export const selectFullScreen = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state ? state.fullscreen : false;
  },
);

export const selectResources = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.resources;
  },
);

export const selectSelectedResource = createSelector(
  selectResources,
  (state: IResourcesState) => {
    return state.selected;
  },
);

export const selectedResourceHasOrigin = createSelector(
  selectSelectedResource,
  (state: IResource) => {
    return !!state.origin;
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
    };
  },
);

export const selectedResourcePostDef = createSelector(
  selectSelectedResource,
  (state: IResource) => {
    return state.postDef;
  },
);

export const selectLoadedResource = createSelector(
  selectResources,
  (state: IResourcesState) => {
    return state.resources;
  },
);

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

export const selectLoadedResourceEntities = createSelector(
  selectLoadedResource,
  loadedResourceAdapterSelectors.selectEntities,
);

export const selectLoadedResourceById = createSelector(
  selectLoadedResourceEntities,
  (resources: Dictionary<IResource>, props: { id: string }): IResource => {
    return resources[props.id];
  },
);

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

export const selectTocCollapsed = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.tocCollapsed;
  },
);

export const selectIgId = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.id;
  },
);

export const selectDerived = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.derived;
  },
);
export const selectTableOfContentEdit = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.tableOfContentEdit;
  },
);

export const selectTableOfContentChanged = createSelector(
  selectTableOfContentEdit,
  (state: { changed: boolean; }) => {
    return state.changed;
  },
);

export const selectWorkspace = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.workspace;
  },
);

export const selectWorkspaceActive = createSelector(
  selectWorkspace,
  (state: IWorkspace) => {
    return state.active;
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

export const selectWorkspaceOrTableOfContentChanged = createSelector(
  selectWorkspaceCurrentIsChanged,
  selectTableOfContentChanged,
  (workspace: boolean, tocChanged: boolean) => {
    return workspace || tocChanged;
  },
);

export const selectTitleBar = createSelector(
  selectIgDocument,
  (document: IgDocument): ITitleBarMetadata => {
    return {
      title: document.metadata.title,
      domainInfo: document.domainInfo,
      creationDate: document.creationDate,
      updateDate: document.updateDate,
    };
  },
);

export const selectViewOnly = createSelector(
  selectIgDocument,
  (document: IgDocument): boolean => {
    return document.domainInfo.scope !== Scope.USER || document.status === Status.PUBLISHED;
  },
);

export const selectDatatypeRegistry = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.datatypeRegistry;
  },
);
export const selectSegmentRegistry = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.segmentRegistry;
  },
);
export const selectValueSetRegistry = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.valueSetRegistry;
  },
);
export const selectConformanceProfileRegistry = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.conformanceProfileRegistry;
  },
);
export const selectCoConstraintGroupRegistry = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.coConstraintGroupRegistry;
  },
);

export const selectSegments = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.segments;
  },
);

export const selectDatatypes = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.datatypes;
  },
);

export const selectSections = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.sections;
  },
);

export const selectDatatypesEntites = createSelector(
  selectDatatypes,
  selectEntities,
);

export const selectAllDatatypes = createSelector(
  selectDatatypes,
  selectAll,
);

export const selectSegmentsEntites = createSelector(
  selectSegments,
  selectEntities,
);

export const selectAllSegments = createSelector(
  selectSegments,
  selectAll,
);

export const selectDatatypesById = createSelector(
  selectDatatypesEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

export const selectSegmentsById = createSelector(
  selectSegmentsEntites,
  (dictionary: Dictionary<IDisplayElement>, props: { id: string }) => {
    return dictionary[props.id];
  },
);

export const selectSectionsEntities = createSelector(
  selectSections,
  selectEntities,
);

export const selectSectionDisplayById = createSelector(
  selectSectionsEntities,
  (sections: Dictionary<IDisplayElement>, props: { id: string }) => {
    return sections[props.id];
  },
);

export const selectSectionFromIgById = createSelector(
  selectIgDocument,
  (ig: IgDocument, props: { id: string }) => {
    const loop = (content: IContent[]) => {
      for (const section of content) {
        if (section.id === props.id) {
          return section;
        } else {
          const found = loop(section.children);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };
    return loop(ig.content);
  },
);

export const selectValueSets = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.valueSets;
  },
);
export const selectAllValueSets = createSelector(
  selectValueSets,
  selectAll,
);
export const selectDelta = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.delta;
  },
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

export const selectMessages = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.messages;
  },
);
export const selectAllMessages = createSelector(
  selectMessages,
  selectAll,
);

export const selectCoConstraintGroups = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.coConstraintGroups;
  },
);

export const selectCoConstraintGroupEntites = createSelector(
  selectCoConstraintGroups,
  selectEntities,
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

export const selectValueSetsNodes = createSelector(
  selectValueSetsEntities,
  selectValueSetRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistry(nodes, registry);
  },
);

export const selectSegmentsNodes = createSelector(
  selectSegmentsEntites,
  selectSegmentRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistry(nodes, registry);
  },
);

export const selectDatatypesNodes = createSelector(
  selectDatatypesEntites,
  selectDatatypeRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistry(nodes, registry);
  },
);

export const selectCoConstraintGroupNodes = createSelector(
  selectCoConstraintGroupEntites,
  selectCoConstraintGroupRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistry(nodes, registry);
  },
);

export const selectMessagesNodes = createSelector(
  selectMessagesEntites,
  selectConformanceProfileRegistry,
  (messages: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistry(messages, registry);
  },
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

export const selectStructure = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.content;
  },
);

export const selectToc = createSelector(
  selectStructure,
  selectMessagesNodes,
  selectSegmentsNodes,
  selectDatatypesNodes,
  selectValueSetsNodes,
  selectCoConstraintGroupNodes, (
    structure: IContent[],
    messageNodes: IDisplayElement[],
    segmentsNodes: IDisplayElement[],
    datatypesNodes: IDisplayElement[],
    valueSetsNodes: IDisplayElement[],
    coConstraintGroupNodes: IDisplayElement[],
) => {
  return IgTOCNodeHelper.buildTree(structure, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes, coConstraintGroupNodes);
},
);

export const selectProfileTree = createSelector(
  selectStructure,
  selectMessagesNodes,
  selectSegmentsNodes,
  selectDatatypesNodes,
  selectValueSetsNodes,
  selectCoConstraintGroupNodes, (
    structure: IContent[],
    messageNodes: IDisplayElement[],
    segmentsNodes: IDisplayElement[],
    datatypesNodes: IDisplayElement[],
    valueSetsNodes: IDisplayElement[],
    coConstraintGroupNodes: IDisplayElement[],
) => {
  return IgTOCNodeHelper.buildProfileTree(structure, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes, coConstraintGroupNodes);
},
);

export const selectVersion = createSelector(
  selectMessagesEntites,
  (messages: Dictionary<IDisplayElement>) => {
    const sorted = Object.keys(messages).map((key) => messages[key].domainInfo.version).sort();
    return sorted[sorted.length - 1];
  });

export const selectIgVersions = createSelector(
  selectMessagesEntites,
  (messages: Dictionary<IDisplayElement>): string[] => {
    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    return Object.keys(messages).map((key) => messages[key].domainInfo.version).filter(distinct);
  });
