/**
 * Created by ena3 on 5/14/18.
 */
import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
@Injectable()
export  class IgDocumentAddingService {
  constructor(private http: HttpClient) {


  }



addMessages(wrapper){
  return this.http.post('/api/ig/addConforanceProfile', wrapper);

}
  getMessagesByVersion(hl7Version :string){
    return  this.http.get('api/igdocuments/findMessageEvents/'+hl7Version);

  }

}
