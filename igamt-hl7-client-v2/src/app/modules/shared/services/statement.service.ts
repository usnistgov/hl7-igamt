import { EventEmitter } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { ICardinalityRange, IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { OccurrenceType } from '../models/conformance-statements.domain';
import { IPath, ISubject } from '../models/cs.interface';
import { IDisplayElement } from '../models/display-element.interface';
import { IPropertyCardinalityMax, IPropertyCardinalityMin } from '../models/profile.component';
import { IResource } from '../models/resource.interface';
import { PropertyType } from '../models/save-change';
import { ElementNamingService, IPathInfo } from './element-naming.service';
import { PathService } from './path.service';
import { AResourceRepositoryService } from './resource-repository.service';

export class StatementTarget {
  public name: string;
  public node: IHL7v2TreeNode;
  public valid: boolean;
  public complex: boolean;
  public resourceName: string;
  public repeatMax: number;
  public hierarchicalRepeat: boolean;
  public value: ISubject;
  public context: IPath;
  public occurrenceValuesMap = {};
  public referenceChangeMap: Record<string, string> = {};

  setReferenceChangeMap(refChangeMap: Record<string, string>) {
    this.referenceChangeMap = {
      ...refChangeMap,
    };
  }

  getValue(): ISubject {
    return this.value;
  }

  isPrimitive(): boolean {
    return !this.isComplex();
  }

  isComplex(): boolean {
    return this.complex;
  }

  getRepeatMax(): number {
    return this.repeatMax;
  }

  getHierarchicalRepeat(): boolean {
    return this.hierarchicalRepeat;
  }

  getName(): string {
    return this.name;
  }

  constructor(
    private elementNamingService: ElementNamingService,
    private pathService: PathService,
    occurrenceTypeValues: Array<{
      label: string;
      value: OccurrenceType;
    }>,
  ) {
    for (const item of occurrenceTypeValues) {
      this.occurrenceValuesMap[item.value] = item.label;
    }
  }

  setValue(subject: ISubject) {
    this.value = {
      path: subject.path,
      occurenceIdPath: subject.occurenceIdPath,
      occurenceValue: subject.occurenceValue,
      occurenceType: subject.occurenceType,
      occurenceLocationStr: subject.occurenceLocationStr,
    };
  }

  setNode(node: IHL7v2TreeNode, tree: IHL7v2TreeNode[]) {
    if (tree && node) {
      this.repeatMax = this.getNodeRepeatMax(node, tree[0]);
      this.hierarchicalRepeat = this.getNodeHierarchyRepeat(node, tree[0]);
    }
    if (node) {
      this.resourceName = node.data.ref ? node.data.ref.getValue().name : '';
    }
    this.node = node;
  }

  setSubject(subject: ISubject, context: IPath, resource: IResource, repository: AResourceRepositoryService, relativeName: boolean = false): Observable<StatementTarget> {
    this.setValue(subject);
    this.name = '';
    this.valid = false;
    this.node = undefined;
    this.resourceName = undefined;
    this.repeatMax = undefined;
    this.hierarchicalRepeat = false;
    this.context = undefined;

    if (subject.path) {
      try {
        return this.getNameFullPath(context, subject.path, resource, repository, relativeName).pipe(
          take(1),
          map((info) => {
            this.setAttibutes(info, context);
            return this;
          }),
        );
      } catch (e) {
        return throwError(e);
      }
    } else {
      return of(this);
    }
  }

  clear(treeClearEvent?: EventEmitter<boolean>) {
    this.name = '';
    this.valid = false;
    this.node = undefined;
    this.value = {
      path: undefined,
      occurenceIdPath: undefined,
      occurenceValue: undefined,
      occurenceType: undefined,
      occurenceLocationStr: undefined,
    };
    this.repeatMax = undefined;
    this.hierarchicalRepeat = false;
    this.resourceName = undefined;
    this.context = undefined;
    if (treeClearEvent) {
      treeClearEvent.emit(true);
    }
  }

  clearOccurrenceValue(clearType: boolean = false) {
    if (clearType) {
      this.value.occurenceType = undefined;
    }
    this.value.occurenceValue = undefined;
    this.value.occurenceLocationStr = undefined;
  }

  reset(context: IPath, target: IPath, resource: IResource, repository: AResourceRepositoryService, tree: IHL7v2TreeNode[], node: IHL7v2TreeNode, relativeName: boolean = false): Observable<StatementTarget> {
    this.clear();
    try {
      return this.getNameFullPath(context, target, resource, repository, relativeName).pipe(
        take(1),
        map((info) => {
          this.setAttibutes(info, context, tree, node);
          this.value = {
            path: target,
            occurenceIdPath: node.data.id,
            occurenceValue: undefined,
            occurenceType: undefined,
            occurenceLocationStr: undefined,
          };
          return this;
        }),
      );
    } catch (e) {
      console.error(e);
    }
  }

  setAttibutes({ name, nodeInfo, resourceDisplay }: { name: string, nodeInfo: IPathInfo, resourceDisplay: IDisplayElement }, context: IPath, tree?: IHL7v2TreeNode[], node?: IHL7v2TreeNode) {
    this.name = name;
    this.valid = true;
    if (nodeInfo) {
      this.complex = !nodeInfo.leaf;
      this.resourceName = resourceDisplay ? resourceDisplay.resourceName : '';
    }
    if (tree && node) {
      this.repeatMax = this.getNodeRepeatMax(node, tree[0]);
      this.hierarchicalRepeat = this.getNodeHierarchyRepeat(node, tree[0]);
    }
    if (node) {
      this.resourceName = node.data.ref ? node.data.ref.getValue().name : '';
    }
    this.node = node;
    this.context = context;
  }

  getNodeRepeatMax(node: IHL7v2TreeNode, root: IHL7v2TreeNode) {
    const loop = (n: IHL7v2TreeNode) => {
      if (n && n.data !== root.data) {
        const r = this.getMax(n);
        return (r === 0 ? 1 : r) * loop(n.parent);
      }
      return 1;
    };
    const repeat = loop(node);
    return repeat === 1 ? 0 : repeat;
  }

  getNodeHierarchyRepeat(node: IHL7v2TreeNode, root: IHL7v2TreeNode) {
    const field = this.getFieldFrom(node);

    const findRepeat = (n: IHL7v2TreeNode) => {
      if (n && n.data !== root.data) {
        if (this.getMax(n) > 0) {
          return true;
        } else {
          return findRepeat(n.parent);
        }
      } else {
        return false;
      }
    };

    return findRepeat(field ? field.parent : node.parent);
  }

  getMax(node: IHL7v2TreeNode) {
    const cardinality: ICardinalityRange = this.applyCardinalityOverrides(
      node.data.cardinality,
      node.data.profileComponentOverrides ? node.data.profileComponentOverrides.getValue()[PropertyType.CARDINALITYMIN] as IPropertyCardinalityMin : undefined,
      node.data.profileComponentOverrides ? node.data.profileComponentOverrides.getValue()[PropertyType.CARDINALITYMAX] as IPropertyCardinalityMax : undefined,
    );
    if (!cardinality) {
      return 0;
    } else if (cardinality.max === '*') {
      return 999;
    } else if (+cardinality.max === 1) {
      return 0;
    } else {
      return +cardinality.max;
    }
  }

  applyCardinalityOverrides(
    cardinality?: ICardinalityRange,
    minProperty?: IPropertyCardinalityMin,
    maxProperty?: IPropertyCardinalityMax,
  ): ICardinalityRange {
    if (cardinality) {
      const min = minProperty ? minProperty.min : cardinality.min;
      const max = maxProperty ? maxProperty.max : cardinality.max;
      return {
        min,
        max,
      };
    }
    return null;
  }

  getFieldFrom(node: IHL7v2TreeNode): IHL7v2TreeNode {
    if (!node) {
      return node;
    }

    if (node.data.type === Type.FIELD) {
      return node;
    }

    return this.getFieldFrom(node.parent);
  }

  getNameFullPath(pre: IPath, post: IPath, resource: IResource, repository: AResourceRepositoryService, relativeName: boolean = false): Observable<{
    name: string;
    nodeInfo: IPathInfo;
    resourceDisplay: IDisplayElement;
  }> {
    return this.getPathName(this.pathService.straightConcatPath(pre, post), resource, repository, relativeName ? post ? post.elementId : undefined : undefined);
  }

  getPathName(path: IPath, resource: IResource, repository: AResourceRepositoryService, startFrom?: string): Observable<{ name: string, nodeInfo: IPathInfo, resourceDisplay: IDisplayElement }> {
    if (!path) {
      return of({ name: '', nodeInfo: undefined, resourceDisplay: undefined });
    }

    return this.elementNamingService.getPathInfoFromPath(resource, repository, path, {
      referenceChange: this.referenceChangeMap,
    }).pipe(
      take(1),
      flatMap((pathInfo) => {
        const name = this.elementNamingService.getStringNameFromPathInfo(startFrom ? this.elementNamingService.getStartPathInfo(pathInfo, startFrom) : pathInfo);
        const nodeInfo = this.elementNamingService.getLeaf(pathInfo);
        if (nodeInfo.type === Type.GROUP) {
          return of({
            name,
            nodeInfo,
            resourceDisplay: undefined,
          });
        }
        return repository.getResourceDisplay(nodeInfo.ref.type, nodeInfo.ref.id).pipe(
          map((resourceDisplay) => {
            return {
              name,
              nodeInfo,
              resourceDisplay,
            };
          }),
        );
      }),
    );
  }

  getDescription(resource: IResource, repository: AResourceRepositoryService, relativeName: boolean = false): Observable<string> {
    return this.getNameFullPath(this.context, this.value.path, resource, repository, relativeName).pipe(
      take(1),
      map((subject) => {
        const occurenceTarget = this.getOccurenceLiteral(this.value);
        return `${occurenceTarget} ${this.valueOrBlank(subject.name)}`;
      }),
    );
  }

  getOccurenceLiteral(elm: ISubject): string {
    if (elm.occurenceType) {
      switch (elm.occurenceType) {
        case OccurrenceType.COUNT:
          return `${elm.occurenceValue ? elm.occurenceValue : '#'} occurrence${+elm.occurenceValue > 1 ? 's' : ''} of`;
        case OccurrenceType.INSTANCE:
          return `The ${elm.occurenceValue ? this.getLiteralForNumber(+elm.occurenceValue) : '#'} occurrence of`;
        default:
          return this.occurrenceValuesMap[elm.occurenceType];
      }
    }
    return '';
  }

  getLiteralForNumber(nb: number) {
    switch (nb) {
      case 1: return 'first';
      case 2: return 'second';
      case 3: return 'third';
      case 4: return 'fourth';
      case 5: return 'fifth';
      case 6: return 'sixth';
      case 7: return 'seventh';
      case 8: return 'eight';
      default: return '#';
    }
  }

  valueOrBlank(val): string {
    return val ? val : '_';
  }

  isComplete(): boolean {
    return this.occurenceValid() && this.nodeValid();
  }

  occurenceValid() {
    if (this.repeatMax > 0) {
      if (!(this.value && this.value.occurenceType)) {
        return false;
      }

      switch (this.value.occurenceType) {
        case OccurrenceType.COUNT:
          return +this.value.occurenceValue <= this.repeatMax && +this.value.occurenceValue >= 1;
        case OccurrenceType.INSTANCE:
          return this.hierarchicalRepeat ? false : +this.value.occurenceValue <= Math.min(8, this.repeatMax) && +this.value.occurenceValue >= 1;
      }
    }
    return true;
  }

  nodeValid() {
    return this.value && !!this.value.path && !!this.value.occurenceIdPath && this.valid;
  }

}
