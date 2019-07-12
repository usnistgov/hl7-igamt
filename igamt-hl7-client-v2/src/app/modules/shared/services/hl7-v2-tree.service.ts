import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { map, mergeMap, take, toArray } from 'rxjs/operators';
import { IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IStructureElementBinding, IStructureElementBindingProperties } from '../models/binding.interface';
import { IConformanceProfile, IGroup, IMsgStructElement, ISegmentRef } from '../models/conformance-profile.interface';
import { IDatatype } from '../models/datatype.interface';
import { ISegment } from '../models/segment.interface';
import { PredicateService } from '../service/predicate.service';
import { IBindingValues, IElementBinding } from './hl7-v2-tree.service';
import { AResourceRepositoryService } from './resource-repository.service';

export interface IBindingMap {
  [bindingPath: string]: IBindingNode[];
}

export interface IBindingContext {
  resource: Type;
  element?: Type;
}

export interface IBindingProperties {
  context: IBindingContext;
  level: number;
  props: IStructureElementBindingProperties;
}

export interface IBindingNode {
  context: IBindingContext;
  level: number;
  binding: IStructureElementBinding;
}

export interface IElementBinding {
  children: IBindingMap;
  values: IBindingValues;
}

export type IBindingValues = {
  [K in keyof IStructureElementBindingProperties]?: Array<IBinding<IStructureElementBindingProperties[K]>>
};

export interface IBinding<T> {
  context: IBindingContext;
  level: number;
  value: T;
}

@Injectable({
  providedIn: 'root',
})
export class Hl7V2TreeService {

  constructor(private predicate: PredicateService) { }

  nodeType(node: IHL7v2TreeNode): Type {
    return node ? (node.parent && node.parent.data.type === Type.COMPONENT) ? Type.SUBCOMPONENT : node.data.type : undefined;
  }

  formatBindings(nodes: IBindingNode[]): IBindingMap {
    const payload: IBindingMap = {};
    nodes.forEach((node) => {
      if (!payload[node.binding.elementId]) {
        payload[node.binding.elementId] = [];
      }
      payload[node.binding.elementId].push({
        context: node.context,
        binding: node.binding,
        level: node.level,
      });
    });
    return payload;
  }

  mergeBindings(fromParent: IBindingNode[], elementId, context: IBindingContext, elementBindings: IStructureElementBinding[], parentLevel: number): IElementBinding {
    const elementBinding = elementBindings.find((elm) => elm.elementId === elementId);
    const fromNodeChildrenBindings = elementBinding ? elementBinding.children.map((elm) => {
      return {
        context,
        level: parentLevel + 1,
        binding: elm,
      };
    }) : [];

    const fromParentChildrenBindings: IBindingNode[] = [];
    const properties: IBindingProperties[] = elementBinding ? [{
      props: this.getBindingProperties(elementBinding),
      level: parentLevel + 1,
      context,
    }] : [];

    fromParent.forEach((bindingsNode) => {
      bindingsNode.binding.children.forEach((elm) => {
        fromParentChildrenBindings.push({
          context: bindingsNode.context,
          level: bindingsNode.level,
          binding: elm,
        });
      });
      properties.push({
        context: bindingsNode.context,
        level: bindingsNode.level,
        props: this.getBindingProperties(bindingsNode.binding),
      });
    });

    return {
      values: this.bindingValues(properties),
      children: this.formatBindings([...fromNodeChildrenBindings, ...fromParentChildrenBindings]),
    };
  }

  getBindingProperties(binding: IStructureElementBinding): IStructureElementBindingProperties {
    return {
      valuesetBindings: binding.valuesetBindings,
      predicateId: binding.predicateId,
      externalSingleCode: binding.externalSingleCode,
      internalSingleCode: binding.internalSingleCode,
    };
  }

  bindingValues(properties: IBindingProperties[]): IBindingValues {
    const values: IBindingValues = {};
    // ValueSetBindings
    const pick = (key: string, predicate: (properties: IStructureElementBindingProperties) => boolean) => {
      values[key] = properties.filter((property) => property.props[key] && predicate(property.props)).map((property) => {
        return {
          context: property.context,
          level: property.level,
          value: property.props[key],
        };
      }).sort((a, b) => {
        return a.level - b.level;
      });
    };

    pick('valuesetBindings', (property) => property.valuesetBindings.length > 0);
    return values;
  }

  // tslint:disable-next-line: cognitive-complexity
  formatSegment(
    segment: ISegment,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    return repository.areLeafs(segment.children.map((child) => child.ref.id)).pipe(
      map((leafs) => {
        return segment.children.map((child) => {
          const reference = new BehaviorSubject({
            type: Type.DATATYPE,
            id: child.ref.id,
          });
          const level = parent ? parent.data.level + 1 : 0;
          const bindings = this.mergeBindings(parent ? parent.data.bindings.children[child.id] || [] : [], child.id, { resource: Type.SEGMENT }, segment.binding ? segment.binding.children || [] : [], level);
          let predicate;
          if (bindings.values.predicateId && bindings.values.predicateId.length > 0) {
            predicate = this.predicate.getPredicate('', bindings.values.predicateId[0].value);
          }
          return {
            data: {
              id: child.id,
              name: child.name,
              position: child.position,
              type: child.type,
              usage: {
                value: child.usage,
              },
              cardinality: {
                min: child.min,
                max: child.max,
              },
              length: {
                min: child.minLength,
                max: child.maxLength,
              },
              changeable,
              viewOnly,
              level,
              text: {
                value: child.text,
              },
              comments: child.comments || [],
              constantValue: {
                value: child.constantValue,
              },
              pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
              confLength: child.confLength,
              ref: reference,
              bindings,
            },
            leaf: leafs[child.ref.id],
            $hl7V2TreeHelpers: {
              predicate$: predicate,
              ref$: reference.asObservable(),
              treeChildrenSubscription: undefined,
            },
          };
        }).sort((a, b) => a.data.position - b.data.position);
      }),
    );
  }

