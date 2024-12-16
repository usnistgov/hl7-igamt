
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVerificationEnty } from '../../dam-framework';
import { Message } from '../../dam-framework/models/messages/message.class';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  importCoConstraints(file: File, conformanceProfileId: string, contextPathId: string, segmentPathId: string, format: string): Observable<Message<IVerificationEnty[]>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contextPathId', contextPathId);
    formData.append('segmentPathId', segmentPathId);
    formData.append('conformanceProfileId', conformanceProfileId);
    formData.append('format', format);
    return this.http.post<Message<IVerificationEnty[]>>(`/api/import/co-constraints-table`, formData);
  }
}
