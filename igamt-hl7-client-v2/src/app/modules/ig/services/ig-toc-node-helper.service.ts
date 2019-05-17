import { Type } from '../../shared/constants/type.enum';
import { IContent } from '../../shared/models/content.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';

export class IgTOCNodeHelper {

  static initializeIDisplayElement(section: IContent) {
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
    };
  }

  static sort(children: IDisplayElement[]) {
    return children.sort((a: IDisplayElement, b: IDisplayElement) => a.position - b.position);
  }

  static createNarativeSection(section: IContent): IDisplayElement {
    const ret = this.initializeIDisplayElement(section);
    if (section.children && section.children.length > 0) {
      for (const child of section.children) {
        ret.children.push(this.createNarativeSection(child));
      }
    }
    ret.children = this.sort(ret.children);
    return ret;
  }

  static createProfileSection(section: IContent, messageNodes: IDisplayElement[], segmentsNodes: IDisplayElement[], datatypesNodes: IDisplayElement[], valueSetsNodes: IDisplayElement[]) {
    const ret = this.initializeIDisplayElement(section);
    if (section.children && section.children.length > 0) {
      for (const child of section.children) {
        const retChild = this.initializeIDisplayElement(child);
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
          ret.push(this.createNarativeSection(section));
          break;
        case Type.PROFILE:
          ret.push(this.createProfileSection(section, messageNodes, segmentsNodes, datatypesNodes, valueSetsNodes));
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

  static getIDisplayFromSections(children: IContent[]): IDisplayElement[] {
    if (children) {
      const sections: IDisplayElement[] = children.map((section) => this.initializeIDisplayElement(section));
      for (const child of children) {
        sections.push(...this.getIDisplayFromSections(child.children));
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
}
