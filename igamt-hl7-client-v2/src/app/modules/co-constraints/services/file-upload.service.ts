
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  // API url
  BackEndUploadEndPoint = '/api/import/coconstraintTable';

  constructor(private http: HttpClient) { }

  // Returns an observable
  upload(file, segmentRef: string, conformanceProfileID: string, igID: string, contextId: string): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('file', file);
    formData.append('segmentRef', segmentRef);
    formData.append('conformanceProfileID', conformanceProfileID);
    formData.append('igID', igID);
    formData.append('contextId', contextId);

    // Make http post request over api
    // with formData as req
    return this.http.post<Message<any>>(this.BackEndUploadEndPoint, formData);
  }
}
