import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TreeNode } from 'primeng/primeng';
import { BehaviorSubject, combineLatest, from, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { filter, flatMap, map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';
import { ICardinalityRange, IHL7v2TreeNode, ILengthRange, IResourceRef, IStringValue } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { Usage } from '../constants/usage.enum';
import { IStructureElementBinding, IStructureElementBindingProperties } from '../models/binding.interface';
import { IComment } from '../models/comment.interface';
import { IConformanceProfile, IGroup, IMsgStructElement, ISegmentRef } from '../models/conformance-profile.interface';
import { IPath } from '../models/cs.interface';
import { IDatatype } from '../models/datatype.interface';
import { IRef } from '../models/ref.interface';
import { IResource } from '../models/resource.interface';
import { ISegment } from '../models/segment.interface';
import { BindingService } from './binding.service';
import { PredicateService } from './predicate.service';
import { AResourceRepositoryService, IRefData } from './resource-repository.service';

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

  pathToString(path: IPath) {
    if (!path) {
      return '';
    } else {
      return path.elementId + '-' + this.pathToString(path.child);
    }
  }

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
      },
    };
  }

  nodeType(node: IHL7v2TreeNode): Type {
    return node ? (node.parent && node.parent.data.type === Type.COMPONENT) ? Type.SUBCOMPONENT : node.data.type : undefined;
  }

  getLastChild(p: IPath): IPath {
    if (p.child) {
      return this.getLastChild(p.child);
    } else {
      return p;
    }
  }

  concatOverlapPath(pre: IPath, post: IPath): IPath {
    // If there are no prefixes return postfix
    if (!pre) {
      return _.cloneDeep(post);
    }
    // If there are no postfixes return prefix
    if (!post) {
      return _.cloneDeep(pre);
    }

    const resultPath = _.cloneDeep(pre);
    const prefixLastChild = this.getLastChild(resultPath);

    // check overlap
    if (prefixLastChild.elementId === post.elementId) {
      prefixLastChild.child = _.cloneDeep(post.child);
      return resultPath;
    } else {
      throw new Error('Cannot concat paths');
    }
  }

  straightConcatPath(pre: IPath, post: IPath): IPath {
    // If there are no prefixes return postfix
    if (!pre) {
      return _.cloneDeep(post);
    }
    // If there are no postfixes return prefix
    if (!post) {
      return _.cloneDeep(pre);
    }

    const resultPath = _.cloneDeep(pre);
    const prefixLastChild = this.getLastChild(resultPath);
    prefixLastChild.child = _.cloneDeep(post);
    return resultPath;
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

  // tslint:disable-next-line: cognitive-complexity
  getNameFromPath(elm: IPathInfo, excludeDesc: boolean = false): string {
    const loop = (node: IPathInfo): string => {
      if (!node) {
        return '';
      }
      const post = loop(node.child);
      const separator = node.child ? node.child.type === Type.FIELD ? '-' : '.' : '';
      let desc: string;

      if (node.child || excludeDesc) {
        desc = '';
      } else {
        desc = ' (' + node.name + ')';
      }

      if (node.type === Type.GROUP || node.type === Type.SEGMENT || node.type === Type.SEGMENTREF || node.type === Type.DATATYPE) {
        return node.name + separator + post;
      } else if (node.type === Type.CONFORMANCEPROFILE) {
        return post ? post : node.name;
      } else {
        return node.position + separator + post + desc;
      }
    };
    return loop(elm);
  }

  getNodeName(node: IHL7v2TreeNode, appendName: boolean = false): string {
    return this.getNameFromPath(this.getPathInfo(node), !appendName);
  }

  getPathInfo(node: IHL7v2TreeNode): IPathInfo {
    const loop = (elm: IHL7v2TreeNode): IPathInfo[] => {
      if (elm.parent) {
        const parentPathInfoList = loop(elm.parent);
        parentPathInfoList.push({
          name: elm.data.name,
          id: elm.data.id,
          type: elm.data.type,
          position: elm.data.position,
          leaf: elm.leaf,
        });
        return parentPathInfoList;
      } else {
        return [
          {
            name: elm.data.name,
            id: elm.data.id,
            type: elm.data.type,
            position: elm.data.position,
            leaf: elm.leaf,
          },
        ];
      }
    };

    const chain: IPathInfo[] = loop(node);
    return chain.reverse().reduce((pV, cV) => {
      cV.child = pV;
      return cV;
    });
  }

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

  getPathNameWithLocation(resource: IResource, repository: AResourceRepositoryService, location: string): Observable<IPathInfo> {
    const elms = location.split('-');
    const pathOf = (list: string[]): IPath => {
      if (list && list.length > 0) {
        return {
          elementId: list[0],
          child: pathOf(list.slice(1)),
        };
      } else {
        return undefined;
      }
    };
    return this.getPathName(resource, repository, pathOf(elms));
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
          if (next.type === Type.SEGMENTREF) {
            repository.fetchResource(Type.SEGMENT, next.ref.id).pipe(
              take(1),
              tap((segment) => {
                pathInfo.child.name = segment.name;
                subject.next(intialPathInfo);
                subject.complete();
              }),
            ).subscribe();
          } else {
            subject.next(intialPathInfo);
            subject.complete();
          }
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
                    take(1),
                    tap(this.addChildren(node, then, transform)),
                  );
                case Type.SEGMENT:
                  return this.formatSegment(resource as ISegment, repository, viewOnly, false, node).pipe(
                    take(1),
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

  mergeBindings(fromParent: IBindingNode[], elementId: string, context: IBindingContext, elementBindings: IStructureElementBinding[], parentLevel: number): IElementBinding {
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
      predicate: binding.predicate,
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
    pick('internalSingleCode', (property) => true);
    pick('predicate', (property) => true);
    return values;
  }

  createReference(refsData: IRefData, type: Type, id: string): BehaviorSubject<IResourceRef> {
    return new BehaviorSubject({
      type,
      id,
      name: refsData[id].name,
      version: refsData[id].version,
    });
  }

  // tslint:disable-next-line: cognitive-complexity
  formatSegment(
    segment: ISegment,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    return repository.getRefData(segment.children.map((child) => child.ref.id), Type.DATATYPE).pipe(
      take(1),
      map((refsData) => {

        return segment.children.map((child) => {
          const reference = this.createReference(refsData, Type.DATATYPE, child.ref.id);
          const level = parent ? parent.data.level + 1 : 0;
          const bindings = this.mergeBindings(parent ? parent.data.bindings.children[child.id] || [] : [], child.id, { resource: Type.SEGMENT }, segment.binding ? segment.binding.children || [] : [], level);
          return {
            data: {
              id: child.id,
              name: child.name,
              position: child.position,
              type: child.type,
              usage: {
                value: child.usage,
              },
              rootPath: this.straightConcatPath(parent ? parent.data.rootPath : { elementId: segment.id }, { elementId: child.id }),
              oldUsage: child.oldUsage,
              cardinality: {
                min: child.min,
                max: child.max,
              },
              length: {
                min: child.minLength,
                max: child.maxLength,
              },
              lengthType: child.lengthType,
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
              custom: child.custom,
              valueSetBindingsInfo: this.bindingService.getBingdingInfo(refsData[child.ref.id].version, segment.name, refsData[child.ref.id].name, child.position, Type.SEGMENT),
              pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
              confLength: child.confLength,
              ref: reference,
              bindings,
            },
            parent,
            leaf: refsData[child.ref.id].leaf,
            $hl7V2TreeHelpers: {
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

    return repository.getRefData(components.map((child) => child.ref.id), Type.DATATYPE).pipe(
      take(1),
      map((refsData) => {
        return components.map((child) => {
          const reference = this.createReference(refsData, Type.DATATYPE, child.ref.id);
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
          return {
            data: {
              id: child.id,
              name: child.name,
              position: child.position,
              type: child.type,
              usage: {
                value: child.usage,
              },
              rootPath: this.straightConcatPath(parent ? parent.data.rootPath : { elementId: datatype.id }, { elementId: child.id }),
              oldUsage: child.oldUsage,
              length: {
                min: child.minLength,
                max: child.maxLength,
              },
              lengthType: child.lengthType,
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
            parent,
            leaf: refsData[child.ref.id].leaf,
            $hl7V2TreeHelpers: {
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
    console.log(confProfile);
    const segmentRefs = this.getAllSegmentRef(confProfile.children);
    return combineLatest(
      repository.getRefData(segmentRefs, Type.SEGMENT).pipe(
        take(1),
      ),
      from(segmentRefs).pipe(
        mergeMap((id) => {
          return repository.getResource(Type.SEGMENT, id).pipe(
            take(1),
            map((res) => res as ISegment),
          );
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
        take(1),
        map(([refsData, segments]) => {
          return this.formatStructure(confProfile.binding ? confProfile.binding.children || [] : [], confProfile.children, segments, refsData, viewOnly, changeable, confProfile, parent);
        }),
      );
  }

  // tslint:disable-next-line: cognitive-complexity
  formatStructure(
    bindings: IStructureElementBinding[],
    structure: IMsgStructElement[],
    segments: { [id: string]: ISegment },
    refsData: IRefData,
    viewOnly: boolean,
    changeable: boolean,
    cp: IConformanceProfile,
    parent?: IHL7v2TreeNode): IHL7v2TreeNode[] {
    return structure.map((child) => {
      const leaf = child.type === Type.SEGMENTREF ? refsData[(child as ISegmentRef).ref.id].leaf : !(child as IGroup).children || (child as IGroup).children.length === 0;
      const reference = child.type === Type.SEGMENTREF ? this.createReference(refsData, Type.SEGMENT, (child as ISegmentRef).ref.id) : undefined;
      const name = child.type === Type.GROUP ? child.name : segments[(child as ISegmentRef).ref.id].name;
      const level = parent ? parent.data.level + 1 : 0;
      const bds = this.mergeBindings(parent ? parent.data.bindings.children[child.id] || [] : [], child.id, { resource: Type.COMPOSITEPROFILE }, bindings, level);
      const childNode: IHL7v2TreeNode = this.makeMsgStructureElmNode(
        name,
        parent,
        child,
        {
          changeable,
          viewOnly,
          leaf,
        },
        level,
        reference,
        bds,
        cp,
      );
      childNode.children = [
        ...((!leaf && child.type === Type.GROUP) ? this.formatStructure([], (child as IGroup).children, segments, refsData, viewOnly, changeable, cp, childNode) : []),
      ];
      return childNode;
    }).sort((a, b) => a.data.position - b.data.position);
  }

  nodeToSegmentRef(node: IHL7v2TreeNode): ISegmentRef {
    return {
      id: node.data.id,
      name: node.data.name,
      position: node.data.position,
      usage: node.data.usage.value as Usage,
      oldUsage: node.data.oldUsage,
      type: Type.SEGMENTREF,
      custom: node.data.custom,
      min: node.data.cardinality.min,
      max: node.data.cardinality.max,
      comments: node.data.comments,
      ref: {
        id: node.data.ref.getValue().id,
      },
    };
  }

  makeMsgStructureElmNode(
    name: string,
    parent: IHL7v2TreeNode,
    child: IMsgStructElement,
    view: {
      changeable: boolean,
      viewOnly: boolean,
      leaf: boolean,
    },
    level: number,
    reference: BehaviorSubject<IResourceRef>,
    bds: IElementBinding,
    cp: IConformanceProfile,
  ): IHL7v2TreeNode {
    return {
      data: {
        id: child.id,
        name,
        position: child.position,
        type: child.type === Type.SEGMENTREF ? Type.SEGMENT : child.type,
        usage: {
          value: child.usage,
        },
        rootPath: this.straightConcatPath(parent ? parent.data.rootPath : { elementId: cp.id }, { elementId: child.id }),
        oldUsage: child.oldUsage,
        cardinality: {
          min: child.min,
          max: child.max,
        },
        changeable: view.changeable,
        viewOnly: view.viewOnly,
        level,
        text: {
          value: child.text,
        },
        comments: child.comments || [],
        pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
        ref: reference,
        bindings: bds,
        custom: child.custom,
      },
      leaf: view.leaf,
      parent,
      $hl7V2TreeHelpers: {
        ref$: child.type === Type.SEGMENTREF ? reference.asObservable() : undefined,
        treeChildrenSubscription: undefined,
      },
      children: [],
    };
  }

}
