import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Type} from '../constants/type.enum';
import { IDocumentRef } from '../models/abstract-domain.interface';
import { IPredicate } from '../models/predicate.interface';

@Injectable({
  providedIn: 'root',
})
export class PredicateService {

  constructor(private http: HttpClient) { }

  getPredicate(documentRef: IDocumentRef, predicateId: string): Observable<IPredicate> {
    if (documentRef.type === Type.IGDOCUMENT) {
      return this.http.get<IPredicate>('/api/igdocuments/' + documentRef.documentId + '/predicate/' + predicateId);

    } else if (documentRef.type === Type.DATATYPELIBRARY) {
      return this.http.get<IPredicate>('/api/datatype-library/' + documentRef.documentId + '/predicate/' + predicateId);

    } else {
      throwError('Bad URL');
    }
  }
}
