import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, EMPTY, from, Observable, of, ReplaySubject, Subscription, throwError } from 'rxjs';
import { filter, flatMap, map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';
import { IHL7v2TreeNode, IHL7v2TreeNodeData, IResourceRef } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { Usage } from '../constants/usage.enum';
import { IStructureElementBinding } from '../models/binding.interface';
import { IConformanceProfile, IGroup, IHL7MessageProfile, IMessageStructure, IMsgStructElement, ISegmentRef } from '../models/conformance-profile.interface';
import { IPath } from '../models/cs.interface';
import { IComponent, IDatatype } from '../models/datatype.interface';
import { IItemProperty, IPropertyDatatype, IPropertyRef } from '../models/profile.component';
import { IResource } from '../models/resource.interface';
import { IChangeLog, ILocationChangeLog, PropertyType } from '../models/save-change';
import { IField, ISegment } from '../models/segment.interface';
import { IStructureElement, ISubStructElement } from '../models/structure-element.interface';
import { BindingService } from './binding.service';
import { PathService } from './path.service';
import { AResourceRepositoryService, IRefData, IRefDataInfo } from './resource-repository.service';
import { IBinding, IBindingContext, StructureElementBindingService } from './structure-element-binding.service';

@Injectable({
  providedIn: 'root',
})
export class Hl7V2TreeService {

  constructor(
    private valueSetBindingService: BindingService,
    private structureElementBindingService: StructureElementBindingService,
    private pathService: PathService,
  ) { }

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
      case Type.MESSAGESTRUCT:
        return this.formatMessageStructure(resource as IMessageStructure, repository, viewOnly, changeable).pipe(
          take(1),
          tap(then),
        ).subscribe();
    }
  }

  resolveReference(node: IHL7v2TreeNode, repository: AResourceRepositoryService, options?: {
    viewOnly?: boolean,
    then?: () => void,
    transform?: (children: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>,
    useProfileComponentRef?: boolean;
  }): Subscription {
    if (node.data.ref && node.$hl7V2TreeHelpers && (!node.$hl7V2TreeHelpers.treeChildrenSubscription || node.$hl7V2TreeHelpers.treeChildrenSubscription.closed)) {
      const viewOnly = options ? !!options.viewOnly : true;
      const then = options ? options.then : undefined;
      const transform = options ? options.transform : undefined;
      const useProfileComponentRef = options ? !!options.useProfileComponentRef : false;
      node.$hl7V2TreeHelpers.treeChildrenSubscription = this.getNodeRef(
        node,
        repository,
        { useProfileComponentRef },
      ).pipe(
        filter((ref) => ref.type === Type.DATATYPE || ref.type === Type.SEGMENT),
        switchMap((ref) => {
          return repository.fetchResource(ref.type, ref.id).pipe(
            switchMap((resource) => {
              switch (ref.type) {
                case Type.DATATYPE:
                  return this.formatDatatype(resource as IDatatype, repository, viewOnly, false, node).pipe(
                    take(1),
                    mergeMap(this.addChildren(node, then, transform)),
                  );
                case Type.SEGMENT:
                  return this.formatSegment(resource as ISegment, repository, viewOnly, false, node).pipe(
                    take(1),
                    mergeMap(this.addChildren(node, then, transform)),
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

  loadNodeChildren(node: IHL7v2TreeNode, repository: AResourceRepositoryService, options?: {
    viewOnly?: boolean,
    changeable?: boolean,
    useProfileComponentRef?: boolean;
    then?: () => void,
    transform?: (children: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>,
  }): Observable<IHL7v2TreeNode[]> {
    if (!node.data.ref) {
      return of(node.children);
    }
    const viewOnly = options ? !!options.viewOnly : true;
    const changeable = options ? !!options.changeable : false;
    const then = options ? options.then : undefined;
    const transform = options ? options.transform : undefined;
    const useProfileComponentRef = options ? !!options.useProfileComponentRef : false;
    return this.getNodeRef(node, repository, {
      useProfileComponentRef,
    }).pipe(
      take(1),
      flatMap((ref) => {
        return repository.fetchResource(ref.type, ref.id).pipe(
          take(1),
          mergeMap((resource) => {
            switch (ref.type) {
              case Type.DATATYPE:
                return this.formatDatatype(resource as IDatatype, repository, viewOnly, changeable, node).pipe(
                  take(1),
                  mergeMap(this.addChildren(node, then, transform)),
                );
              case Type.SEGMENT:
                return this.formatSegment(resource as ISegment, repository, viewOnly, changeable, node).pipe(
                  take(1),
                  tap(() => node.data.name = (resource as ISegment).name),
                  mergeMap(this.addChildren(node, then, transform)),
                );
            }
          }),
        );
      }),
    );
  }

  getNodeRef(node: IHL7v2TreeNode, repository: AResourceRepositoryService, options?: {
    useProfileComponentRef?: boolean;
  }): Observable<IResourceRef> {
    const useProfileComponentRef = options ? !!options.useProfileComponentRef : false;
    return combineLatest(
      node.data.ref,
      node.data.profileComponentOverrides ? node.data.profileComponentOverrides.asObservable() : of({}),
    ).pipe(
      mergeMap(([ref, properties]) => {
        const reference = node.data.type === Type.SEGMENTREF ? properties[PropertyType.SEGMENTREF] : properties[PropertyType.DATATYPE];
        if (useProfileComponentRef && reference) {
          return this.getResourceRefFromItemProperty(reference, repository);
        }
        return of(ref);
      }),
    );
  }

  getResourceRefFromItemProperty(property: IItemProperty, repository: AResourceRepositoryService): Observable<IResourceRef> {
    const type = property.propertyKey === PropertyType.DATATYPE ? Type.DATATYPE : Type.SEGMENT;
    const id = property.propertyKey === PropertyType.DATATYPE ? (property as IPropertyDatatype).datatypeId
      : (property as IPropertyRef).ref;
    return repository.getRefData([id], type).pipe(
      take(1),
      map((refData) => {
        return {
          type,
          id,
          name: refData[id].name,
          version: refData[id].version,
        };
      }),
    );
  }

  addChildren(node: IHL7v2TreeNode, then?: () => void, transform?: (children: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>): (nodes: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]> {
    return (nodes: IHL7v2TreeNode[]) => {
      const children$ = transform ? transform(nodes) : of(nodes);
      return children$.pipe(
        take(1),
        map((children) => {
          if (children && children.length > 0) {
            node.children = children;
            node.expanded = true;
            node.leaf = false;
          } else {
            node.children = [];
            node.expanded = true;
            node.leaf = true;
          }
          if (node.$hl7V2TreeHelpers && node.$hl7V2TreeHelpers.children$) {
            node.$hl7V2TreeHelpers.children$.next(node.children);
          }
          if (then) {
            then();
          }
          return children;
        }),
      );
    };
  }

  formatStructureElement(
    resource: IResource,
    bindings: IStructureElementBinding[],
    child: IStructureElement,
    changeable: boolean,
    viewOnly: boolean,
    parent?: IHL7v2TreeNode,
  ): IHL7v2TreeNodeData {
    const level = parent ? parent.data.level + 1 : 0;
    const context = { resource: resource.type, element: this.nodeType(parent) };
    const elementBindings = this.structureElementBindingService.getElementBinding(
      child.id,
      bindings,
      context,
      level,
      parent,
    );
    const changeLog = child.changeLog || (elementBindings && elementBindings.values.changeLog) ?
      this.mergeElmAndBindingChangeLog(child.changeLog || {}, context, elementBindings && elementBindings.values.changeLog ? elementBindings.values.changeLog : []) :
      {};
    const pathId = (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id;
    const resourcePathId = (parent && parent.data.resourcePathId) ? parent.data.resourcePathId + '-' + child.id : child.id;

    return {
      id: child.id,
      name: child.name,
      position: child.position,
      type: child.type,
      rootPath: parent ? this.pathService.straightConcatPath(parent.data.rootPath, { elementId: child.id }) : { elementId: child.id },
      usage: {
        value: child.usage,
      },
      oldUsage: child.oldUsage,
      text: {
        value: child.text,
      },
      custom: child.custom,
      changeLog,
      changeable,
      viewOnly,
      level,
      pathId,
      slicing: resource.slicings ? resource.slicings.find((x) => x.path === resourcePathId) : null,
      bindings: elementBindings,
      profileComponentOverrides: new BehaviorSubject({}),
      resourcePathId,
    };
  }

  mergeElmAndBindingChangeLog(elm: IChangeLog, context: IBindingContext, binding: Array<IBinding<IChangeLog>>): ILocationChangeLog {
    const changeLog: Array<{ log: IChangeLog, context: IBindingContext }> = [
      ...binding.map((b) => ({
        log: b.value,
        context: b.context,
      })),
      {
        log: elm,
        context,
      },
    ];

    return changeLog.reduce((acc, v) => {
      return this.mergeChangeLog(v.log, v.context, acc);
    }, {});
  }

  mergeChangeLog(elm: IChangeLog, context: IBindingContext, locationChangeLog: ILocationChangeLog): ILocationChangeLog {
    Object.keys(elm).forEach((e) => {
      locationChangeLog[e] = [
        ...(locationChangeLog[e] || []),
        {
          log: elm[e],
          context,
        },
      ];
    });
    return locationChangeLog;
  }

  formatMsgStructureElement(
    resource: IResource,
    bindings: IStructureElementBinding[],
    child: IMsgStructElement,
    changeable: boolean,
    viewOnly: boolean,
    parent?: IHL7v2TreeNode,
  ): IHL7v2TreeNodeData {
    return {
      ... this.formatStructureElement(
        resource,
        bindings,
        child,
        changeable,
        viewOnly,
        parent,
      ),
      cardinality: {
        min: child.min,
        max: child.max,
      },
      comments: child.comments || [],
    };
  }

  formatSubStructureElement(
    resource: IResource,
    bindings: IStructureElementBinding[],
    child: ISubStructElement,
    ref: IRefDataInfo,
    changeable: boolean,
    viewOnly: boolean,
    parent?: IHL7v2TreeNode,
  ): IHL7v2TreeNodeData {
    return {
      ... this.formatStructureElement(
        resource,
        bindings,
        child,
        changeable,
        viewOnly,
        parent,
      ),
      length: {
        min: child.minLength,
        max: child.maxLength,
      },
      lengthType: child.lengthType,
      confLength: child.confLength,
      ref: this.createReference(ref, this.getChildRefType(child), child.ref.id),
    };
  }

  formatField(
    resource: ISegment,
    child: IField,
    ref: IRefDataInfo,
    changeable: boolean,
    viewOnly: boolean,
    parent?: IHL7v2TreeNode,
  ): IHL7v2TreeNodeData {
    return {
      ...this.formatSubStructureElement(
        resource,
        resource.binding ? resource.binding.children || [] : [],
        child,
        ref,
        changeable,
        viewOnly,
        parent,
      ),
      valueSetBindingsInfo: this.valueSetBindingService.getBingdingInfo(ref.version, resource.name, ref.name, child.position, resource.type),
      cardinality: {
        min: child.min,
        max: child.max,
      },
      comments: child.comments || [],
      constantValue: {
        value: child.constantValue,
      },
      resourcePathId: child.id,
    };
  }

  formatComponent(
    resource: IDatatype,
    child: IComponent,
    ref: IRefDataInfo,
    changeable: boolean,
    viewOnly: boolean,
    parent?: IHL7v2TreeNode,
  ): IHL7v2TreeNodeData {
    return {
      ...this.formatSubStructureElement(
        resource,
        resource.binding ? resource.binding.children || [] : [],
        child,
        ref,
        changeable,
        viewOnly,
        parent,
      ),
      valueSetBindingsInfo: this.valueSetBindingService.getBingdingInfo(ref.version, resource.name, ref.name, child.position, resource.type),
      comments: child.comments || [],
      constantValue: {
        value: child.constantValue,
      },
      resourcePathId: child.id,
    };
  }

  formatSegmentRef(
    resource: IHL7MessageProfile,
    bindings: IStructureElementBinding[],
    child: ISegmentRef,
    ref: IRefDataInfo,
    changeable: boolean,
    viewOnly: boolean,
    parent?: IHL7v2TreeNode,
  ): IHL7v2TreeNodeData {
    return {
      ...this.formatMsgStructureElement(
        resource,
        bindings,
        child,
        changeable,
        viewOnly,
        parent,
      ),
      ref: this.createReference(ref, this.getChildRefType(child), child.ref.id),
    };
  }

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
          const data: IHL7v2TreeNodeData = this.formatField(
            segment,
            child,
            refsData[child.ref.id],
            changeable,
            viewOnly,
            parent,
          );

          return {
            data,
            parent,
            leaf: refsData[child.ref.id].leaf,
            $hl7V2TreeHelpers: {
              ref$: data.ref.asObservable(),
              treeChildrenSubscription: undefined,
              children$: new ReplaySubject<IHL7v2TreeNode[]>(1),
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
    const components = datatype.components || [];

    return repository.getRefData(components.map((child) => child.ref.id), Type.DATATYPE).pipe(
      take(1),
      map((refsData) => {
        return components.map((child) => {
          const data: IHL7v2TreeNodeData = this.formatComponent(
            datatype,
            child,
            refsData[child.ref.id],
            changeable,
            viewOnly,
            parent,
          );

          return {
            data,
            parent,
            leaf: refsData[child.ref.id].leaf,
            $hl7V2TreeHelpers: {
              ref$: data.ref.asObservable(),
              treeChildrenSubscription: undefined,
              children$: new ReplaySubject<IHL7v2TreeNode[]>(1),
            },
          };
        }).sort((a, b) => a.data.position - b.data.position);
      }),
    );
  }

  formatConformanceProfile(
    confProfile: IConformanceProfile,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    const segmentRefs = this.getAllSegmentRef(confProfile.children);
    return combineLatest(
      repository.getRefData(segmentRefs, Type.SEGMENT).pipe(
        take(1),
      ),
      this.getSegmentMap(segmentRefs, repository),
    ).pipe(
      take(1),
      map(([refsData, segments]) => {
        return this.formatStructure(
          confProfile.binding ? confProfile.binding.children || [] : [],
          confProfile.children,
          segments,
          refsData,
          viewOnly,
          changeable,
          confProfile,
          parent)
          ;
      }),
    );
  }

  formatMessageStructure(
    messageStructure: IMessageStructure,
    repository: AResourceRepositoryService,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    const segmentRefs = this.getAllSegmentRef(messageStructure.children);
    return combineLatest(
      repository.getRefData(segmentRefs, Type.SEGMENT).pipe(
        take(1),
      ),
      this.getSegmentMap(segmentRefs, repository),
    ).pipe(
      take(1),
      map(([refsData, segments]) => {
        return this.formatStructure(
          messageStructure.binding ? messageStructure.binding.children || [] : [],
          messageStructure.children,
          segments,
          refsData,
          viewOnly,
          changeable,
          messageStructure,
          parent)
          ;
      }),
    );
  }

  // tslint:disable-next-line: parameters-max-number
  formatStructure(
    bindings: IStructureElementBinding[],
    structure: IMsgStructElement[],
    segments: { [id: string]: ISegment },
    refsData: IRefData,
    viewOnly: boolean,
    changeable: boolean,
    cp: IHL7MessageProfile,
    parent?: IHL7v2TreeNode): IHL7v2TreeNode[] {
    return structure.map((child) => {
      if (child.type === Type.SEGMENTREF) {
        const segmentRef = child as ISegmentRef;
        const data = this.formatSegmentRef(
          cp,
          bindings,
          segmentRef,
          refsData[segmentRef.ref.id],
          changeable,
          viewOnly,
          parent,
        );
        data.name = segments[(child as ISegmentRef).ref.id].name;
        return {
          data,
          leaf: refsData[segmentRef.ref.id].leaf,
          parent,
          $hl7V2TreeHelpers: {
            ref$: data.ref.asObservable(),
            treeChildrenSubscription: undefined,
            children$: new ReplaySubject<IHL7v2TreeNode[]>(1),
          },
          children: [],
        };
      } else {
        const group = child as IGroup;
        const data = this.formatMsgStructureElement(
          cp,
          bindings,
          group,
          changeable,
          viewOnly,
          parent,
        );
        const node: IHL7v2TreeNode = {
          data,
          leaf: !group.children || group.children.length === 0,
          parent,
          $hl7V2TreeHelpers: {
            ref$: undefined,
            treeChildrenSubscription: undefined,
            children$: new ReplaySubject<IHL7v2TreeNode[]>(1),
          },
          children: [],
        };
        node.children = this.formatStructure([], group.children, segments, refsData, viewOnly, changeable, cp, node);
        node.$hl7V2TreeHelpers.children$.next(node.children);
        return node;
      }
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

  getSegmentMap(refs: string[], repository: AResourceRepositoryService): Observable<{ [id: string]: ISegment }> {
    return from(refs).pipe(
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
    );
  }

  getChildRefType(child: IStructureElement): Type {
    switch (child.type) {
      case Type.FIELD:
      case Type.COMPONENT:
      case Type.SUBCOMPONENT:
        return Type.DATATYPE;
      case Type.SEGMENTREF:
        return Type.SEGMENT;
    }
    return undefined;
  }

  getBindingsActiveChangeLog(b: Array<IBinding<IChangeLog>>) {
    return b && b.length > 0 ? b[0].value : {};
  }

  createReference(ref: IRefDataInfo, type: Type, id: string): BehaviorSubject<IResourceRef> {
    return new BehaviorSubject({
      type,
      id,
      name: ref.name,
      version: ref.version,
    });
  }

  nodeType(node: IHL7v2TreeNode): Type {
    return node ? (node.parent && node.parent.data.type === Type.COMPONENT) ? Type.SUBCOMPONENT : node.data.type : undefined;
  }

  getNodeByPath(children: IHL7v2TreeNode[], fullPath: IPath, repository: AResourceRepositoryService, options?: {
    transformer?: (nodes: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>,
    useProfileComponentRef?: boolean,
    failOnNotFound?: boolean,
  }): Observable<IHL7v2TreeNode | null> {
    const failOnNotFound = options && options.failOnNotFound !== undefined ? options.failOnNotFound : true;
    const useProfileComponentRef = options && options.useProfileComponentRef !== undefined ? options.useProfileComponentRef : false;
    const transform = options && options.transformer ? options.transformer : undefined;
    const inner = (nodes: IHL7v2TreeNode[], path: IPath) => {
      if (path) {
        // Get current node based on current node in path's ID
        const elm = nodes.filter((e: IHL7v2TreeNode) => e.data.id === path.elementId);
        if (!elm || elm.length !== 1) {
          // If no node found for current node in path then the path is unresolvable
          if (failOnNotFound) {
            return throwError({
              message: 'path not found ' + this.pathService.pathToString(fullPath),
            });
          } else {
            return of(null);
          }
        } else {
          const node = elm[0];
          // if current node in path has children
          if (path.child) {
            // load tree node children
            return this.loadNodeChildren(node, repository, {
              viewOnly: true,
              transform,
              useProfileComponentRef,
            }).pipe(
              take(1),
              flatMap((elms) => {
                // recursive call using the children list and the child path
                return inner(elms, path.child);
              }),
            );
          } else {
            // If current node in path has no children, it means that we arrived at destination
            // return the current node
            return of(node);
          }
        }
      } else {
        // if path is empty then return nothing
        return EMPTY;
      }
    };
    return inner(children, fullPath);
  }

}
