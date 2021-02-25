import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {IProfileComponent, IProfileComponentContext, ISegment} from '../../shared/models/segment.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileComponentService {

  readonly URL = 'api/profile-component/';

  getById(id: string): Observable<IProfileComponent> {
    return this.http.get<IProfileComponent>(this.URL + id);
  }
  getChildById(pcId: string, id: string): Observable<IProfileComponentContext> {
   return this.http.get<IProfileComponentContext>(this.URL + pcId + '/context/' + id);
  }

  constructor(private http: HttpClient) { }
}
