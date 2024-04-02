import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ICodeSetVersionFetch {
    list: IExternalCode[];
}

export interface IExternalCode {

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

    fetchCodes(url: string, key?: string): Observable<ICodeSetVersionFetch> {
        const options = key ? { headers: { 'X-API-KEY': key } } : {};
        return this.httpClient.get<ICodeSetVersionFetch>(url, options).pipe(
            catchError((result: HttpErrorResponse) => {
                return throwError({
                    error: result,
                    message: result.error ? result.error.message : undefined,
                    statusCode: result.status,
                });
            }),
        );
    }

}
