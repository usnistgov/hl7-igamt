import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { LoadResourceReferences } from '../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectDatatypesById, selectLoadedResourceById, selectReferencesAreLeaf, selectSegmentsById, selectValueSetById } from '../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Type } from '../constants/type.enum';
import { IDisplayElement } from '../models/display-element.interface';
import { IResource } from '../models/resource.interface';

export abstract class AResourceRepositoryService {
  abstract getResource<T extends IResource>(type: Type, id: string): Observable<T>;
  abstract loadResource(type: Type, id: string): void;
  abstract fetchResource<T extends IResource>(type: Type, id: string): Observable<T>;
  abstract getResourceDisplay(type: Type, id: string): Observable<IDisplayElement>;
  abstract areLeafs(ids: string[]): Observable<{ [id: string]: boolean }>;
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

  getResourceDisplay(type: Type, id: string): Observable<IDisplayElement> {
    switch (type) {
      case Type.DATATYPE:
        return this.store.select(selectDatatypesById, { id });
      case Type.SEGMENT:
        return this.store.select(selectSegmentsById, { id });
      case Type.VALUESET:
        return this.store.select(selectValueSetById, { id });
      default:
        return of(undefined);
    }
  }

  areLeafs(ids: string[]): Observable<{ [id: string]: boolean; }> {
    return this.store.select(selectReferencesAreLeaf, { ids });
  }

}