import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { IWorkspace } from 'src/app/modules/shared/models/editor.class';
import { IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { IgTOCNodeHelper } from '../../../modules/ig/services/ig-toc-node-helper.service';
import { Scope } from '../../../modules/shared/constants/scope.enum';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { ILink } from '../../../modules/shared/models/link.interface';
import { IRegistry } from '../../../modules/shared/models/registry.interface';
import { selectIgEdit } from '../ig.reducer';
import { ITitleBarMetadata } from './../../../modules/ig/components/ig-edit-titlebar/ig-edit-titlebar.component';
import { igElementAdapter, IState } from './ig-edit.reducer';

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
export const selectIgId = createSelector(
  selectIgDocument,
  (state: IgDocument) => {
    return state.id;
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

export const selectSegmentsEntites = createSelector(
  selectSegments,
  selectEntities,
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

export const selectMessagesNodes = createSelector(
  selectMessagesEntites,
  selectConformanceProfileRegistry,
  (messages: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return registry.children.sort((a: ILink, b: ILink) => a.position - b.position).map((link) => messages[link.id]);
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
  selectValueSetsNodes, (
    structure: IContent[],
    messageNodes: IDisplayElement[],
    segmentsNodes: IDisplayElement[],
    datatypesNodes: IDisplayElement[],
    valueSetsNodes: IDisplayElement[],
  ) => {
    return IgTOCNodeHelper.buildTree(structure, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes);
  },
);

export const selectVersion = createSelector(
  selectMessagesEntites,
  (messages: Dictionary<IDisplayElement>) => {
    const sorted = Object.keys(messages).map((key) => messages[key].domainInfo.version).sort();
    return sorted[sorted.length - 1];
  });
