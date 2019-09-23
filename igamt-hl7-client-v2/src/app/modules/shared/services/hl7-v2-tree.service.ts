import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { BehaviorSubject, combineLatest, from, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { filter, flatMap, map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';
import { ICardinalityRange, IHL7v2TreeNode, ILengthRange, IResourceRef, IStringValue } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IStructureElementBinding, IStructureElementBindingProperties } from '../models/binding.interface';
import { IComment } from '../models/comment.interface';
import { IConformanceProfile, IGroup, IMsgStructElement, ISegmentRef } from '../models/conformance-profile.interface';
import { IPath } from '../models/cs.interface';
import { IDatatype } from '../models/datatype.interface';
import { IRef } from '../models/ref.interface';
import { IResource } from '../models/resource.interface';
import { ISegment } from '../models/segment.interface';
import { PredicateService } from '../service/predicate.service';
import { BindingService } from './binding.service';
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

export type NamedChildrenList = INamedChildrenItem[];

export interface INamedChildrenItem {
  name: string;
  id: string;
  ref?: IRef;
  type: Type;
  children?: NamedChildrenList;
  position: number;
  leaf: boolean;
}

export interface IPathInfo {
  name: string;
  id: string;
  type: Type;
  position: number;
  leaf: boolean;
  child?: IPathInfo;
}

@Injectable({
  providedIn: 'root',
})
export class Hl7V2TreeService {

  constructor(private predicate: PredicateService, private bindingService: BindingService) { }

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
        text: cloneTextValue(node.data.text),
        cardinality: cloneRange(node.data.cardinality) as ICardinalityRange,
        length: cloneRange(node.data.length) as ILengthRange,
        comments: cloneComments(node.data.comments),
        constantValue: cloneTextValue(node.data.constantValue),
        pathId: node.data.pathId,
        changeable: node.data.changeable,
        viewOnly: node.data.viewOnly,
        confLength: node.data.confLength,
        valueSetBindingsInfo: node.data.valueSetBindingsInfo,
        ref,
        bindings: node.data.bindings,
        level: node.data.level,
      },
      leaf: node.leaf,
      $hl7V2TreeHelpers: {
        ref$: ref.asObservable(),
        treeChildrenSubscription: undefined,
      },
    };
  }

  nodeType(node: IHL7v2TreeNode): Type {
    return node ? (node.parent && node.parent.data.type === Type.COMPONENT) ? Type.SUBCOMPONENT : node.data.type : undefined;
  }

  getBindingsForContext<T>(context: IBindingContext, bindings: Array<IBinding<T>>): IBinding<T> {
    for (const binding of bindings) {
      if (binding.context.resource === context.resource && binding.context.element === context.element) {
        return binding;
      }
    }
    return undefined;
  }

  getBindingsAfterContext<T>(context: IBindingContext, bindings: Array<IBinding<T>>): IBinding<T> {
    const bindingsClone = [...bindings].sort((a, b) => {
      return a.level - b.level;
    });
    const binding = this.getBindingsForContext<T>(context, bindingsClone);
    if (!binding && bindings.length > 0) {
      return bindings[0];
    } else {
      for (const bd of bindingsClone) {
        if (bd.level > binding.level) {
          return bd;
        }
      }
    }
    return undefined;
  }

  concatPath(pre: IPath, post: IPath): IPath {
    const path = pre ? {
      elementId: pre.elementId,
      instanceParameter: pre.instanceParameter,
    } : post;
    let writer = path;
    let reader = pre;
    while (reader) {

      if (reader.elementId === post.elementId) {
        reader = post.child;
      } else {
        reader = reader.child;
      }

      if (reader) {
        writer.child = {
          elementId: reader.elementId,
          instanceParameter: reader.instanceParameter,
        };
      }
      writer = writer.child;
    }

    return path;
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

  getNameFromPath(elm: IPathInfo): string {
    const loop = (node: IPathInfo): string => {
      if (!node) {
        return '';
      }
      const post = loop(node.child);
      const separator = node.child ? node.child.type === Type.FIELD ? '-' : '.' : '';
      const desc = node.child ? '' : ' (' + node.name + ')';
      if (node.type === Type.GROUP || node.type === Type.SEGMENT || node.type === Type.SEGMENTREF || node.type === Type.DATATYPE) {
        return node.name + separator + post;
      } else if (node.type === Type.CONFORMANCEPROFILE) {
        return post;
      } else {
        return node.position + separator + post + desc;
      }
    };
    return loop(elm);
  }

  // this.bindingService.getBingdingInfo('2.3.1', 'HD', 1, Type.DATATYPE, this.bindingConfig)

  getChildrenListFromResource(resource: IResource, repository: AResourceRepositoryService): Observable<NamedChildrenList> {
    const toListItem = (leafs) => (field) => {
      return {
        id: field.id,
        name: field.name,
        position: field.position,
        leaf: leafs[field.ref.id],
        type: field.type,
        ref: field.ref,
      };
    };

    switch (resource.type) {
      case Type.SEGMENT:
        return repository.areLeafs((resource as ISegment).children.map((child) => child.ref.id)).pipe(
          take(1),
          map((leafs) => {
            return (resource as ISegment).children.map(toListItem(leafs));
          }),
        );
      case Type.DATATYPE:
        return repository.areLeafs(((resource as IDatatype).components || []).map((child) => child.ref.id)).pipe(
          take(1),
          map((leafs) => {
            return ((resource as IDatatype).components || []).map(toListItem(leafs));
          }),
        );
      case Type.CONFORMANCEPROFILE:
        const profile = resource as IConformanceProfile;
        const segmentRefs = this.getAllSegmentRef(profile.children);
        return repository.areLeafs(segmentRefs).pipe(
          take(1),
          map((leafs) => {
            const itemize = (elm) => {
              return {
                id: elm.id,
                name: elm.name,
                position: elm.position,
                leaf: false,
                type: elm.type,
                ref: elm.type === Type.SEGMENTREF ? (elm as ISegmentRef).ref : undefined,
                children: elm.type === Type.GROUP ? ((elm as IGroup).children || []).map(itemize) : undefined,
              };
            };
            return profile.children.map(itemize);
          }),
        );
    }
  }

  getChildrenListFromRef(type: Type, id: string, repository: AResourceRepositoryService, seg?: IPathInfo): Observable<NamedChildrenList> {
    return repository.fetchResource(type, id).pipe(
      take(1),
      flatMap((resource) => {
        if (seg) {
          seg.name = resource.name;
        }
        return this.getChildrenListFromResource(resource, repository);
      }),
    );
  }

  // tslint:disable-next-line: cognitive-complexity
  getPathName(resource: IResource, repository: AResourceRepositoryService, path: IPath): Observable<IPathInfo> {
    const pathSubject = new ReplaySubject<IPathInfo>(1);
    const refType = (type: Type) => {
      if (type === Type.FIELD || type === Type.COMPONENT || type === Type.SUBCOMPONENT) {
        return Type.DATATYPE;
      } else {
        return Type.SEGMENT;
      }
    };
    const intialPathInfo = {
      id: resource.id,
      name: resource.name,
      type: resource.type,
      position: -1,
      leaf: false,
    };

    const fn = (children: NamedChildrenList, portion: IPath, pathInfo: IPathInfo, subject: Subject<IPathInfo>) => {
      const next = children.find((child) => {
        return child.id === portion.elementId;
      });

      if (next) {
        pathInfo.child = {
          name: next.name,
          id: next.id,
          type: next.type,
          position: next.position,
          leaf: next.leaf,
        };

        if (portion.child) {
          if (next.leaf) {
            subject.complete();
          } else {
            if (next.ref) {
              this.getChildrenListFromRef(refType(next.type), next.ref.id, repository,
                next.type === Type.SEGMENTREF ? pathInfo.child : undefined).pipe(
                  take(1),
                  map((list) => {
                    fn(list, portion.child, pathInfo.child, subject);
                  }),
                ).subscribe();
            } else {
              fn(next.children, portion.child, pathInfo.child, subject);
            }
          }
        } else {
          subject.next(intialPathInfo);
          subject.complete();
        }
      } else {
        subject.complete();
      }
    };

    if (path) {
      this.getChildrenListFromResource(resource, repository).pipe(
        take(1),
        map((list) => {
          fn(list, path, intialPathInfo, pathSubject);
        }),
      ).subscribe();
    } else {
      pathSubject.next(intialPathInfo);
      pathSubject.complete();
    }
    return pathSubject.asObservable();
  }

  getTree(resource: IResource, repository: AResourceRepositoryService, viewOnly: boolean, changeable: boolean, then?: (value: any) => void): Subscription {
    switch (resource.type) {
      case Type.DATATYPE:
        return this.formatDatatype(resource as IDatatype, repository, viewOnly, changeable).pipe(
          take(1),
          tap(then),
        ).subscribe();
      case Type.SEGMENT:
        return this.formatSegment(resource as ISegment, repository, viewOnly, changeable).pipe(
          take(1),
          tap(then),
        ).subscribe();
      case Type.CONFORMANCEPROFILE:
        return this.formatConformanceProfile(resource as IConformanceProfile, repository, viewOnly, changeable).pipe(
          take(1),
          tap(then),
        ).subscribe();
    }
  }

  resolveReference(node: IHL7v2TreeNode, repository: AResourceRepositoryService, viewOnly: boolean, then?: () => void, transform?: (children: IHL7v2TreeNode[]) => IHL7v2TreeNode[]): Subscription {
    if (node.data.ref && node.$hl7V2TreeHelpers && (!node.$hl7V2TreeHelpers.treeChildrenSubscription || node.$hl7V2TreeHelpers.treeChildrenSubscription.closed)) {
      node.$hl7V2TreeHelpers.treeChildrenSubscription = node.data.ref.asObservable().pipe(
        filter((ref) => ref.type === Type.DATATYPE || ref.type === Type.SEGMENT),
        switchMap((ref) => {
          return repository.fetchResource(ref.type, ref.id).pipe(
            switchMap((resource) => {
              switch (ref.type) {
                case Type.DATATYPE:
                  return this.formatDatatype(resource as IDatatype, repository, viewOnly, false, node).pipe(
                    tap(this.addChildren(node, then, transform)),
                  );
                case Type.SEGMENT:
                  return this.formatSegment(resource as ISegment, repository, viewOnly, false, node).pipe(
                    tap(this.addChildren(node, then, transform)),
                    tap(() => node.data.name = (resource as ISegment).name),
                  );
              }
            }),
          );
        }),
      ).subscribe();
      return node.$hl7V2TreeHelpers.treeChildrenSubscription;
    }
    return undefined;
  }

  addChildren(node: IHL7v2TreeNode, then?: () => void, transform?: (children: IHL7v2TreeNode[]) => IHL7v2TreeNode[]): (nodes: IHL7v2TreeNode[]) => void {
    return (nodes: IHL7v2TreeNode[]) => {
      if (nodes && nodes.length > 0) {
        node.children = transform ? transform(nodes) : nodes;
        node.leaf = false;
      } else {
        node.children = [];
        node.expanded = true;
        node.leaf = true;
      }
      then();
    };
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
    return repository.getRefData(segment.children.map((child) => child.ref.id)).pipe(
      map((refsData) => {
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
              valueSetBindingsInfo: this.bindingService.getBingdingInfo(refsData[child.ref.id].version, segment.name, refsData[child.ref.id].name, child.position, Type.SEGMENT),
              pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
              confLength: child.confLength,
              ref: reference,
              bindings,
            },
            leaf: refsData[child.ref.id].leaf,
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
    return repository.getRefData(components.map((child) => child.ref.id)).pipe(
      map((refsData) => {
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
              valueSetBindingsInfo: this.bindingService.getBingdingInfo(refsData[child.ref.id].version, datatype.name, refsData[child.ref.id].name, child.position, Type.DATATYPE),
              pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
              confLength: child.confLength,
              ref: reference,
              bindings,
            },
            leaf: refsData[child.ref.id].leaf,
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
          ref: child.type === Type.SEGMENTREF ? reference : undefined,
          bindings: bds,
        },
        leaf,
        $hl7V2TreeHelpers: {
          predicate$: predicate,
          ref$: child.type === Type.SEGMENTREF ? reference.asObservable() : undefined,
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
