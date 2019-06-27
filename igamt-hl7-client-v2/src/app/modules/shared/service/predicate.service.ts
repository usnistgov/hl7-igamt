import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPredicate } from '../models/predicate.interface';

@Injectable({
  providedIn: 'root',
})
export class PredicateService {

  constructor(private http: HttpClient) { }

  getPredicate(ig: string, predicateId: string): Observable<IPredicate> {
    return this.http.get<IPredicate>('/api/igdocuments/' + ig + '/predicate/' + predicateId);
  }

}
