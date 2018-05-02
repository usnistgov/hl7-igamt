import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class IgDocumentService {
  constructor(private http: HttpClient) {
  }

  public save(changedObjects) {
    this.http.post('api/igdocuments/' + changedObjects.igDocumentId + '/save', changedObjects).subscribe(
      result => console.log('IG Document successfully saved ' + result));
  }

}
