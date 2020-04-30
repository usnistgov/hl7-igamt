import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDocumentRef } from '../models/abstract-domain.interface';
import { IPredicate } from '../models/predicate.interface';

@Injectable({
  providedIn: 'root',
})
export class PredicateService {

  constructor(private http: HttpClient) { }

  getPredicate(documentRef: IDocumentRef, predicateId: string): Observable<IPredicate> {
    return this.http.get<IPredicate>('/api/igdocuments/' + documentRef.documentId + '/predicate/' + predicateId);
  }

}
