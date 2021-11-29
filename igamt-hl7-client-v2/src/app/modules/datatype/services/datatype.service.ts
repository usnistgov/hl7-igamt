import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { selectDatatypesById } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { IConformanceStatementEditorData } from '../../core/components/conformance-statement-editor/conformance-statement-editor.component';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { IConformanceStatementList } from '../../shared/models/cs-list.interface';
import { IDatatype } from '../../shared/models/datatype.interface';
import { IChange } from '../../shared/models/save-change';
import { ConformanceStatementService } from '../../shared/services/conformance-statement.service';

@Injectable()
export class DatatypeService {

  readonly URL = 'api/datatypes/';

  constructor(
    private http: HttpClient,
    private conformanceStatementService: ConformanceStatementService) { }

  getById(id: string): Observable<IDatatype> {
    return this.http.get<IDatatype>(this.URL + id);
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
        const datatypes = this.conformanceStatementService.resolveDependantConformanceStatement(data.associatedConformanceStatementMap || {}, selectDatatypesById);

        return (datatypes.length > 0 ? combineLatest(datatypes) : of([])).pipe(
          take(1),
          map((d) => {
            return {
              active: this.conformanceStatementService.createEditableNode(data.conformanceStatements || []),
              dependants: {
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

  getConformanceStatements(id: string, documentInfo: IDocumentRef): Observable<IConformanceStatementList> {
    return this.http.get<IConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentInfo.documentId);
  }

}
