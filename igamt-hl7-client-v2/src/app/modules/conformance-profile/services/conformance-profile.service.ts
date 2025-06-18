import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { selectDatatypesById, selectSegmentsById } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { IConformanceStatementEditorData } from '../../core/components/conformance-statement-editor/conformance-statement-editor.component';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { ICoConstraintGroup } from '../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../shared/models/conformance-profile.interface';
import { ICPConformanceStatementList } from '../../shared/models/cs-list.interface';
import { IChange } from '../../shared/models/save-change';
import { ConformanceStatementService } from '../../shared/services/conformance-statement.service';
import { IConformanceProfileEditMetadata } from '../components/metadata-editor/metadata-editor.component';

@Injectable()
export class ConformanceProfileService {

  readonly URL = 'api/conformanceprofiles/';

  constructor(
    private http: HttpClient,
    private conformanceStatementService: ConformanceStatementService) { }

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

  getConformanceStatementEditorData(id: string, documentInfo: IDocumentRef): Observable<IConformanceStatementEditorData> {
    return this.getConformanceStatements(id, documentInfo).pipe(
      flatMap((data) => {
        const segments = this.conformanceStatementService.resolveDependantConformanceStatement(data.associatedSEGConformanceStatementMap || {}, selectSegmentsById);
        const datatypes = this.conformanceStatementService.resolveDependantConformanceStatement(data.associatedDTConformanceStatementMap || {}, selectDatatypesById);
        return combineLatest(
          (segments.length > 0 ? combineLatest(segments) : of([])),
          (datatypes.length > 0 ? combineLatest(datatypes) : of([])),
        ).pipe(
          take(1),
          map(([s, d]) => {
            return {
              active: this.conformanceStatementService.createEditableNode(data.conformanceStatements || []),
              dependants: {
                segments: s,
                datatypes: d,
              },
              changeReasons: {
                reasons: data.changeReason,
                updated: null,
              },
            };
          }),
        );
      }),
    );
  }

  getReferencedCoConstraintGroups(id: string): Observable<ICoConstraintGroup[]> {
    return this.http.get<ICoConstraintGroup[]>(this.URL + id + '/coconstraints/group');
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
      profileIdentifier: conformanceProfile.preCoordinatedMessageIdentifier ? conformanceProfile.preCoordinatedMessageIdentifier : {},
    };
  }
}
