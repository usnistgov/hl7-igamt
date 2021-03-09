import { Injectable } from '@angular/core';
import {forEach} from '@angular/router/src/utils/collection';
import {BehaviorSubject, combineLatest, from, Observable, Subscription} from 'rxjs';
import {filter, map, mergeMap, switchMap, take, tap, toArray} from 'rxjs/operators';
import {
  IHL7v2TreeNode,
  IHL7v2TreeNodeData,
  IResourceRef,
} from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {Type} from '../../shared/constants/type.enum';
import {Usage} from '../../shared/constants/usage.enum';
import {IStructureElementBinding} from '../../shared/models/binding.interface';
import {
  IConformanceProfile, IGroup, IHL7MessageProfile,
  IMsgStructElement, ISegmentRef,
} from '../../shared/models/conformance-profile.interface';
import {IPath} from '../../shared/models/cs.interface';
import {IComponent, IDatatype} from '../../shared/models/datatype.interface';
import {IResource} from '../../shared/models/resource.interface';
import {IChangeLog} from '../../shared/models/save-change';
import {IField, IProfileComponentContext, ISegment} from '../../shared/models/segment.interface';
import {IStructureElement, ISubStructElement} from '../../shared/models/structure-element.interface';
import {BindingService} from '../../shared/services/binding.service';
import {PathService} from '../../shared/services/path.service';
import {AResourceRepositoryService, IRefData, IRefDataInfo} from '../../shared/services/resource-repository.service';
import {IBinding, StructureElementBindingService} from '../../shared/services/structure-element-binding.service';

@Injectable({
  providedIn: 'root',
})
export class PcTreeService {
  constructor(
    private valueSetBindingService: BindingService,
    private structureElementBindingService: StructureElementBindingService,
    private pathService: PathService,
  ) { }