  // tslint:disable-next-line: cognitive-complexity
  formatDatatype(
    datatype: IDatatype,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    const components = datatype.components || [];
    return repository.areLeafs(components.map((child) => child.ref.id)).pipe(
      map((leafs) => {
        return components.map((child) => {
          const reference = new BehaviorSubject({
            type: Type.DATATYPE,
            id: child.ref.id,
          });
          const level = parent ? parent.data.level + 1 : 0;
          let parentBindings = [];
          let currentBindings = [];
          if (parent && parent.data.bindings.children[child.id]) {
            parentBindings = parent.data.bindings.children[child.id];
          }
          if (datatype.binding && datatype.binding.children) {
            currentBindings = datatype.binding.children;
          }
          const bindings = this.mergeBindings(parentBindings, child.id, { resource: Type.DATATYPE, element: this.nodeType(parent) }, currentBindings, level);
          let predicate;
          if (bindings.values.predicateId && bindings.values.predicateId.length > 0) {
            predicate = this.predicate.getPredicate('', bindings.values.predicateId[0].value);
          }
          return {
            data: {
              id: child.id,
              name: child.name,
              position: child.position,
              type: child.type,
              usage: {
                value: child.usage,
              },
              length: {
                min: child.minLength,
                max: child.maxLength,
              },
              changeable,
              viewOnly,
              level,
              text: {
                value: child.text,
              },
              comments: child.comments || [],
              constantValue: {
                value: child.constantValue,
              },
              pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
              confLength: child.confLength,
              ref: reference,
              bindings,
            },
            leaf: leafs[child.ref.id],
            $hl7V2TreeHelpers: {
              predicate$: predicate,
              ref$: reference.asObservable(),
              treeChildrenSubscription: undefined,
            },
          };
        }).sort((a, b) => a.data.position - b.data.position);
      }),
    );
  }

  getAllSegmentRef(msgElms: IMsgStructElement[]): string[] {
    let segments = [];
    for (const elm of msgElms) {
      if (elm.type === Type.SEGMENTREF) {
        segments.push((elm as ISegmentRef).ref.id);
      } else if (elm.type === Type.GROUP) {
        segments = segments.concat(this.getAllSegmentRef((elm as IGroup).children));
      }
    }
    return segments;
  }

  formatConformanceProfile(
    confProfile: IConformanceProfile,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    const segmentRefs = this.getAllSegmentRef(confProfile.children);
    return combineLatest(
      repository.areLeafs(segmentRefs),
      from(segmentRefs).pipe(
        mergeMap((id) => {
          return repository.getResource(Type.SEGMENT, id).pipe(take(1), map((res) => res as ISegment));
        }),
        toArray(),
        map((segments) => {
          const segmentsMap = {};
          segments.forEach((segment) => {
            segmentsMap[segment.id] = segment;
          });
          return segmentsMap;
        }),
      )).pipe(
        map(([leafs, segments]) => {
          return this.formatStructure(confProfile.binding ? confProfile.binding.children || [] : [], confProfile.children, segments, leafs, viewOnly, changeable, parent);
        }),
      );
  }

  // tslint:disable-next-line: cognitive-complexity
  formatStructure(
    bindings: IStructureElementBinding[],
    structure: IMsgStructElement[],
    segments: { [id: string]: ISegment },
    leafs: { [id: string]: boolean },
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): IHL7v2TreeNode[] {
    return structure.map((child) => {
      const leaf = child.type === Type.SEGMENTREF ? leafs[(child as ISegmentRef).ref.id] : !(child as IGroup).children || (child as IGroup).children.length === 0;
      const reference = new BehaviorSubject({
        type: child.type === Type.SEGMENTREF ? Type.SEGMENT : child.type,
        id: child.type === Type.SEGMENTREF ? (child as ISegmentRef).ref.id : undefined,
      });
      const name = child.type === Type.GROUP ? child.name : segments[(child as ISegmentRef).ref.id].name;
      const level = parent ? parent.data.level + 1 : 0;
      const bds = this.mergeBindings([], child.id, { resource: Type.COMPOSITEPROFILE }, bindings, level);
      let predicate;
      if (bds.values.predicateId && bds.values.predicateId.length > 0) {
        predicate = this.predicate.getPredicate('', bds.values.predicateId[0].value);
      }
      const childNode: IHL7v2TreeNode = {
        data: {
          id: child.id,
          name,
          position: child.position,
          type: child.type === Type.SEGMENTREF ? Type.SEGMENT : child.type,
          usage: {
            value: child.usage,
          },
          cardinality: {
            min: child.min,
            max: child.max,
          },
          changeable,
          viewOnly,
          level,
          text: {
            value: child.text,
          },
          comments: child.comments || [],
          pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
          ref: reference,
          bindings: bds,
        },
        leaf,
        $hl7V2TreeHelpers: {
          predicate$: predicate,
          ref$: reference.asObservable(),
          treeChildrenSubscription: undefined,
        },
      };
      childNode.children = [
        ...((!leaf && child.type === Type.GROUP) ? this.formatStructure([], (child as IGroup).children, segments, leafs, viewOnly, changeable, childNode) : []),
      ];
      return childNode;
    }).sort((a, b) => a.data.position - b.data.position);
  }
}
