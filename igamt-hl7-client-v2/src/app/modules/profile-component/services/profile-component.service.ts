import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { Message } from '../../dam-framework/models/messages/message.class';
import { SegmentService } from '../../segment/services/segment.service';
import { IHL7v2TreeNode, IHL7v2TreeNodeData, IResourceRef } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../shared/constants/type.enum';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { IPath } from '../../shared/models/cs.interface';
import {
  IPropertyCoConstraintBindings, IPropertyConformanceStatement,
  IPropertyDynamicMapping, IPropertyValueSet,
} from '../../shared/models/profile.component';

import {
  IItemProperty,
  IProfileComponent,
  IProfileComponentBinding,
  IProfileComponentContext,
  IProfileComponentItem,
  IPropertyBinding,
  IPropertyDatatype,
  IPropertyRef,
} from '../../shared/models/profile.component';
import { IResource } from '../../shared/models/resource.interface';
import { IChange, PropertyType } from '../../shared/models/save-change';
import { IDynamicMappingInfo, ISegment } from '../../shared/models/segment.interface';
import { DisplayService } from '../../shared/services/display.service';
import { ElementNamingService, IPathInfo } from '../../shared/services/element-naming.service';
import { Hl7V2TreeService } from '../../shared/services/hl7-v2-tree.service';
import { PathService } from '../../shared/services/path.service';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';
import { ValueSetService } from '../../value-set/service/value-set.service';
import { IProfileComponentMetadata } from '../components/profile-component-metadata/profile-component-metadata.component';
import { IItemLocation, IProfileComponentChange } from '../components/profile-component-structure-tree/profile-component-structure-tree.component';
import {
  IDynamicMappingEditorInfo,
} from '../components/segment-context-dynamic-mapping/segment-context-dynamic-mapping.component';
import { ITreeStructureProfileComponentPermutation } from './profile-component-ref-change.object';

export interface IHL7v2TreeProfileComponentNode extends IHL7v2TreeNode {
  data: IHL7v2TreeProfileComponentNodeData;
}

export interface IHL7v2TreeProfileComponentNodeData extends IHL7v2TreeNodeData {
  location: IProfileComponentItemLocation;
}

