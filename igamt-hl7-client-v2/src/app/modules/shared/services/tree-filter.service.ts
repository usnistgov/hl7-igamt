import { Injectable } from '@angular/core';
import { ICardinalityRange, IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { Usage } from '../constants/usage.enum';

export enum RestrictionCombinator {
  ACCUMULATE = 'ACCUMULATE',
  ENFORCE = 'ENFORCE',
}

export interface IHL7v2TreeFilter {
  hide: boolean;
  restrictions: Array<ITreeRestriction<any>>;
}

export interface ITreeRestriction<T> {
  criterion: RestrictionType;
  combine?: RestrictionCombinator;
  allow: boolean;
  value: T;
}

export enum RestrictionType {
  PRIMITIVE = 'PRIMITIVE',
  DATATYPES = 'DATATYPES',
  REPEATABLE = 'REPEATABLE',
  USAGE = 'USAGE',
  TYPE = 'TYPE',
  PATH = 'PATH',
}

export interface IPathValue {
  path: string;
  excludeChildren: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TreeFilterService {

  constructor() { }

  filterTree(tree: IHL7v2TreeNode[], filter: IHL7v2TreeFilter): IHL7v2TreeNode[] {
    if (filter.hide) {
      return this.filterTreeHide(tree, filter.restrictions);
    } else {
      return this.filterTreeDisable(tree, filter.restrictions);
    }
  }

  filterTreeHide(tree: IHL7v2TreeNode[], restrictions: Array<ITreeRestriction<any>>): IHL7v2TreeNode[] {
    if (tree) {
      const filtered = tree.filter((node) => {
        return this.keep(node, restrictions);
      });

      filtered.forEach((node) => {
        node.children = this.filterTreeHide(node.children, restrictions);
        if (!node.children || node.children.length === 0) {
          node.leaf = true;
        }
      });

      return filtered;
    }
    return tree;
  }

  filterTreeDisable(tree: IHL7v2TreeNode[], restrictions: Array<ITreeRestriction<any>>): IHL7v2TreeNode[] {
    if (tree) {
      tree.forEach((node) => {
        node.selectable = this.keep(node, restrictions);
        this.filterTreeDisable(node.children, restrictions);
      });
    }
    return tree;
  }

  keep(node: IHL7v2TreeNode, restrictions: Array<ITreeRestriction<any>>): boolean {
    const combined = restrictions.filter((elm) => !elm.combine || elm.combine === RestrictionCombinator.ACCUMULATE);
    const enforced = restrictions.filter((elm) => elm.combine === RestrictionCombinator.ENFORCE);

    const evaluate = (list: Array<ITreeRestriction<any>>): boolean => {
      let keep = false;
      for (const restriction of list) {
        keep = keep || this.allow(restriction.allow, this.pass(node, restriction));
      }
      return keep;
    };

    return evaluate(combined) && (enforced.length === 0 || evaluate(enforced));
  }

  pathIsProhibited(path: string, list: IPathValue[]): boolean {
    return list.map((p) => {
      return p.excludeChildren ? path.startsWith(p.path) : path === p.path;
    }).reduce((a, b) => {
      return a || b;
    }, false);
  }

  pass(node: IHL7v2TreeNode, restriction: ITreeRestriction<any>) {
    switch (restriction.criterion) {
      case RestrictionType.PRIMITIVE:
        return this.primitive(node, restriction.value);
      case RestrictionType.DATATYPES:
        return this.datatypes(node, restriction.value);
      case RestrictionType.REPEATABLE:
        return this.repeat(node, restriction.value);
      case RestrictionType.USAGE:
        return this.usage(node, restriction.value);
      case RestrictionType.TYPE:
        return this.type(node, restriction.value);
      case RestrictionType.PATH:
        return this.path(node, restriction.value);
    }
  }

  allow(pass: boolean, allowed: boolean): boolean {
    if (allowed) {
      return pass;
    } else {
      return !pass;
    }
  }

  primitive(node: IHL7v2TreeNode, payload: boolean): boolean {
    return node.leaf === payload;
  }

  path(node: IHL7v2TreeNode, payload: IPathValue[]): boolean {
    return this.pathIsProhibited(node.data.pathId, payload);
  }

  type(node: IHL7v2TreeNode, types: Type[]): boolean {
    return types.includes(node.data.type);
  }

  usage(node: IHL7v2TreeNode, usage: Usage): boolean {
    return node.data.usage.value === usage;
  }

  repeat(node: IHL7v2TreeNode, range: ICardinalityRange): boolean {
    const min = node.data.cardinality.min >= range.min;
    let max = false;
    if (range.max === '*') {
      max = true;
    } else {
      if (node.data.cardinality.max !== '*') {
        max = +node.data.cardinality.max <= +range.max;
      } else {
        max = false;
      }
    }
    return min && max;
  }

  datatypes(node: IHL7v2TreeNode, datatypes: string[]): boolean {
    if (node.data.ref) {
      const ref = node.data.ref.getValue();
      if (ref.type === Type.DATATYPE) {
        return datatypes.includes(ref.name);
      }
    }
    return false;
  }

}