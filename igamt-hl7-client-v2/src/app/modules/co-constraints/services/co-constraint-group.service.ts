import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
import { ICoConstraintGroup } from '../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';

@Injectable({
  providedIn: 'root',
})
export class CoConstraintGroupService {

  readonly URL = 'api/coconstraints/group/';

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<ICoConstraintGroup> {
    return this.http.get<ICoConstraintGroup>(this.URL + id);
  }

  getByBaseSegment(id: string, documentId: string): Observable<IDisplayElement[]> {
    return this.http.get<IDisplayElement[]>('/api/igdocuments/' + documentId + '/coconstraints/group/segment/' + id);
  }

  save(group: ICoConstraintGroup): Observable<Message<any>> {
    return this.http.post<Message<any>>(this.URL, group);
  }

}
