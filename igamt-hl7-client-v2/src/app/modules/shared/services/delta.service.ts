import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from '../constants/type.enum';
import { IDelta } from '../models/delta';

@Injectable({
  providedIn: 'root',
})
export class DeltaService {

  readonly URL = 'api/delta/';

  constructor(private http: HttpClient) {
  }

  getDeltaFromOrigin = (type: Type, id: string, documentId: string): Observable<IDelta<any>> => {
    return this.http.get<IDelta<any>>(this.URL + [type, documentId, id].join('/'));
  }
}
