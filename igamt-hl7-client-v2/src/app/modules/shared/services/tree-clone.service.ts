import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ICardinalityRange, IHL7v2TreeNode, ILengthRange, IResourceRef, IStringValue } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { IComment } from '../models/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class TreeCloneService {

  constructor() { }

  cloneViewTree(tree: TreeNode[]): TreeNode[] {
    return tree ? tree.map((node: TreeNode) => {
      return {
        data: node.data,
        children: this.cloneViewTree(node.children),
        leaf: node.leaf,
        $hl7V2TreeHelpers: this.cloneViewHL7v2Helper(node['$hl7V2TreeHelpers']),
      };
    }) : [];
  }

  cloneViewHL7v2Helper(helpers: any): any {
    if (helpers) {
      return {
        predicate$: helpers.predicate$,
        ref$: helpers.ref$,
        treeChildrenSubscription: undefined,
        children$: helpers.children$,
      };
    } else {
      return undefined;
    }
  }

  cloneTree(tree: IHL7v2TreeNode[]): IHL7v2TreeNode[] {
    return tree.map((node) => this.cloneTreeNode(node));
  }

  cloneTreeNode(node: IHL7v2TreeNode): IHL7v2TreeNode {
    const cloneTextValue = (value: IStringValue): IStringValue => {
      if (value) {
        return {
          value: value.value,
        };
      } else {
        return undefined;
      }
    };

    const cloneRange = (value: any): any => {
      if (value) {
        return {
          min: value.min,
          max: value.max,
        };
      } else {
        return undefined;
      }
    };

    const cloneComments = (value: IComment[]): IComment[] => {
      if (value) {
        return value.map((val) => {
          return {
            dateupdated: val.dateupdated,
            description: val.description,
            username: val.username,
          };
        });
      } else {
        return undefined;
      }
    };

    const ref = new BehaviorSubject<IResourceRef>(node.data.ref.value);
    return {
      data: {
        id: node.data.id,
        name: node.data.name,
        position: node.data.position,
        type: node.data.type,
        usage: cloneTextValue(node.data.usage),
        oldUsage: node.data.oldUsage,
        text: cloneTextValue(node.data.text),
        cardinality: cloneRange(node.data.cardinality) as ICardinalityRange,
        length: cloneRange(node.data.length) as ILengthRange,
        comments: cloneComments(node.data.comments),
        constantValue: cloneTextValue(node.data.constantValue),
        pathId: node.data.pathId,
        changeable: node.data.changeable,
        viewOnly: node.data.viewOnly,
        confLength: node.data.confLength,
        custom: node.data.custom,
        valueSetBindingsInfo: node.data.valueSetBindingsInfo,
        ref,
        bindings: node.data.bindings,
        level: node.data.level,
        rootPath: node.data.rootPath,
      },
      leaf: node.leaf,
      $hl7V2TreeHelpers: {
        ref$: ref.asObservable(),
        treeChildrenSubscription: undefined,
        children$: new ReplaySubject<IHL7v2TreeNode[]>(1),
      },
    };
  }
}
