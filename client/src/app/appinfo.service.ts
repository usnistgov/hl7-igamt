import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppInfoService {

  private appInfoUrl = 'api/appInfo';

  constructor(private http: Http) { }

  getInfo() {
    return this.http.get(this.appInfoUrl)
      .toPromise()
      .then(res => <any[]> res.json());

  }

  // private handleError(error: any): Promise<any> {
  //   return Promise.reject(error.message || error);
  // }


}
