import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
import { IConformanceProfile } from '../../shared/models/conformance-profile.interface';
import { IChange } from '../../shared/models/save-change';

@Injectable()
export class ConformanceProfileService {

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<IConformanceProfile> {
    return this.http.get<IConformanceProfile>('api/conformanceprofiles/' + id);
  }

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/conformanceprofiles/' + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }
}
