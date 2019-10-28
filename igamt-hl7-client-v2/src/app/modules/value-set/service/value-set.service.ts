import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, throwError} from 'rxjs';
import {catchError, concatMap, map, mergeMap} from 'rxjs/operators';
import {TurnOffLoader} from '../../../root-store/loader/loader.actions';
import {Message} from '../../core/models/message/message.class';
import {IChange} from '../../shared/models/save-change';
import {ICodes, IValueSet} from '../../shared/models/value-set.interface';
@Injectable({
  providedIn: 'root',
})
export class ValueSetService {

  constructor(private http: HttpClient, private store: Store<any>) { }

  getById(igId: string, id: string): Observable<any> {
    return this.http.get<IValueSet>('api/igdocuments/' + igId + '/valueset/' + id).pipe(
      map((x) => {
          this.store.dispatch(new TurnOffLoader());
          return x;
      }),
      catchError((error: HttpErrorResponse) => {
        this.store.dispatch(new TurnOffLoader());
        return null;
      }),
    );
  }
  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/valuesets/' + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }

  exportCSVFile(vsId: string) {
    const form = document.createElement('form');
    form.action = 'api/valuesets/exportCSV/' + vsId;
    form.method = 'POST';
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }
}
