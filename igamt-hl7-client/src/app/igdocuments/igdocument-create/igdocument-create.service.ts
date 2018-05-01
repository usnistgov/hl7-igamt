/**
 * Created by ena3 on 12/29/17.
 */
import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";

@Injectable()
export  class IgDocumentCreateService {
  constructor(private http: HttpClient) {


  }

  getMessagesByVersion(hl7Version :string){
     return  this.http.get('api/igdocuments/findMessageEvents/'+hl7Version);

  }

  createIntegrationProfile(wrapper){
    return this.http.post('api/igdocument/createIntegrationProfile/', wrapper);

  }


}
