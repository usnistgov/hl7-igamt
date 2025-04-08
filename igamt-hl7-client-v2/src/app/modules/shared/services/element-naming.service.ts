import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, flatMap, map, take, tap } from 'rxjs/operators';
import { IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IConformanceProfile, IGroup, ISegmentRef } from '../models/conformance-profile.interface';
import { IPath } from '../models/cs.interface';
import { IDatatype } from '../models/datatype.interface';
import { IRef } from '../models/ref.interface';
import { IResource } from '../models/resource.interface';
import { ISegment } from '../models/segment.interface';
import { PathService } from './path.service';
import { AResourceRepositoryService } from './resource-repository.service';

export type NamedChildrenList = INamedChildrenItem[];

interface INamedChildrenItem {
  name: string;
  id: string;
  ref?: {
    type: Type;
    id: string;
  };
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
  ref?: {
    type: Type;
    id: string;
  };
  child?: IPathInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ElementNamingService {

  constructor(
    private pathService: PathService,
  ) { }

  getSeparator(node: IPathInfo): string {
    if (node.child) {
      return node.child.type === Type.FIELD ? '-' : '.';
    } else {
      return '';
    }
  }

  getDescription(node: IPathInfo): string {
    return ' (' + node.name + ')';
  }

  getStringNameFromPathInfo(elm: IPathInfo, excludeDesc: boolean = false): string {
    const loop = (node: IPathInfo): string => {
      if (!node) {
        return '';
      }

      const post = loop(node.child);
      const separator = this.getSeparator(node);
      const desc = node.child || excludeDesc ? '' : this.getDescription(node);

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

  getTreeNodeName(node: IHL7v2TreeNode, appendName: boolean = false): string {
    return this.getStringNameFromPathInfo(this.getPathInfoFromTreeNode(node), !appendName);
  }

  getPathInfoFromTreeNode(node: IHL7v2TreeNode): IPathInfo {
    const nodeToPathInfo = (elm: IHL7v2TreeNode): IPathInfo => {
      return {
        name: elm.data.name,
        id: elm.data.id,
        type: elm.data.type,
        position: elm.data.position,
        leaf: elm.leaf,
        ref: elm.data.ref ? {
          id: elm.data.ref.getValue().id,
          type: elm.data.ref.getValue().type,
        } : undefined,
      };
    };

    const loop = (elm: IHL7v2TreeNode): IPathInfo[] => {
      return elm ? [
        ...loop(elm.parent),
        nodeToPathInfo(elm),
      ] : [];
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
        ref: {
          id: field.ref.id,
          type: Type.DATATYPE,
        },
      };
    };

    const itemize = (elm) => {
      return {
        id: elm.id,
        name: elm.name,
        position: elm.position,
        leaf: false,
        type: elm.type,
        ref: elm.type === Type.SEGMENTREF ? {
          id: (elm as ISegmentRef).ref.id,
          type: Type.SEGMENT,
        } : undefined,
        children: elm.type === Type.GROUP ? ((elm as IGroup).children || []).map(itemize) : undefined,
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
        return of(profile.children.map(itemize));
    }
  }

  getChildrenListFromRef(type: Type, id: string, repository: AResourceRepositoryService, segRefPathInfo?: IPathInfo): Observable<NamedChildrenList> {
    return repository.fetchResource(type, id).pipe(
      take(1),
      flatMap((resource) => {
        if (segRefPathInfo) {
          segRefPathInfo.name = resource.name;
        }
        return this.getChildrenListFromResource(resource, repository);
      }),
    );
  }

  getPathInfoFromPathId(resource: IResource, repository: AResourceRepositoryService, location: string, options?: {
    referenceChange?: Record<string, string>;
  }): Observable<IPathInfo> {
    return this.getPathInfoFromPath(resource, repository, this.pathService.getPathFromPathId(location), options);
  }

  // tslint:disable-next-line: cognitive-complexity
  getPathInfoFromPath(resource: IResource, repository: AResourceRepositoryService, path: IPath, options?: {
    referenceChange?: Record<string, string>;
  }): Observable<IPathInfo> {
    const referenceChange = options ? options.referenceChange : {};
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
      ref: {
        id: resource.id,
        type: resource.type,
      },
    };

    const fn = (children: NamedChildrenList, cursor: IPath, pathInfo: IPathInfo, subject: Subject<IPathInfo>) => {

      const pathId = this.pathService.pathToString(cursor);

      // Get child pointed by cursor
      const next = children.find((child) => {
        return child.id === cursor.elementId;
      });

      if (next) {
        // If child found
        // Get child's reference
        const reference = referenceChange[pathId] && next.ref ? {
          id: referenceChange[pathId],
          type: next.ref.type
        } : next.ref;

        // Add child to pathInfo
        pathInfo.child = {
          name: next.name,
          id: next.id,
          type: next.type,
          position: next.position,
          leaf: next.leaf,
          ref: reference,
        };

        if (cursor.child) {
          // If cursor has more children

          if (next.leaf) {
            // But child is a leaf

            subject.error({ message: 'Path has extra children whereas resource is leaf' });
          } else {
            // If child is not a leaf

            if (reference) {
              // If child has a reference
              // Get children from reference
              this.getChildrenListFromRef(refType(next.type), reference.id, repository,
                next.type === Type.SEGMENTREF ? pathInfo.child : undefined).pipe(
                  take(1),
                  map((list) => {
                    fn(list, cursor.child, pathInfo.child, subject);
                  }),
                  catchError((err) => {
                    subject.error(err);
                    return throwError(err);
                  }),
                ).subscribe();
            } else {
              // If child does not have reference but has a list of children
              fn(next.children, cursor.child, pathInfo.child, subject);
            }
          }
        } else {
          // If cursor does not have any children (arrived at the end of the path)

          if (next.type === Type.SEGMENTREF) {
            // If the path if segment ref

            // Resolve segment ref to get segment name
            repository.fetchResource(Type.SEGMENT, reference.id).pipe(
              take(1),
              tap((segment) => {
                pathInfo.child.name = segment.name;

                // COMPLETE
                subject.next(intialPathInfo);
                subject.complete();
              }),
              catchError((err) => {
                subject.error(err);
                return throwError(err);
              }),
            ).subscribe();
          } else {
            // If the path is not segment ref
            // COMPLETE
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
        catchError((err) => {
          pathSubject.error(err);
          return throwError(err);
        }),
      ).subscribe();
    } else {
      pathSubject.next(intialPathInfo);
      pathSubject.complete();
    }
    return pathSubject.asObservable();
  }

  getStartPathInfo(pathInfo: IPathInfo, from: string): IPathInfo {
    if (pathInfo.type === Type.SEGMENTREF || pathInfo.type === Type.SEGMENT || pathInfo.id === from) {
      return pathInfo;
    } else {
      return this.getStartPathInfo(pathInfo.child, from);
    }
  }

  getStringNameFromPath(path: IPath, resource: IResource, repository: AResourceRepositoryService, options?: {
    referenceChange?: Record<string, string>;
  }): Observable<string> {
    if (!path) {
      return of('');
    }
    return this.getPathInfoFromPath(resource, repository, path, options).pipe(
      take(1),
      map((pathInfo) => {
        return this.getStringNameFromPathInfo(pathInfo);
      }),
    );
  }

  getLeaf(pInfo: IPathInfo): IPathInfo {
    if (!pInfo.child) {
      return pInfo;
    } else {
      return this.getLeaf(pInfo.child);
    }
  }

  getPositionalPath(pathInfo: IPathInfo): string {
    const child = pathInfo.child ? `.${this.getPositionalPath(pathInfo.child)}` : '';
    return `${pathInfo.position}${child}`;
  }

}
