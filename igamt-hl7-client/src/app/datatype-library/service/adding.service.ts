/**
 * Created by ena3 on 5/14/18.
 */
import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
@Injectable()
export  class DatatypeLibraryAddingService {
  constructor(private http: HttpClient) {


  }

  getHl7DatatypesByVersion(hl7Version){
    return  this.http.get('api/datatypes/hl7/'+hl7Version);


  }

  getDatatypeClasses(){
    return  this.http.get<any[]>('/api/hl7classes');


  }

  addDatatypes(wrapper){
    return this.http.post('api/datatype-library/'+wrapper.id+'/datatypes/add', wrapper);

  }

}
