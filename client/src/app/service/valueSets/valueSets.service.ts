import {Injectable} from '@angular/core';
import { Http} from '@angular/http';

@Injectable()
export class ValueSetsService {
  constructor(private http: Http) {}
  public getValueSets(libId, callback) {
    this.http.get('api/table-library/' + libId + '/tables').map(res => res.json()).subscribe(data => {
      callback(data);
    });
  }
}
