import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CodeUsage } from '../constants/usage.enum';

export interface IVersion {
    version: string;
    date: Date;
}
export class VersionInfo {
  version: string;
  date: number;
  numberOfCodes: number;
}

export interface ICodeSetQueryMetaData {
  name: string;
  latestStableVersion: VersionInfo;
  versions: VersionInfo[];
  codes: any;
  codeMatchValue: any;
  id: string;
}

export interface ICodeSetQueryResult {
    id: string;
    name: string;
    latestStableVersion: IVersion;
    version: IVersion;
    latestStable: boolean;
    codeMatchValue: string;
    codes: IExternalCode[];
}

export interface IExternalCode {
    value: string;
    codeSystem: string;
    displayText: string;
    isPattern: boolean;
    regularExpression: string;
    usage: CodeUsage;
}

export interface IResponseError {
    message: string;
    statusCode: number;
    error: HttpErrorResponse;
}

@Injectable({ providedIn: 'root' })
export class ExternalCodeSetService {
    private httpClient: HttpClient;

    constructor(handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
    }

    fetchCodes(url: string, key?: string): Observable<ICodeSetQueryResult> {
        const options = key ? { headers: { 'X-API-KEY': key } } : {};
        return this.httpClient.get<ICodeSetQueryResult>(url, options).pipe(
          catchError(this.handleError),
        );
    }

  fetchAvailableCodeSets(url: string, key?: string): Observable<ICodeSetQueryResult[]> {
      const options = key ? { headers: { 'X-API-KEY': key } } : {};
      return this.httpClient.get<ICodeSetQueryResult[]>(url, options).pipe(
        catchError(this.handleError),
      );
  }

  fetchCodeSetMetadata(url: string, oid: string,  key?: string): Observable<ICodeSetQueryMetaData> {

    url = url +  '/' + oid + '/metadata';

    const options = key ? { headers: { 'X-API-KEY': key } } : {};
    return this.httpClient.get<ICodeSetQueryMetaData>(url, options).pipe(
      catchError(this.handleError),
     );
    }

    private handleError(result: HttpErrorResponse) {
      return throwError({
        error: result,
        message: result.error ? result.error.message : undefined,
        statusCode: result.status,
      });
    }

}
