/**
 * Created by ena3 on 12/6/17.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";

@Injectable()
export  class IgListService {
  constructor(private http: HttpClient) {
  }

  getListByType(type){

   return  this.http.get('api/igdocuments/list/'+type);
  }

  getMyIGs(){

    return this.http.get("api/igdocuments");
  }

}
