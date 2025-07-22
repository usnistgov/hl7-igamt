import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

export interface CodeSetVersionMetadata {
  name: string;
  date: Date;
  numberOfCodes: number;
  version: string;
  id: string;
}

export interface CodeSetMetadata {
  id: string;
  name: string;
  latestStableVersion: {
    version: string;
    date: Date;
  };
  versions: Array<{
    version: string;
    date: Date;
  }>;
}

@Component({
  selector: 'app-external-vs-metadata',
  templateUrl: './external-vs-metadata.component.html',
  styleUrls: ['./external-vs-metadata.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ExternalVsMetadataComponent implements OnChanges {

  @Input()
  set url(url: string) {
    try {
      const parsed = new URL(url);
      const version = parsed.searchParams.get('version');
      this.base = parsed.origin + parsed.pathname;
      if (version) {
        this.version = version;
      }
    } catch (e) {
      this.invalidURL = true;
    }
  }

  version: string | undefined;
  base: string;
  loading = false;
  errored = false;
  invalidURL = false;
  subscription: Subscription;
  metadata: Observable<CodeSetVersionMetadata>;

  constructor(private http: HttpClient) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.invalidURL) {
      this.errored = false;
      this.loading = false;
      if (this.version) {
        this.metadata = this.fetchVersionMetadata(this.version);
      } else {
        this.metadata = this.fetchLastVersionMetadata();
      }
    }
  }

  fetchLastVersionMetadata(): Observable<CodeSetVersionMetadata> {
    const codeSetMetadataUrl = `${this.base}/metadata`;
    return of(1).pipe(
      tap(() => {
        this.loading = true;
      }),
      mergeMap(() => {
        return this.http.get<CodeSetMetadata>(codeSetMetadataUrl).pipe(
          mergeMap((codeSetMetadata) => {
            if (codeSetMetadata && codeSetMetadata.latestStableVersion) {
              return this.fetchVersionMetadata(codeSetMetadata.latestStableVersion.version);
            } else {
              this.errored = true;
              this.loading = false;
            }
            return EMPTY;
          }),
          catchError(() => {
            this.errored = true;
            this.loading = false;
            return EMPTY;
          }),
        );
      }),
    );
  }

  fetchVersionMetadata(version: string): Observable<CodeSetVersionMetadata> {
    const versionMetadataUrl = `${this.base}/versions/${version}/metadata`;
    return of(1).pipe(
      tap(() => {
        this.loading = true;
      }),
      mergeMap(() => {
        return this.http.get<CodeSetVersionMetadata>(versionMetadataUrl).pipe(
          tap(() => {
            this.loading = false;
          }),
          catchError(() => {
            this.errored = true;
            this.loading = false;
            return EMPTY;
          }),
        );
      }),
    );
  }

}