export interface IProfileComponentItemLocation {
  name: string;
  positionalPath: string;
  pathInfo: IPathInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileComponentService {

  readonly URL = 'api/profile-component/';

  constructor(
    private http: HttpClient,
    private treeService: Hl7V2TreeService,
    private pathService: PathService,
    private elementNamingService: ElementNamingService,
    private segmentService: SegmentService,
    private valueSetService: ValueSetService,
    private display: DisplayService,
  ) { }

  getById(id: string): Observable<IProfileComponent> {
    return this.http.get<IProfileComponent>(this.URL + id);
  }

  getChildById(pcId: string, id: string): Observable<IProfileComponentContext> {
    return this.http.get<IProfileComponentContext>(this.URL + pcId + '/context/' + id);
  }

  getDynamicMappingInfo(pcId: string, id: string): Observable<IProfileComponentContext> {
    return this.http.get<IProfileComponentContext>(this.URL + pcId + '/context/' + id + '/dynamicMappingInfo');
  }

  saveContext(pcId: string, context: IProfileComponentContext): Observable<IProfileComponentContext> {
    return this.http.post<IProfileComponentContext>(this.URL + pcId + '/context/' + context.id + '/update', context);
  }

  saveRootConformanceStatements(pcId: string, id: string, csList: IPropertyConformanceStatement[]): Observable<IPropertyConformanceStatement[]> {
    return this.http.post<IPropertyConformanceStatement[]>(this.URL + pcId + '/context/' + id + '/conformance-statements', csList);
  }
  saveDynamicMapping(pcId: string, id: string, csList: IPropertyDynamicMapping): Observable<IPropertyDynamicMapping> {
    return this.http.post<IPropertyDynamicMapping>(this.URL + pcId + '/context/' + id + '/dynamic-mapping', csList);
  }

  saveCoConstraintBindings(pcId: string, id: string, coConstraintsBindings: IPropertyCoConstraintBindings): Observable<IProfileComponentContext> {
    return this.http.post<IProfileComponentContext>(this.URL + pcId + '/context/' + id + '/co-constraints', coConstraintsBindings);
  }

  removeCoConstraintBindings(pcId: string, id: string): Observable<IProfileComponentContext> {
    return this.http.delete<IProfileComponentContext>(this.URL + pcId + '/context/' + id + '/co-constraints');
  }

  removeBindings(location: IItemLocation, context: IProfileComponentContext) {
    if (context.profileComponentBindings) {
      if (context.profileComponentBindings.contextBindings) {
        context.profileComponentBindings.contextBindings = [
          ...context.profileComponentBindings.contextBindings.filter((elm) => elm.target !== location.path),
        ];
      }

      if (context.profileComponentBindings.itemBindings && location.parent) {
        context.profileComponentBindings.itemBindings = [
          ...context.profileComponentBindings.itemBindings.map((elm) => ({
            path: elm.path,
            bindings: elm.path === location.parent ? elm.bindings.filter((binding) => binding.target !== location.target) : elm.bindings,
          })),
        ];
      }
    }
  }

  applyChange(change: IProfileComponentChange, context: IProfileComponentContext) {
    if (change.binding) {
      // --- Initialize lists
      if (!context.profileComponentBindings) {
        context.profileComponentBindings = {
          contextBindings: [],
          itemBindings: [],
        };
      }

      if (!context.profileComponentBindings.contextBindings) {
        context.profileComponentBindings.contextBindings = [];
      }

      if (!context.profileComponentBindings.itemBindings) {
        context.profileComponentBindings.itemBindings = [];
      }
      // ---

      return this.applyBindingChange(change, context.profileComponentBindings);
    }
    return this.applyItemChange(change, context.profileComponentItems);
  }

  applyBindingChange(change: IProfileComponentChange, binding: IProfileComponentBinding) {
    if (change.root) {
      binding.contextBindings = this.applyBindingChangeAt(change, binding.contextBindings);
      return;
    }

    let item = binding.itemBindings.find((elm) => elm.path === change.path);
    if (!item) {
      item = {
        path: change.path,
        bindings: [],
      };
      binding.itemBindings.push(item);
    }

    item.bindings = this.applyBindingChangeAt(change, item.bindings);
  }

  applyBindingChangeAt(change: IProfileComponentChange, list: IPropertyBinding[]) {
    const propId = list.findIndex((elm) => elm.target === change.target && elm.propertyKey === change.type);
    // Remove
    if (propId !== -1) {
      list.splice(propId, 1);
    }

    // Add
    if (!change.unset) {
      return [
        ...list,
        change.property as IPropertyBinding,
      ];
    }

    return list;
  }

  applyItemChange(change: IProfileComponentChange, items: IProfileComponentItem[]) {
    const item = items.find((elm) => elm.path === change.path);
    // If no item found, it can't be changed
    if (!item) { return; }
    const propId = item.itemProperties.findIndex((prop) => prop.propertyKey === change.type);

    // Remove
    if (propId !== -1) {
      item.itemProperties.splice(propId, 1);
    }

    // Add
    if (!change.unset) {
      item.itemProperties = [
        ...item.itemProperties,
        change.property,
      ];
    }
  }

  getResourceRef(property: IItemProperty, repository: AResourceRepositoryService): Observable<IResourceRef> {
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

  // tslint:disable-next-line:cognitive-complexity
  getNodeByPathAndRef(children: IHL7v2TreeNode[], fullPath: IPath, repository: AResourceRepositoryService, structPermutations?: Record<string, ITreeStructureProfileComponentPermutation>): Observable<IHL7v2TreeNode> {
    const inner = (nodes: IHL7v2TreeNode[], path: IPath, changeRef?: ITreeStructureProfileComponentPermutation) => {
      if (path) {
        // Get current node based on current node in path's ID
        const elm = nodes.filter((e: IHL7v2TreeNode) => e.data.id === path.elementId);
        if (!elm || elm.length !== 1) {
          // If no node found for current node in path then the path is unresolvable
          return EMPTY;
        } else {
          const node = elm[0];
          // if current node in path has children
          if (path.child) {
            // load tree node children
            return this.treeService.loadNodeChildren(node, repository, changeRef ? changeRef.ref : undefined).pipe(
              take(1),
              flatMap((elms) => {
                // recursive call using the children list and the child path
                return inner(elms, path.child, changeRef && changeRef.children ? changeRef.children[path.child.elementId] : undefined);
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
    return inner(children, fullPath, structPermutations ? structPermutations[fullPath.elementId] : undefined);
  }

  getHL7V2ProfileComponentItemNode(
    resource: IResource,
    repository: AResourceRepositoryService,
    nodes: IHL7v2TreeNode[],
    items: IProfileComponentItem[],
    refChanges: Record<string, ITreeStructureProfileComponentPermutation>,
  ): Observable<IHL7v2TreeProfileComponentNode[]> {
    return items.length > 0 ? combineLatest(
      items.sort(
        (a, b) => this.comparePath(a.path, b.path),
      ).map((item) => {
        const path = this.pathService.getPathFromPathId(item.path);
        return this.getNodeByPathAndRef(
          nodes[0].children,
          path,
          repository,
          refChanges,
        ).pipe(
          flatMap((node) => {
            return this.elementNamingService.getPathInfoFromPath(resource, repository, path).pipe(
              take(1),
              map((pathInfo) => {
                const name = this.elementNamingService.getStringNameFromPathInfo(pathInfo);
                return {
                  ...node,
                  data: {
                    ...node.data,
                    location: {
                      name,
                      positionalPath: this.getPositionalPath(pathInfo.child),
                      pathInfo: this.getLeaf(pathInfo),
                    },
                  },
                };
              }),
            );
          }),
        );
      }),
    ).pipe(
      map((list) => {
        list.sort((a, b) => {
          return this.comparePositionalId(a.data.location.positionalPath, b.data.location.positionalPath);
        });
        return list;
      }),
    ) : of([]);
  }

  getPositionalPath(pathInfo: IPathInfo): string {
    const child = pathInfo.child ? `.${this.getPositionalPath(pathInfo.child)}` : '';
    return `${pathInfo.position}${child}`;
  }

  getLeaf(pathInfo: IPathInfo): IPathInfo {
    if (!pathInfo.child) {
      return pathInfo;
    } else {
      return this.getLeaf(pathInfo.child);
    }
  }

  comparePositionalId(p1: string, p2: string): number {
    const p1List = p1.split('.').map(Number);
    const p2List = p2.split('.').map(Number);
    const size = Math.min(p1List.length, p2.length);
    for (let i = 0; i < size; i++) {
      if (p1List[i] > p2List[i]) { return 1; }
      if (p1List[i] < p2List[i]) { return -1; }
    }

    if (p1List.length > p2List.length) { return 1; }
    if (p1List.length < p2List.length) { return -1; }
    return 0;
  }

  comparePath(p1: string, p2: string): number {
    if (!p1 || !p2) {
      return 0;
    }
    if (p1.startsWith(p2)) {
      return 1;
    } else if (p2.startsWith(p1)) {
      return -1;
    } else {
      return 0;
    }
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentRef.documentId,
      },
    });
  }

  profileComponentToMetadata(pc: IProfileComponent): IProfileComponentMetadata {
    return {
      name: pc.name,
      description: pc.description,
      profileIdentifier: pc.preCoordinatedMessageIdentifier ? pc.preCoordinatedMessageIdentifier : {},
      preDef: pc.preDef,
      postDef: pc.postDef,
    };
  }
  getDynamicMappingEditorInfo(ctx: IProfileComponentContext, seg: ISegment): IDynamicMappingEditorInfo {
    return {
      segmentVs: this.segmentService.getValueSetBindingByLocation(seg, 2)[0],
      pcVs: this.findValueSetIdByLocation(ctx, '2'),
      segmentDynamicMapping: seg.dynamicMappingInfo,
      segmentId: seg.id,
      profileComponentDynamicMapping: ctx.profileComponentDynamicMapping ? ctx.profileComponentDynamicMapping : { items: [], override: false, propertyKey: PropertyType.DYNAMICMAPPING },
    };
  }
  private findPropertyBinding(ctx: IProfileComponentContext, location: string): IPropertyBinding[] {
    if (ctx.profileComponentBindings && ctx.profileComponentBindings.contextBindings) {
      return ctx.profileComponentBindings.contextBindings.filter((x) => (x.propertyKey === PropertyType.VALUESET) && x.target === location);
    } else { return null; }
  }

  private findOnePropertyBinding(ctx: IProfileComponentContext, location: string): IPropertyValueSet {
    const multiple: IPropertyBinding[] = this.findPropertyBinding(ctx, location);
    if (multiple != null && multiple.length > 0) {
      return multiple[0] as IPropertyValueSet;
    } else {
      return null;
    }
  }

  private findValueSetIdByLocation(ctx: IProfileComponentContext, location: string): string {
    const multiple: IPropertyValueSet = this.findOnePropertyBinding(ctx, location);
    if (multiple && multiple.valuesetBindings != null && multiple.valuesetBindings.length > 0) {
      // tslint:disable-next-line:no-collapsible-if
      if (multiple.valuesetBindings[0].valueSets && multiple.valuesetBindings[0].valueSets.length > 0) {
        return multiple.valuesetBindings[0].valueSets[0];
      }
    }
    return null;
  }
  getAvailableCodes(vsId: string, segVs: string, documentRef: IDocumentRef): Observable<string[]> {
    const final = vsId !== null ? vsId : segVs;
    if (final == null) { return of([]); }
    return this.valueSetService.getById(documentRef, final).pipe(map((vs) => {
      return [].concat(vs.codes.filter((code) => code.usage !== 'E').map((code) => code.value));
    }));
  }
}
