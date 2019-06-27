import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {concatMap, map, mergeMap, take} from 'rxjs/operators';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {Type} from '../constants/type.enum';
import {CrossReferencesService} from '../services/cross-references.service';

@Injectable({
  providedIn: 'root',
})
export class CrossReferenceResolverService implements Resolve<any> {
  igId$: Observable<string>;
  constructor(private http: HttpClient, private router: Router, private acr: ActivatedRoute, private crossReferenceService: CrossReferencesService,  private store: Store<any>) {
    this.igId$ = this.store.select(fromIgDocumentEdit.selectIgId);

  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any[]> {
    const idKey: string = route.data['idKey'];
    const resourceType = route.data['resourceType'];
    const elementId = route.params[idKey];
    return this.igId$.pipe(
      concatMap(
        (id: string) => {
          return this.crossReferenceService.findUsagesDisplay(id, Type.IGDOCUMENT, resourceType, elementId);
        },
    ), take(1) );
  }
}
