import { Dictionary } from '@ngrx/entity';
import { Type } from '../../shared/constants/type.enum';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { IContent } from '../../shared/models/content.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IRegistry } from '../../shared/models/registry.interface';

export class IgTOCNodeHelper {

  static initializeIDisplayElement(section: IContent, path: string) {
    return {
      description: section.description,
      id: section.id,
      domainInfo: null,
      differential: false,
      variableName: section.label,
      children: [],
      type: section.type,
      position: section.position,
      fixedName: null,
      leaf: false,
      isExpanded: true,
      path,
    };
  }

  static sort(children: IDisplayElement[]) {
    return children.sort((a: IDisplayElement, b: IDisplayElement) => a.position - b.position);
  }

  static createNarativeSection(section: IContent, path: string): IDisplayElement {
    const ret = this.initializeIDisplayElement(section, path);
    if (section.children && section.children.length > 0) {
      for (const child of section.children) {
        ret.children.push(this.createNarativeSection(child, path + '.' + child.position));
      }
    }
    ret.children = this.sort(ret.children);
    return ret;
  }

  static createProfileSection(section: IContent, messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[], coConstraintGroupNodes: IDisplayElement[], profileComponentNodes: IDisplayElement[], compositeProfileNodes: IDisplayElement[], path: string) {
    const ret = this.initializeIDisplayElement(section, path);
    if (section.children && section.children.length > 0) {
      for (const child of section.children) {
        const retChild = this.initializeIDisplayElement(child, ret.path + '.' + child.position);
        switch (child.type) {
          case Type.CONFORMANCEPROFILEREGISTRY:
            retChild.children = messageNodes;
            break;
          case Type.SEGMENTREGISTRY:
            retChild.children = segmentsNodes;
            break;
          case Type.DATATYPEREGISTRY:
            retChild.children = datatypesNodes;
            console.log("datatypesNodes");

            console.log(datatypesNodes);
            break;
          case Type.VALUESETREGISTRY:
            retChild.children = valueSetsNodes;
            break;
          case Type.COCONSTRAINTGROUPREGISTRY:
            retChild.children = coConstraintGroupNodes;
            break;
          case Type.PROFILECOMPONENTREGISTRY:
            retChild.children = profileComponentNodes;
            break;
          case Type.COMPOSITEPROFILEREGISTRY:
            retChild.children = compositeProfileNodes;
        }
        ret.children.push(retChild);
      }
    }
    ret.children = this.sort(ret.children);
    return ret;
  }

  static buildTree(structure: IContent[], messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[], coConstraintGroupNodes: IDisplayElement[], profileComponentNodes: IDisplayElement[], compositeProfileNodes: IDisplayElement[]) {
    const ret: IDisplayElement[] = [];
    for (const section of structure) {
      switch (section.type) {
        case Type.TEXT:
          ret.push(this.createNarativeSection(section, section.position + ''));
          break;
        case Type.PROFILE:
          ret.push(this.createProfileSection(section, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes, coConstraintGroupNodes, profileComponentNodes, compositeProfileNodes, section.position + ''));
          break;
        default:
          break;
      }
    }
    return this.sort(ret);
  }

  static buildLibraryTree(documentRef: IDocumentRef, structure: IContent[], datatypesNodes: IDisplayElement[]) {
    const ret: IDisplayElement[] = [];
    for (const section of structure) {
      switch (section.type) {
        case Type.TEXT:
          ret.push(this.createNarativeSection(section, section.position + ''));
          break;
        case Type.PROFILE:
          ret.push(this.createLibProfileSection(documentRef, section, datatypesNodes, section.position + ''));
          break;
        default:
          break;
      }
    }
    return this.sort(ret);
  }

  static buildLibraryProfileTree(documentRef: IDocumentRef, structure: IContent[], datatypesNodes: IDisplayElement[]) {
    const ret: IDisplayElement[] = [];
    for (const section of structure) {
      switch (section.type) {
        case Type.TEXT:
          break;
        case Type.PROFILE:
          ret.push(this.createLibProfileSection(documentRef, section, datatypesNodes, section.position + ''));
          break;
        default:
          break;
      }
    }
    return this.sort(ret);
  }

