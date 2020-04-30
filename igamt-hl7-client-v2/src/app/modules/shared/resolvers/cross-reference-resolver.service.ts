import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { Type } from '../constants/type.enum';
import { IDocumentRef } from '../models/abstract-domain.interface';
import { CrossReferencesService } from '../services/cross-references.service';

@Injectable({
  providedIn: 'root',
})
export class CrossReferenceResolverService implements Resolve<any> {

  documentRef$: Observable<IDocumentRef>;

  constructor(private http: HttpClient, private router: Router, private acr: ActivatedRoute, private crossReferenceService: CrossReferencesService, private store: Store<any>) {
    this.documentRef$ = this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo);
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any[]> {
    const idKey: string = route.data['idKey'];
    const resourceType = route.data['resourceType'];
    const elementId = route.params[idKey];
    return this.documentRef$.pipe(
      concatMap(
        (documentRef: IDocumentRef) => {
          return this.crossReferenceService.findUsagesDisplay(documentRef, Type.IGDOCUMENT, resourceType, elementId);
        },
      ), take(1));
  }
}
