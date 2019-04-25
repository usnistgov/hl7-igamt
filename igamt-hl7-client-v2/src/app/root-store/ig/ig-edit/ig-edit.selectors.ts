import {Dictionary} from '@ngrx/entity';
import {createSelector} from '@ngrx/store';
import {
  IContent,
  IDisplayElement,
  IgDocument,
  IRegistry,
  IResource,
} from '../../../modules/ig/models/ig/ig-document.class';
import {Scope} from '../../../modules/shared/constants/scope.enum';
import {Type} from '../../../modules/shared/constants/type.enum';
import {selectIgEdit} from '../ig.reducer';
import {ITitleBarMetadata} from './../../../modules/ig/components/ig-edit-titlebar/ig-edit-titlebar.component';
import {igElementAdapter, IState} from './ig-edit.reducer';

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = igElementAdapter.getSelectors();

export const selectIgDocument = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.document;
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
    return document.domainInfo.scope !== Scope.USER;
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

export const selectDatatypesEntites = createSelector(
  selectDatatypes,
  selectEntities,
);
export const selectSegmentsEntites = createSelector(
  selectSegments,
  selectEntities,
);

export const selectValueSets = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.valueSets;
  },
);
export const selectValueSetsEntities = createSelector(
  selectValueSets,
  selectEntities,
);

export const selectMessages = createSelector(
  selectIgEdit,
  (state: IState) => {
    return state.messages;
  },
);
export const selectMessagesEntites = createSelector(
  selectMessages,
  selectEntities,
);

export const selectValueSetsNodes = createSelector(
  selectValueSetsEntities,
  selectValueSetRegistry,
  (messages: Dictionary<IDisplayElement> , registry: IRegistry ) => {
    return registry.children.sort((a: IResource, b: IResource ) => a.position - b.position).map((link) => messages[link.id]);
  },
);

export const selectSegmentsNodes = createSelector(
  selectSegmentsEntites,
  selectSegmentRegistry,
  (messages: Dictionary<IDisplayElement> , registry: IRegistry ) => {
    return registry.children.sort((a: IResource, b: IResource ) => a.position - b.position).map((link) => messages[link.id]);
  },
);

export const selectDatatypesNodes = createSelector(
  selectDatatypesEntites,
  selectDatatypeRegistry,
  (messages: Dictionary<IDisplayElement> , registry: IRegistry ) => {
    return registry.children.sort((a: IResource, b: IResource ) => a.position - b.position).map((link) => messages[link.id]);
  },
);

export const selectMessagesNodes = createSelector(
  selectMessagesEntites,
  selectConformanceProfileRegistry,
  (messages: Dictionary<IDisplayElement> , registry: IRegistry ) => {
    return registry.children.sort((a: IResource, b: IResource ) => a.position - b.position).map((link) => messages[link.id]);
  },
);

function initializeIDisplayElement(section: IContent) {
  return {
    description: section.description,
    id: section.id,
    domainInfo: null,
    differantial: false,
    variableName: section.label,
    children: [],
    type: section.type,
    position: section.position,
    fixedName: null,
    leaf: false,
    isExpanded: true,
  };
}

function sort(children: IDisplayElement[] ) {
  return children.sort((a: IDisplayElement, b: IDisplayElement ) => a.position - b.position);
}

function createNarativeSection(section: IContent): IDisplayElement  {
  const ret = initializeIDisplayElement(section);
  if (section.children && section.children.length > 0) {
    for (const child of section.children) {
      ret.children.push(createNarativeSection(child));
    }
  }
  ret.children = sort(ret.children);
  return ret;
}
function createProfileSection(section: IContent, messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[]) {
  const ret = initializeIDisplayElement(section);
  if (section.children && section.children.length > 0) {
    for (const child of section.children) {
      const retChild = initializeIDisplayElement(child);
      switch (child.type) {
        case Type.CONFORMANCEPROFILEREGISTRY:
          retChild.children = messageNodes;
          break;
        case Type.SEGMENTREGISTRY:
          retChild.children = segmentsNodes;
          break;
        case Type.DATATYPEREGISTRY:
          retChild.children = datatypesNodes;
          break;
        case Type.VALUESETREGISTRY:
          retChild.children = valueSetsNodes;
      }
      ret.children.push(retChild);
    }
  }
  ret.children = sort(ret.children);
  return ret;
}

export function buildTree(structure: IContent[], messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[]) {
  const ret: IDisplayElement[] = [];
  for (const section of structure) {
    switch (section.type) {
      case Type.TEXT:
            ret.push(createNarativeSection(section));
            break;
      case Type.PROFILE:
            ret.push(createProfileSection(section, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes));
            break;
      default: break;
    }
  }
  return ret;
}

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
  selectValueSetsNodes, (structure, messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[],
                         datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[]) => {
    return buildTree(structure, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes);
  },
);
