import { Injectable } from '@angular/core';
import { LoadChildren } from '@angular/router';
import { TreeModel, TreeNode } from 'angular-tree-component';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { Type } from '../constants/type.enum';
import { IDisplayElement } from '../models/display-element.interface';
import { IRegsitrySections } from './../../ig/components/manage-profile-structure/manage-profile-structure.component';
import { Position } from './../components/pattern-dialog/cs-pattern.domain';

@Injectable({
  providedIn: 'root',
})
export class NodeHelperService {

  public static  defaultOptions: IRegsitrySections[] = [
    {
      disabled: false,
      position: 1,
      label: 'Profile Components',
      registryType: Type.PROFILECOMPONENTREGISTRY,

    },
    {
      disabled: true,
      position: 2,
      label: 'Conformane Profiles',
      registryType: Type.CONFORMANCEPROFILEREGISTRY,

    },

    {
      disabled: false,
      position: 3,
      label: 'Composite Profiles',
      registryType: Type.COMPOSITEPROFILEREGISTRY,

    },
    {
      disabled: true,
      position: 4,
      label: 'Segments and Fields Descriptions',
      registryType: Type.SEGMENTREGISTRY,

    },
    {
      disabled: true,
      position: 5,
      label: 'Data Types',
      registryType: Type.DATATYPEREGISTRY,

    },
    {
      disabled: false,
      position: 6,
      label: 'Value Sets',
      registryType: Type.VALUESETREGISTRY,

    },
    {
      disabled: false,
      position: 7,
      label: 'Co-Constraint groups',
      registryType: Type.COCONSTRAINTGROUPREGISTRY,

    },
    {
      disabled: false,
      position: 8,
      label: 'Conformance Statements',
      registryType: Type.CONFORMANCESTATEMENTSUMMARY,

    },
  ];
  constructor() {
  }



  cloneNode(treeNode: TreeNode): string {

    const newData: IDisplayElement = _.cloneDeep(treeNode.data);
    newData.id = Guid.create().toString();
    newData.variableName = newData.variableName + '-copy';
    this.changeIds(newData);
    treeNode.parent.data.children.push(newData);
    return newData.id;
  }

  changeIds(newData: IDisplayElement) {
    newData.id = Guid.create().toString();
    if (newData.children && newData.children.length) {
      for (const child of newData.children) {
        this.changeIds(child);
      }
    }
  }

  deleteSection(id, treeModel: TreeModel) {
    const node = treeModel.getNodeById(id);
    if (node) {
      const parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
      _.remove(parentNode.data.children, (child: any) => {
        return child.id === node.id;
      });

      if (node.parent && node.parent.data && node.parent.data.children.length === 0) {
        node.parent.data.hasChildren = false;
      }
    }
  }

  createNewNode(): IDisplayElement {
    return {
      description: '',
      id: Guid.create().toString(),
      domainInfo: null,
      differential: false,
      variableName: 'New Section',
      children: [],
      type: Type.TEXT,
      fixedName: null,
      leaf: false,
      position: 0,
      isExpanded: true,
    };
  }

  addNode(node: TreeNode) {
    if (node.children) {
      node.data.children.push(this.createNewNode());
    }
  }

  addNodeToRoot(tree: TreeModel) {
    tree.nodes.push(this.createNewNode());
  }

  getFilteringLabel(fixedName, variableName) {
    if (fixedName && fixedName.length) {
      if (variableName && variableName.length) {
        return fixedName + '_' + variableName;
      } else {
        return fixedName;
      }
    } else {
      return variableName;
    }
  }

  createRegistrySection(registry: IRegsitrySections): IDisplayElement {
    return {
      description: '',
      id: Guid.create().toString(),
      domainInfo: null,
      differential: false,
      variableName: registry.label,
      children: [],
      type: registry.registryType,
      fixedName: null,
      leaf: false,
      position: registry.position,
      isExpanded: true,
      path: '3.1',
    };
  }

  updateProfileStructure(node, answer: { removed: IRegsitrySections[], added: IRegsitrySections[] }) {
    const positionsMap = {};
    NodeHelperService.defaultOptions.forEach((element) => {
      positionsMap[element.registryType] = element.position;
    });
    if (answer) {
      if (answer.added) {
        answer.added.forEach((element) => {
          node.data.children.push(this.createRegistrySection(element));
        });
      }
      if (answer.removed) {
        const removed = {};
        answer.removed.forEach((element) => {
          removed[element.registryType] = element;
        });
        node.data.children = node.data.children.filter((x) => !removed[x.type]);
      }
      node.data.children = node.data.children.sort((a, b) => {
        return positionsMap[a.type] > positionsMap[b.type] ? 1 : -1;
      });
      for (let i = 0; i < node.data.children.length; i++) {
        node.data.children[i].position = i + 1;
      }
    }
  }
}
