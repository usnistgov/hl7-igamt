/**
 * Created by ena3 on 12/29/17.
 */
import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export  class DatatypeLibraryCreateService {
  constructor(private http: HttpClient) {




  }

  create(creationWrapper){
  return this.http.post<any>("/api/datatype-library/create", creationWrapper);
  }
}
