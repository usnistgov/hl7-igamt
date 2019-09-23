import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
import { IConformanceProfile } from '../../shared/models/conformance-profile.interface';
import { ICPConformanceStatementList } from '../../shared/models/cs-list.interface';
import { IChange } from '../../shared/models/save-change';
import { IConformanceProfileEditMetadata } from '../components/metadata-editor/metadata-editor.component';

@Injectable()
export class ConformanceProfileService {

  readonly URL = 'api/conformanceprofiles/';

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<IConformanceProfile> {
    return this.http.get<IConformanceProfile>(this.URL + id);
  }

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }

  getConformanceStatements(id: string, documentId: string): Observable<ICPConformanceStatementList> {
    return this.http.get<ICPConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentId);
  }

  conformanceProfileToMetadata(conformanceProfile: IConformanceProfile): IConformanceProfileEditMetadata {
    return {
      name: conformanceProfile.identifier,
      hl7Version: conformanceProfile.domainInfo.version,
      organization: conformanceProfile.organization,
      author: conformanceProfile.authors,
      messageType: conformanceProfile.messageType,
      event: conformanceProfile.event,
      structID: conformanceProfile.structID,
      profileType: conformanceProfile.profileType,
      role: conformanceProfile.role,
      profileIdentifier: conformanceProfile.profileIdentifier || [],
    };
  }
}
