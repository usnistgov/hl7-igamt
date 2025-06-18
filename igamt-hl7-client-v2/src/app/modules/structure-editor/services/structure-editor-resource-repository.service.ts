import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import * as fromIgamtResourcesSelectors from 'src/app/root-store/dam-igamt/igamt.loaded-resources.selectors';
import { LoadResourceReferences } from '../../../root-store/dam-igamt/igamt.loaded-resources.actions';
import { Type } from '../../shared/constants/type.enum';
import { IResource } from '../../shared/models/resource.interface';
import { StoreResourceRepositoryService } from '../../shared/services/resource-repository.service';

@Injectable()
export class StructureEditorResourceRepositoryService extends StoreResourceRepositoryService {

  constructor(
    store: Store<any>,
    action: Actions) {
    super(action, store);
  }

  /**
   * Override fetch resource, in order to get both resource references and display
   * useful for structure editor where the display elements are not part of the document
   * @param type resource type
   * @param id resource id
   */
  fetchResource<T extends IResource>(type: Type, id: string): Observable<T> {
    return this.store.select(fromIgamtResourcesSelectors.selectLoadedResourceById, { id }).pipe(
      take(1),
      mergeMap((resource) => {
        if (!resource || !resource.type || resource.type !== type) {
          this.store.dispatch(new LoadResourceReferences({ resourceType: type, id, insert: true, display: true }));
          return this.getResource(type, id);
        } else {
          return of(resource as T);
        }
      }),
    );
  }
}
