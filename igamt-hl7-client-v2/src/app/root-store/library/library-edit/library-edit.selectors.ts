import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import * as fromILibraryDamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import {IgTOCNodeHelper} from '../../../modules/document/services/ig-toc-node-helper.service';
import {ITitleBarMetadata} from '../../../modules/library/components/library-edit-titlebar/library-edit-titlebar.component';
import {ILibrary} from '../../../modules/library/models/library.class';
import { Scope } from '../../../modules/shared/constants/scope.enum';
import { SharePermission, Status } from '../../../modules/shared/models/abstract-domain.interface';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { IRegistry } from '../../../modules/shared/models/registry.interface';

export const selectLibrary = createSelector(
  fromDam.selectPayloadData,
  (state: ILibrary) => {
    return state;
  },
);

export const selectLibraryId = createSelector(
  selectLibrary,
  (state: ILibrary) => {
    return state.id;
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
  selectLibrary,
  (document: ILibrary): ITitleBarMetadata => {
    return {
      title: document.metadata.title,
      domainInfo: document.domainInfo,
      creationDate: document.creationDate,
      updateDate: document.updateDate,
    };
  },
);

export const selectViewOnly = createSelector(
   selectLibrary,
  (document: ILibrary): boolean => {
    return document.domainInfo.scope !== Scope.USER || document.status === Status.PUBLISHED || (document.sharePermission && document.sharePermission === SharePermission.READ);
  },
);

export const selectDatatypeRegistry = createSelector(
   selectLibrary,
  (state: ILibrary) => {
    return state.datatypeRegistry;
  },
);

export const selectValueSetRegistry = createSelector(
   selectLibrary,
  (state: ILibrary) => {
    return state.valueSetRegistry;
  },
);

export const selectSectionFromLibraryById = createSelector(
   selectLibrary,
  (lib: ILibrary, props: { id: string }) => {
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
    return loop(lib.content);
  },
);

export const selectDelta = fromDam.selectValue<boolean>('delta');

export const selectValueSetsNodes = createSelector(
  fromILibraryDamtDisplaySelectors.selectValueSetsEntities,
  selectValueSetRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistryByName(nodes, registry);
  },
);

export const selectDatatypesNodes = createSelector(
  fromILibraryDamtDisplaySelectors.selectDatatypesEntites,
  selectDatatypeRegistry,
  (nodes: Dictionary<IDisplayElement>, registry: IRegistry) => {
    return IgTOCNodeHelper.sortRegistryByName(nodes, registry);
  },
);

export const selectStructure = createSelector(
  selectLibrary,
  (state: ILibrary) => {
    return state.content;
  },
);

export const selectToc = createSelector(
  selectStructure,
  selectDatatypesNodes, (
    structure: IContent[],
    datatypesNodes: IDisplayElement[],
    derivedNodes: IDisplayElement[],
) => {

  return IgTOCNodeHelper.buildLibraryTree(structure, datatypesNodes,derivedNodes);
},
);

export const selectProfileTree = createSelector(
  selectStructure,
  selectDatatypesNodes, (
    structure: IContent[],
    datatypesNodes: IDisplayElement[],
) => {
  return IgTOCNodeHelper.buildProfileTree(structure, [], [], datatypesNodes, [], []);
},
);

export const selectVersion = createSelector(
  fromILibraryDamtDisplaySelectors.selectMessagesEntites,
  (dts: Dictionary<IDisplayElement>) => {
    const sorted = Object.keys(dts).map((key) => dts[key].domainInfo.version).sort();
    return sorted[sorted.length - 1];
  });

export const  selectLibraryVersions = createSelector(
  fromILibraryDamtDisplaySelectors.selectDatatypesEntites,
  (datatypes: Dictionary<IDisplayElement>): string[] => {
    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    return Object.keys(datatypes).map((key) => datatypes[key].domainInfo.version).filter(distinct);
  });
