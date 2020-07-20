import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { IgTOCNodeHelper } from '../../../modules/document/services/ig-toc-node-helper.service';
import { IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { Scope } from '../../../modules/shared/constants/scope.enum';
import { SharePermission, Status } from '../../../modules/shared/models/abstract-domain.interface';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { IRegistry } from '../../../modules/shared/models/registry.interface';
import { ITitleBarMetadata } from './../../../modules/ig/components/ig-edit-titlebar/ig-edit-titlebar.component';

export const selectIgDocument = createSelector(
  fromDam.selectPayloadData,
  (state: IgDocument) => {
    return state;
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

export const selectTableOfContentEdit = fromDam.selectValue<{ changed: boolean; }>('tableOfContentEdit');

export const selectTableOfContentChanged = createSelector(
  selectTableOfContentEdit,
  (state: { changed: boolean; }) => {
    return state ? state.changed : false;
  },
);

export const selectWorkspaceOrTableOfContentChanged = createSelector(
  fromDam.selectWorkspaceCurrentIsChanged,
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
    return document.domainInfo.scope !== Scope.USER || document.status === Status.PUBLISHED || (document.sharePermission && document.sharePermission === SharePermission.READ);
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

export const selectDelta = fromDam.selectValue<boolean>('delta');

export const selectValueSetsNodes = createSelector(
  fromIgamtDisplaySelectors.selectValueSetsEntities,
  selectValueSetRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistryByName(nodes, registry);
  },
);

export const selectSegmentsNodes = createSelector(
  fromIgamtDisplaySelectors.selectSegmentsEntites,
  selectSegmentRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistryByName(nodes, registry);
  },
);

export const selectDatatypesNodes = createSelector(
  fromIgamtDisplaySelectors.selectDatatypesEntites,
  selectDatatypeRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistryByName(nodes, registry);
  },
);

export const selectCoConstraintGroupNodes = createSelector(
  fromIgamtDisplaySelectors.selectCoConstraintGroupEntites,
  selectCoConstraintGroupRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistryByName(nodes, registry);
  },
);

export const selectMessagesNodes = createSelector(
  fromIgamtDisplaySelectors.selectMessagesEntites,
  selectConformanceProfileRegistry,
  (messages: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistryByPosition(messages, registry);
  },
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
  fromIgamtDisplaySelectors.selectMessagesEntites,
  (messages: Dictionary<IDisplayElement>) => {
    const sorted = Object.keys(messages).map((key) => messages[key].domainInfo.version).sort();
    return sorted[sorted.length - 1];
  });

export const selectIgVersions = createSelector(
  fromIgamtDisplaySelectors.selectMessagesEntites,
  (messages: Dictionary<IDisplayElement>): string[] => {
    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    return Object.keys(messages).map((key) => messages[key].domainInfo.version).filter(distinct);
  });
