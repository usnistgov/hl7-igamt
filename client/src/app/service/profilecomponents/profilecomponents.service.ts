import {Injectable} from '@angular/core';
import { Http} from '@angular/http';

@Injectable()
export class ProfileComponentsService {
  constructor(private http: Http) {}
  public getProfileComponents(libId, callback) {
    this.http.get('api/profilecomponent-library/' +libId+ '/profilecomponents').map(res => res.json()).subscribe(data => {
      callback(data);
    });
  }

}
