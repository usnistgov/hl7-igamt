/**
 * Created by ena3 on 12/29/17.
 */
import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export  class IgDocumentCreateService {
  constructor(private http: Http) {


  }

  getMessagesByVersion(hl7Version :string){
    return  this.http.post('api/igdocuments/messageListByVersion/', hl7Version)
      .toPromise()
      .then(res => { return <any[]> res.json()});

  }

  createIntegrationProfile(wrapper){
    return  this.http.post('api/igdocuments/createIntegrationProfile/', wrapper)
      .toPromise()
      .then(res => <any> res.json());

  }


}
