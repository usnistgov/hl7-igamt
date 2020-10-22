import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
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

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentRef.documentId,
      },
    });
  }

  getConformanceStatements(id: string, documentRef: IDocumentRef): Observable<ICPConformanceStatementList> {
    return this.http.get<ICPConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentRef.documentId);
  }

  conformanceProfileToMetadata(conformanceProfile: IConformanceProfile): IConformanceProfileEditMetadata {
    return {
      name: conformanceProfile.name,
      hl7Version: conformanceProfile.domainInfo.version,
      organization: conformanceProfile.organization,
      authors: conformanceProfile.authors,
      messageType: conformanceProfile.messageType,
      event: conformanceProfile.event,
      structID: conformanceProfile.structID,
      profileType: conformanceProfile.profileType,
      role: conformanceProfile.role,
      description: conformanceProfile.description,
      displayName: conformanceProfile.displayName,
      profileIdentifier:  conformanceProfile.preCoordinatedMessageIdentifier ? conformanceProfile.preCoordinatedMessageIdentifier : {},
    };
  }
}
