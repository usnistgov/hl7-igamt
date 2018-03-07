import {Injectable} from '@angular/core';
import { Http} from '@angular/http';

@Injectable()
export class SegmentsService {
  constructor(private http: Http) {}
  public getSegments(libId, callback) {
    this.http.get('api/segment-library/' +libId+ '/segments').map(res => res.json()).subscribe(data => {
      callback(data);
    });
  }

}
