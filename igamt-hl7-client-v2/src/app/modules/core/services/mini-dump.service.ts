import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IMiniDumpOptions {
  archiveName?: string;
  format?: 'JSON' | 'BSON' | 'BOTH';
  mode?: 'OVERRIDE' | 'MERGE';
}

@Injectable({
  providedIn: 'root',
})
export class MiniDumpService {
  constructor(private http: HttpClient) {}

  exportMiniDump(options: IMiniDumpOptions = {}): Observable<Blob> {
    let params = new HttpParams();
    if (options.format) {
      params = params.set('format', options.format);
    }
    if (options.archiveName) {
      params = params.set('archiveName', options.archiveName);
    }
    return this.http.get('/api/account/mini-dump', { responseType: 'blob', params });
  }

  importMiniDump(file: File, options: IMiniDumpOptions = {}): Observable<void> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    let params = new HttpParams();
    if (options.mode) {
      params = params.set('mode', options.mode);
    }

    return this.http.post<void>('/api/account/mini-dump', formData, { params });
  }
}

