import {Injectable} from '@angular/core';
import { Http} from '@angular/http';

@Injectable()
export class DatatypesService {
  constructor(private http: Http) {}
  public getDatatypes(libId, callback) {
    this.http.get('api/datatype-library/' +libId+ '/datatypes').map(res => res.json()).subscribe(data => {
      callback(data);
    });
  }
  /*public saveDatatypes(datatypes) {
    this.http.post('api/datatypes/save', datatypes);
  }*/
}
