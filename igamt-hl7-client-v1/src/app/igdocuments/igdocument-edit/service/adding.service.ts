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
  return this.http.post('api/igdocuments/'+wrapper.id+'/conformanceprofiles/add', wrapper);
  }

  addSegment(wrapper){
    return this.http.post('api/igdocuments/'+wrapper.id+'/segments/add', wrapper);
  }

  addDatatypes(wrapper){
    return this.http.post('api/igdocuments/'+wrapper.id+'/datatypes/add', wrapper);
  }

  addValueSets(wrapper){
    return this.http.post('api/igdocuments/'+wrapper.id+'/valuesets/add', wrapper);
  }

  getMessagesByVersion(hl7Version :string){
    return  this.http.get('api/igdocuments/findMessageEvents/'+hl7Version);
  }

  getHl7SegmentByVersion(hl7Version){
    return  this.http.get('api/segments/hl7/'+hl7Version);
  }

  getHl7DatatypesByVersion(hl7Version){
    return  this.http.get('api/datatypes/hl7/'+hl7Version);
  }

  getHl7ValueSetsByVersion(hl7Version){
    return  this.http.get('api/valuesets/hl7/'+hl7Version);
  }
}
