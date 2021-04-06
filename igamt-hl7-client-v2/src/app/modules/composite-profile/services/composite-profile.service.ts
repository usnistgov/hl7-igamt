import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ITreeNode} from 'angular-tree-component/dist/defs/api';
import {TreeNode} from 'primeng/api';
import {Observable} from 'rxjs';
import {IDocumentRef} from '../../shared/models/abstract-domain.interface';
import {ICompositeProfile, IOrderedProfileComponentLink} from '../../shared/models/composite-profile';
import {ICPConformanceStatementList} from '../../shared/models/cs-list.interface';
import {IDisplayElement} from '../../shared/models/display-element.interface';

@Injectable({
  providedIn: 'root',
})
export class CompositeProfileService {
  readonly URL = 'api/composite-profile/';

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<ICompositeProfile> {
    return this.http.get<ICompositeProfile>(this.URL + id);
  }
  public save(compositeProfile: ICompositeProfile): Observable<ICompositeProfile>  {
    return this.http.post<ICompositeProfile>(this.URL , compositeProfile);
  }
  getConformanceStatements(id: string, documentRef: IDocumentRef): Observable<ICPConformanceStatementList> {
    return this.http.get<ICPConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentRef.documentId);
  }
  getApplied(composite: ICompositeProfile, pcs: IDisplayElement[]): IDisplayElement[] {
    const sorted =  composite.orderedProfileComponents.sort((k, l) => k.position - l.position);
    return sorted.map((x) => pcs.find((y) => x.profileComponentId === y.id  ));
  }
  getTree(coreProfile: IDisplayElement,  pcs: IDisplayElement[]): TreeNode[] {

    const root: TreeNode = {
      label: coreProfile.variableName,
      data: coreProfile,
      children: this.generateChildren(pcs),
      expanded: true,
      key: coreProfile.id,
    };
    return [root];
  }

  private generateChildren( pcs: IDisplayElement[]): TreeNode[] {
    return pcs.map((x) => this.generateTreeNodeFromDisplay(x));
  }

  public generateTreeNodeFromDisplay( pc: IDisplayElement): TreeNode {
    return  {
      label: pc.variableName,
      data: pc,
      children: pc.children ? this.generateChildren(pc.children) : [],
      expanded: false,
      leaf: !pc.children || pc.children.length === 0,
      key: pc.id,
    };
  }

  public addPcs(children: IOrderedProfileComponentLink[], added: IDisplayElement[], index: number): IOrderedProfileComponentLink[] {
    const addedLink: IOrderedProfileComponentLink[] = added.map((x) => ({position: index, profileComponentId:  x.id }) );
    const ret: IOrderedProfileComponentLink[] = [... children];
    ret.splice(index, 0, ...addedLink);
    this.updatePositions(ret);
    return ret;
  }

  public updatePositions(ret: IOrderedProfileComponentLink[]) {
    for (let i = 0; i < ret.length; i++ ) {
      ret[i].position = i + 1;
    }
  }

  public delete(children: IOrderedProfileComponentLink[], index: number): IOrderedProfileComponentLink[] {
    const ret: IOrderedProfileComponentLink[] = [... children];
    ret.splice(index, 1);
    this.updatePositions(ret);
    return ret;
  }

  reorder(orderedProfileComponents: IOrderedProfileComponentLink[] | any, map: { [p: string]: number }): IOrderedProfileComponentLink[] {
    const ret: IOrderedProfileComponentLink[] = [... orderedProfileComponents];
    return ret.map((x) => ({...x, position: map[x.profileComponentId] }));
  }
}
