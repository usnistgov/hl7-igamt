import { Injectable } from '@angular/core';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { LoadResourceReferences } from '../../../root-store/ig/ig-edit/ig-edit.actions';
import {
  selectDatatypesById,
  selectLoadedResourceById,
  selectMessagesById,
  selectReferencesAreLeaf,
  selectSegmentsById,
  selectValueSetById,
} from '../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Type } from '../constants/type.enum';
import { IDisplayElement } from '../models/display-element.interface';
import { IResource } from '../models/resource.interface';
import { RxjsStoreHelperService } from './rxjs-store-helper.service';

export interface IRefData {
  [id: string]: {
    leaf: boolean,
    version: string,
    name: string,
  };
}

export abstract class AResourceRepositoryService {
  abstract getResource<T extends IResource>(type: Type, id: string): Observable<T>;
  abstract loadResource(type: Type, id: string): void;
  abstract fetchResource<T extends IResource>(type: Type, id: string): Observable<T>;
  abstract getResourceDisplay(type: Type, id: string): Observable<IDisplayElement>;
  abstract areLeafs(ids: string[]): Observable<{ [id: string]: boolean }>;
  abstract getRefData(ids: string[], type: Type): Observable<IRefData>;
}

@Injectable()
export class StoreResourceRepositoryService extends AResourceRepositoryService {

  constructor(
    private store: Store<any>) {
    super();
  }

  getResource<T extends IResource>(type: Type, id: string): Observable<T> {
    return this.store.select(selectLoadedResourceById, { id }).pipe(
      filter((resource) => resource && resource.type === type),
      map((resource) => resource as T),
    );
  }

  loadResource(type: Type, id: string): void {
    this.store.dispatch(new LoadResourceReferences({ resourceType: type, id }));
  }

  fetchResource<T extends IResource>(type: Type, id: string): Observable<T> {
    return this.store.select(selectLoadedResourceById, { id }).pipe(
      take(1),
      mergeMap((resource) => {
        if (!resource || !resource.type || resource.type !== type) {
          this.store.dispatch(new LoadResourceReferences({ resourceType: type, id }));
          return this.getResource(type, id);
        } else {
          return of(resource as T);
        }
      }),
    );
  }

  getSelector(type: Type): MemoizedSelectorWithProps<object, {
    id: string;
  }, IDisplayElement> {
    switch (type) {
      case Type.DATATYPE:
        return selectDatatypesById;
      case Type.SEGMENT:
        return selectSegmentsById;
      case Type.CONFORMANCEPROFILE:
        return selectMessagesById;
      case Type.VALUESET:
        return selectValueSetById;
    }
    return selectDatatypesById;
  }

  getRefData(ids: string[], type: Type): Observable<IRefData> {
    const values = ids.map((id) => this.store.select(this.getSelector(type), { id }).pipe(take(1)));
    return combineLatest(
      RxjsStoreHelperService.forkJoin(values),
      this.areLeafs(ids),
    ).pipe(
      map(([vals, leafs]) => {
        const val = {};
        vals.forEach((value) => {
          val[value.id] = {
            leaf: leafs[value.id],
            name: value.fixedName,
            version: value.domainInfo.version,
          };
        });
        return val;
      }),
    );
  }

  getResourceDisplay(type: Type, id: string): Observable<IDisplayElement> {
    switch (type) {
      case Type.DATATYPE:
        return this.store.select(selectDatatypesById, { id });
      case Type.SEGMENT:
        return this.store.select(selectSegmentsById, { id });
      case Type.VALUESET:
        return this.store.select(selectValueSetById, { id });
      case Type.CONFORMANCEPROFILE:
        return this.store.select(selectMessagesById, { id });
      default:
        return of(undefined);
    }
  }

  areLeafs(ids: string[]): Observable<{ [id: string]: boolean; }> {
    return this.store.select(selectReferencesAreLeaf, { ids });
  }

}
