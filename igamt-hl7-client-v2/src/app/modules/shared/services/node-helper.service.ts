import { Injectable } from '@angular/core';
import {TreeModel, TreeNode} from 'angular-tree-component';
import {UUID} from 'angular2-uuid';
import * as _ from 'lodash';
import {IDisplayElement} from '../../ig/models/ig/ig-document.class';
import {Type} from '../constants/type.enum';

@Injectable({
  providedIn: 'root',
})
export class NodeHelperService {

  constructor() {}

  cloneNode(treeNode: TreeNode) {

    const newData: IDisplayElement = _.cloneDeep(treeNode.data);
    newData.id = UUID.UUID();
    if (newData) {
      newData.id = UUID.UUID();
      newData.variableName = newData.variableName + '-copy';
    }
    this.changeIds(newData);
    treeNode.parent.data.children.push(newData);
  }

  changeIds(newData: IDisplayElement) {
    newData.id = UUID.UUID();
    if ( newData.children && newData.children.length ) {
      for (const child of  newData.children) {
        this.changeIds(child);
      }
    }
  }

  deleteSection(id, treeModel: TreeModel) {
    const node = treeModel.getNodeById(id);
    if ( node ) {
      const parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
      _.remove(parentNode.data.children, (child: any) => {
        return child.id === node.id;
      });

      if (node.parent &&  node.parent.data && node.parent.data.children.length === 0) {
        node.parent.data.hasChildren = false;
      }
    }
  }
  createNewNode(): IDisplayElement {
    return {
      description: '',
      id: UUID.UUID(),
      domainInfo: null,
      differantial: false,
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
    if ( node.children ) {
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
}
