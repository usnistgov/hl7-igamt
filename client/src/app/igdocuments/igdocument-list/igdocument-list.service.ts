/**
 * Created by ena3 on 12/6/17.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export  class IgListService {
  constructor(private http: Http) {
  }

  getListByType(type){

   return  this.http.get('api/igdocuments/list/'+type)
      .toPromise()
      .then(res => <any[]> res.json());




  }
}
