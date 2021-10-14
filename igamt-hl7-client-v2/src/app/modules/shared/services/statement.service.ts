import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ICardinalityRange, IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { OccurrenceType } from '../models/conformance-statements.domain';
import { IPath, ISubject } from '../models/cs.interface';
import { IResource } from '../models/resource.interface';
import { ElementNamingService, IPathInfo } from './element-naming.service';
import { PathService } from './path.service';
import { AResourceRepositoryService } from './resource-repository.service';

export class StatementService {

}

export class StatementTarget {
  public name: string;
  public node: IHL7v2TreeNode;
  public valid: boolean;
  public complex: boolean;
  public repeatMax: number;
  public value: ISubject;
  public context: IPath;
  public occurrenceValuesMap = {};

  getValue(): ISubject {
    return this.value;
  }

  isComplex(): boolean {
    return this.complex;
  }

  getRepeatMax(): number {
    return this.repeatMax;
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

  setSubject(subject: ISubject, context: IPath, resource: IResource, repository: AResourceRepositoryService, relativeName: boolean = false) {
    this.setValue(subject);
    this.name = '';
    this.valid = false;
    this.node = undefined;
    this.repeatMax = undefined;
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
        console.error(e);
      }
    } else {
      return of(this);
    }
  }

  clear() {
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
    this.context = undefined;
  }

  clearOccurrenceValue() {
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

  setAttibutes({ name, nodeInfo }: { name: string, nodeInfo: IPathInfo }, context: IPath, tree?: IHL7v2TreeNode[], node?: IHL7v2TreeNode) {
    this.name = name;
    this.valid = true;
    if (nodeInfo) {
      this.complex = !nodeInfo.leaf;
    }
    if (tree && node) {
      this.repeatMax = this.getNodeRepeatMax(node, tree[0]);
    }
    this.node = node;
    this.context = context;
  }

  getNodeRepeatMax(node: IHL7v2TreeNode, root: IHL7v2TreeNode) {
    const nodeRepeat = this.getMax(node.data.cardinality);
    if (nodeRepeat > 0) {
      return nodeRepeat;
    }

    if (node.data.type === Type.COMPONENT || node.data.type === Type.SUBCOMPONENT) {
      const field = this.getFieldFrom(node);
      if (field && field.data !== root.data) {
        return this.getMax(field.data.cardinality);
      }
    }
    return 0;
  }

  getMax(cardinality: ICardinalityRange) {
    if (!cardinality) {
      return 0;
    } else if (cardinality.max === '*') {
      return Number.MAX_VALUE;
    } else if (+cardinality.max === 1) {
      return 0;
    } else {
      return +cardinality.max;
    }
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
  }> {
    return this.getPathName(this.pathService.straightConcatPath(pre, post), resource, repository, relativeName ? post ? post.elementId : undefined : undefined);
  }

  getPathName(path: IPath, resource: IResource, repository: AResourceRepositoryService, startFrom?: string): Observable<{ name: string, nodeInfo: IPathInfo }> {
    if (!path) {
      return of({ name: '', nodeInfo: undefined });
    }

    return this.elementNamingService.getPathInfoFromPath(resource, repository, path).pipe(
      take(1),
      map((pathInfo) => {
        const name = this.elementNamingService.getStringNameFromPathInfo(startFrom ? this.elementNamingService.getStartPathInfo(pathInfo, startFrom) : pathInfo);
        const nodeInfo = this.elementNamingService.getLeaf(pathInfo);
        return {
          name,
          nodeInfo,
        };
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
          return +this.value.occurenceValue <= Math.min(8, this.repeatMax) && +this.value.occurenceValue >= 1;
      }
    }
    return true;
  }

  nodeValid() {
    return this.value && !!this.value.path && !!this.value.occurenceIdPath && this.valid;
  }

}
