import {Dictionary} from '@ngrx/entity';
import { Type } from '../../shared/constants/type.enum';
import { IContent } from '../../shared/models/content.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import {IRegistry} from '../../shared/models/registry.interface';
import {IResource} from '../../shared/models/resource.interface';

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

  static createProfileSection(section: IContent, messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[], path: string) {
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
            break;
          case Type.VALUESETREGISTRY:
            retChild.children = valueSetsNodes;
        }
        ret.children.push(retChild);
      }
    }
    ret.children = this.sort(ret.children);
    return ret;
  }

  static buildTree(structure: IContent[], messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[]) {
    const ret: IDisplayElement[] = [];
    for (const section of structure) {
      switch (section.type) {
        case Type.TEXT:
          ret.push(this.createNarativeSection(section, section.position + ''));
          break;
        case Type.PROFILE:
          ret.push(this.createProfileSection(section, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes, section.position + ''));
          break;
        default:
          break;
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
      position: i + 1,
      label: iDisplayElement.variableName,
      children: [],
    };
    if (iDisplayElement.type === Type.TEXT || iDisplayElement.type === Type.PROFILE) {
      ret.children = this.updateSections(iDisplayElement.children);
    }
    return ret;
  }

  static updateSections(children: IDisplayElement[]) {
    const ret: IContent[] = [];
    for (let i = 0; i < children.length; i++) {
      ret.push(this.createSectionFromIDisplay(children[i], i));
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
  static sortRegistry(elements: Dictionary<IDisplayElement>, registry: IRegistry): IDisplayElement[] {
    return  Object.keys(elements).map((key) => elements[key]).sort((a: IDisplayElement, b: IDisplayElement ) => this.compare(a, b));
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
    const left  = this.getFullName(a);
    const right = this.getFullName(b);
    if (left < right) {
      return -1;
    } else { return 1; }

  }
}