  getTree(resource: IResource, pcContext: IProfileComponentContext, treeMode: PCTreeMode,  repository: AResourceRepositoryService, viewOnly: boolean, changeable: boolean, then?: (value: any) => void): Subscription {

    const pathTree: IPath[] = this.generatePathTreeFromContext(pcContext);
    switch (resource.type) {
      case Type.SEGMENT:
        return this.formatSegment(resource as ISegment, repository, pathTree, treeMode,  viewOnly, true).pipe(
          take(1),
          tap(then),
        ).subscribe();
      case Type.CONFORMANCEPROFILE:
        return this.formatConformanceProfile(resource as IConformanceProfile, repository, pathTree, treeMode, viewOnly, true).pipe(
          take(1),
          tap(then),
        ).subscribe();
    }
  }
  generatePathTreeFromContext(pcContext: IProfileComponentContext): IPath[] {
    let ret = [];
    if (pcContext && pcContext.profileComponentItems && pcContext.profileComponentItems.length > 0) {
      ret = pcContext.profileComponentItems.map((x) => x.path).map( (x) =>  this.pathService.getPathFromPathId(x));
    }
    return ret;
  }
  resolveReference(node: IHL7v2TreeNode, repository: AResourceRepositoryService, viewOnly: boolean, path: IPath[], treeMode: PCTreeMode,  then?: () => void, transform?: (children: IHL7v2TreeNode[]) => IHL7v2TreeNode[]): Subscription {
    if (node.data.ref && node.$hl7V2TreeHelpers && (!node.$hl7V2TreeHelpers.treeChildrenSubscription || node.$hl7V2TreeHelpers.treeChildrenSubscription.closed)) {
      node.$hl7V2TreeHelpers.treeChildrenSubscription = node.data.ref.asObservable().pipe(
        filter((ref) => ref.type === Type.DATATYPE || ref.type === Type.SEGMENT),
        switchMap((ref) => {
          return repository.fetchResource(ref.type, ref.id).pipe(
            switchMap((resource) => {
              switch (ref.type) {
                case Type.DATATYPE:
                  return this.formatDatatype(resource as IDatatype, repository, path, treeMode, viewOnly , false, node).pipe(
                    take(1),
                    tap(this.addChildren(node, then, transform)),
                  );
                case Type.SEGMENT:
                  return this.formatSegment(resource as ISegment, repository, path, treeMode, viewOnly, false, node).pipe(
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

  formatStructureElement(
    resource: IResource,
    bindings: IStructureElementBinding[],
    child: IStructureElement,
    changeable: boolean,
    viewOnly: boolean,
    parent?: IHL7v2TreeNode,
  ): IHL7v2TreeNodeData {
    const level = parent ? parent.data.level + 1 : 0;
    const elementBindings = this.structureElementBindingService.getElementBinding(
      child.id,
      bindings,
      { resource: resource.type, element: this.nodeType(parent) },
      level,
      parent,
    );

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
      custom: true,
      changeLog: {
        ...child.changeLog,
        ...this.getBindingsActiveChangeLog(elementBindings && elementBindings.values.changeLog ? elementBindings.values.changeLog : []),
      },
      changeable,
      viewOnly,
      level,
      pathId: (parent && parent.data.pathId) ? parent.data.pathId + '-' + child.id : child.id,
      bindings: elementBindings,
    };
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
    pathTree: IPath[],
    treeMode: PCTreeMode,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    const filterChildren = this.filterChildrenByDisplayMode(segment.children, treeMode, pathTree);

    return repository.getRefData(filterChildren.map((child) => child.ref.id), Type.DATATYPE).pipe(
      take(1),
      map((refsData) => {
        return filterChildren.map((child) => {
          const data: IHL7v2TreeNodeData = this.formatField(
            segment,
            child,
            refsData[child.ref.id],
            changeable,
            viewOnly,
            parent,
          );
          const node: IHL7v2TreeNode = {
            data,
            parent,
            selectable: this.getChildPath(pathTree, child.position).length <= 0,
            leaf: this.getChildPath(pathTree, child.position).length > 0,
            $hl7V2TreeHelpers: {
              ref$: data.ref.asObservable(),
              treeChildrenSubscription: undefined,
            },
          };
          if (this.getChildPath(pathTree, child.position).length || treeMode === PCTreeMode.SELECT ) {
            this.resolveReference(node, repository, viewOnly, this.getChildPath(pathTree, child.position).map( (x) => x.child), treeMode,  () => {
            }, (children: IHL7v2TreeNode[]) => {
              node.children = children;
              return children;
            });
          }
          return node;
        }).sort((a, b) => a.data.position - b.data.position);
      }),
    );
  }
  containsChild(pathTree: IPath[], position: number): boolean {
    return pathTree.filter( (x) => x.elementId === position.toString()).length > 0;
  }
  getChildPath(pathTree: IPath[], position: number): IPath[] {
    const childPath = pathTree.filter( (x) => x.elementId === position.toString());
    return childPath;
  }

  formatDatatype(
    datatype: IDatatype,
    repository: AResourceRepositoryService,
    pathTree: IPath[],
    treeMode: PCTreeMode,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    let components = datatype.components || [];
    components = this.filterChildrenByDisplayMode(components, treeMode, pathTree);
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
          const node: IHL7v2TreeNode = {
            data,
            parent,
            leaf: this.getChildPath(pathTree, child.position).length > 0,
            selectable: this.getChildPath(pathTree, child.position).length <= 0,
            $hl7V2TreeHelpers: {
              ref$: data.ref.asObservable(),
              treeChildrenSubscription: undefined,
            },
          };
          if (this.getChildPath(pathTree, child.position).length || treeMode === PCTreeMode.SELECT) {
            this.resolveReference(node, repository,  viewOnly, this.reducePath(pathTree, child.position), treeMode, () => {
            }, (children: IHL7v2TreeNode[]) => {
              node.children = children;
              return children;
            });
          }
          return node;
        }).sort((a, b) => a.data.position - b.data.position);
      }),
    );
  }
  reducePath(pathTree: IPath[], position: number ): IPath[] {
   return this.getChildPath(pathTree, position).filter( (x) => x.child).map( (x) => x.child );
  }

  formatConformanceProfile(
    confProfile: IConformanceProfile,
    repository: AResourceRepositoryService,
    pathTree: IPath[],
    treeMode: PCTreeMode,
    viewOnly: boolean,
    changeable: boolean,
    parent?: IHL7v2TreeNode): Observable<IHL7v2TreeNode[]> {
    const filteredChildren = this.filterChildrenByDisplayMode(confProfile.children, treeMode, pathTree);
    const segmentRefs = this.getAllSegmentRef(filteredChildren);
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
          filteredChildren,
          repository,
          pathTree,
          treeMode,
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
  filterChildrenByDisplayMode(children: any[], treeMode: PCTreeMode, pathTree: IPath[]) {
    let ret = children;
    if (treeMode === PCTreeMode.DISPLAY) {
      ret = children.filter((x) => this.containsChild( pathTree, x.position));
      return ret;
    } else {
      return children;
    }
  }

  // tslint:disable-next-line: parameters-max-number
  formatStructure(
    bindings: IStructureElementBinding[],
    structure: IMsgStructElement[],
    repository: AResourceRepositoryService,
    pathTree: IPath[],
    treeMode: PCTreeMode,
    segments: { [id: string]: ISegment },
    refsData: IRefData,
    viewOnly: boolean,
    changeable: boolean,
    cp: IHL7MessageProfile,
    parent?: IHL7v2TreeNode): IHL7v2TreeNode[] {
    const filteredStructure = this.filterChildrenByDisplayMode(structure, treeMode, pathTree);
    return filteredStructure.map((child) => {
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
        const node = {
          data,
          leaf: this.getChildPath(pathTree, child.position).length > 0,
          selectable: this.getChildPath(pathTree, child.position).length <= 0,
          parent,
          $hl7V2TreeHelpers: {
            ref$: data.ref.asObservable(),
            treeChildrenSubscription: undefined,
          },
          children: [],
        };
        if (this.getChildPath(pathTree, child.position).length > 0 || treeMode === PCTreeMode.SELECT) {
          this.resolveReference(node, repository,  viewOnly, this.reducePath(pathTree, child.position), treeMode,  () => {
          }, (children: IHL7v2TreeNode[]) => {
            node.children = children;
            return children;
          });
        }
        return node;
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
          leaf: this.getChildPath(pathTree, child.position).length > 0,
          selectable: this.getChildPath(pathTree, child.position).length <= 0,
          parent,
          expanded: true,
          $hl7V2TreeHelpers: {
            ref$: undefined,
            treeChildrenSubscription: undefined,
          },
          children: [],
        };
        if (this.getChildPath(pathTree, child.position).length) {
          node.children = this.formatStructure([], group.children, repository, this.getChildPath(pathTree, group.position).map( (x) => x.child),  treeMode, segments, refsData, viewOnly, changeable, cp, node);
        }
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
      custom: true,
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

}
export enum PCTreeMode {
  SELECT = 'SELECT', DISPLAY = 'DISPLAY',
}
