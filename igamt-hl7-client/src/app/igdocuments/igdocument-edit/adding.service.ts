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
  addSegment(wrapper){
    return this.http.post('/api/ig/addSegments', wrapper);

  }
  getMessagesByVersion(hl7Version :string){
    return  this.http.get('api/igdocuments/findMessageEvents/'+hl7Version);

  }

  getHl7SegmentByVersion(hl7Version){
    return  this.http.get('api/ig/findHl7Segments/'+hl7Version);


  }

}