  static createLibProfileSection(documentRef: IDocumentRef, section: IContent, datatypesNodes: IDisplayElement[], path: string) {
    const ret = this.initializeIDisplayElement(section, path);
    if (section.children && section.children.length > 0) {
      for (const child of section.children) {
        const retChild = this.initializeIDisplayElement(child, ret.path + '.' + child.position);
        switch (child.type) {
          case Type.DATATYPEREGISTRY:
            retChild.children = datatypesNodes.filter((dt: IDisplayElement) =>  dt && this.isPartOfLib(dt, documentRef.documentId));
            break;
          case Type.DERIVEDDATATYPEREGISTRY:
            retChild.children = datatypesNodes.filter((dt: IDisplayElement) => dt && !this.isPartOfLib(dt, documentRef.documentId));
            break;
        }
        ret.children.push(retChild);
      }
    }
    ret.children = this.sort(ret.children);
    return ret;
  }

  static buildProfileTree(structure: IContent[], messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[], coConstraintGroupNodes: IDisplayElement[], profileComponentsNodes: IDisplayElement[], compositeProfilesNodes: IDisplayElement[]) {
    const ret: IDisplayElement[] = [];
    for (const section of structure) {
      if (section.type === Type.PROFILE) {
        ret.push(this.createProfileSection(section, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes, coConstraintGroupNodes, profileComponentsNodes, compositeProfilesNodes, section.position + ''));
      }
    }
    return this.sort(ret);
  }

  static updatePositions(children: IContent[]) {
    for (let i = 0; i < children.length; i++) {
      children[i].position = i + 1;
    }
  }
  static getIDisplayFromSections(children: IContent[], path: string): IDisplayElement[] {
    if (children) {
      const sections: IDisplayElement[] = children.map((section) => this.initializeIDisplayElement(section, path + section.position + ''));
      for (const child of children) {
        sections.push(...this.getIDisplayFromSections(child.children, path + '' + child.position + '.'));
      }
      return sections;
    } else {
      return [];
    }
  }
  static createSectionFromIDisplay(iDisplayElement: IDisplayElement, i: number): IContent {
    const ret = {
      id: iDisplayElement.id,
      description: iDisplayElement.description,
      type: iDisplayElement.type,
      delta: iDisplayElement.delta,
      position: i + 1,
      label: iDisplayElement.variableName,
      children: [],
    };
    ret.children = this.updateSections(iDisplayElement.children);
    return ret;
  }

  static updateSections(children: IDisplayElement[]) {
    const ret: IContent[] = [];
    if (children) {
      for (let i = 0; i < children.length; i++) {
        ret.push(this.createSectionFromIDisplay(children[i], i));
      }
    }
    return ret;
  }

  static removeNode(children: IContent[], node: IDisplayElement) {

    for (let i = 0; i < children.length; i++) {
      if (node.id === children[i].id) {
        children.splice(i, 1);
        this.updatePositions(children);
        return true;
      }
      if (children.length[i].children) {
        return this.removeNode(children.length[i].children, node);
      }
    }
  }
  static sortRegistryByName(elements: Dictionary<IDisplayElement>, registry: IRegistry): IDisplayElement[] {
    return registry.children.map((x) => elements[x.id]).sort((a: IDisplayElement, b: IDisplayElement) => this.compare(a, b));
  }

  static sortRegistryByPosition(elements: Dictionary<IDisplayElement>, registry: IRegistry): IDisplayElement[] {
    return registry.children.map((x) => elements[x.id]).sort((a: IDisplayElement, b: IDisplayElement) => a.position - b.position);
  }

  static getFullName(node: IDisplayElement): string {
    if (node.fixedName && node.fixedName.length) {
      if (node.variableName && node.variableName.length) {
        return node.fixedName + '_' + node.variableName;
      } else {
        return node.fixedName;
      }
    } else {
      return node.variableName;
    }
  }
  static compare(a: IDisplayElement, b: IDisplayElement) {
    const left = this.getFullName(a);
    const right = this.getFullName(b);
    if (left < right) {
      return -1;
    } else {
      return 1;
    }
  }

  static isPartOfLib(dt: IDisplayElement, documentId: string) {
    if (!dt.parentId) {
      return false;
    } else if (documentId === dt.parentId) {
      return true;
    } else if (dt.libraryReferences && dt.libraryReferences.length > 0) {
      return dt.libraryReferences.indexOf(documentId) > -1;
    }
    return false;
  }
}
