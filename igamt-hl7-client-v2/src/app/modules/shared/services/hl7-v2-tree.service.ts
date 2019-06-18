import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IStructureElementBinding, IStructureElementBindingProperties } from '../models/binding.interface';
import { IConformanceProfile, IGroup, ISegmentRef } from '../models/conformance-profile.interface';
import { IDatatype } from '../models/datatype.interface';
import { ISegment } from '../models/segment.interface';
import { IStructureElement } from '../models/structure-element.interface';
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

  constructor() { }

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
      constantValue: binding.constantValue,
      comments: binding.comments,
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
              pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
              confLength: child.confLength,
              ref: reference,
              bindings: this.mergeBindings(parent ? parent.data.bindings.children[child.id] || [] : [], child.id, { resource: Type.SEGMENT }, segment.binding ? segment.binding.children || [] : [], level),
            },
            leaf: leafs[child.ref.id],
            $hl7V2TreeHelpers: {
              ref$: reference.asObservable(),
              treeChildrenSubscription: undefined,
            },
          };
        }).sort((a, b) => a.data.position - b.data.position);
      }),
    );
  }

  formatDatatype(
    datatype: IDatatype,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    return repository.areLeafs(datatype.components ? datatype.components.map((child) => child.ref.id) : []).pipe(
      map((leafs) => {
        if (datatype.components) {
          return datatype.components.map((child) => {
            const reference = new BehaviorSubject({
              type: Type.DATATYPE,
              id: child.ref.id,
            });
            const level = parent ? parent.data.level + 1 : 0;
            const bindings = this.mergeBindings(parent ? parent.data.bindings.children[child.id] || [] : [], child.id, { resource: Type.DATATYPE, element: this.nodeType(parent) }, datatype.binding ? datatype.binding.children || [] : [], level);
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
                pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
                confLength: child.confLength,
                ref: reference,
                bindings,
              },
              leaf: leafs[child.ref.id],
              $hl7V2TreeHelpers: {
                ref$: reference.asObservable(),
                treeChildrenSubscription: undefined,
              },
            };
          }).sort((a, b) => a.data.position - b.data.position);
        } else {
          return [];
        }
      }),
    );
  }

  formatConformanceProfile(
    confProfile: IConformanceProfile,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    return repository.areLeafs(confProfile.children.filter((elm) => elm.type === Type.SEGMENT).map((child) => (child as ISegmentRef).ref.id)).pipe(
      map((leafs) => {
        return this.formatStructure(confProfile.binding ? confProfile.binding.children || [] : [], confProfile.children, leafs, viewOnly, changeable, parent);
      }),
    );
  }

  formatStructure(
    bindings: IStructureElementBinding[],
    structure: IStructureElement[],
    leafs: { [id: string]: boolean },
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): IHL7v2TreeNode[] {
    return structure.map((child) => {
      const leaf = child.type === Type.SEGMENT ? leafs[(child as ISegmentRef).ref.id] : !(child as IGroup).children || (child as IGroup).children.length === 0;
      const reference = new BehaviorSubject({
        type: child.type,
        id: child.type === Type.SEGMENT ? (child as ISegmentRef).ref.id : undefined,
      });
      const level = parent ? parent.data.level + 1 : 0;
      return {
        data: {
          id: child.id,
          name: child.name,
          position: child.position,
          type: child.type,
          usage: {
            value: child.usage,
          },
          changeable,
          viewOnly,
          level,
          text: {
            value: child.text,
          },
          pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
          ref: reference,
          bindings: this.mergeBindings([], child.id, { resource: Type.COMPOSITEPROFILE }, bindings, level),
        },
        leaf,
        $hl7V2TreeHelpers: {
          ref$: reference.asObservable(),
          treeChildrenSubscription: undefined,
        },
        children: [
          ...((!leaf && child.type === Type.GROUP) ? this.formatStructure([], (child as IGroup).children, leafs, viewOnly, changeable, parent) : []),
        ],
      };
    }).sort((a, b) => a.data.position - b.data.position);
  }
}
