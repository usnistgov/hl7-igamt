import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IndexedDbService} from '../indexed-db/indexed-db.service';

@Injectable()
export class SectionsService {
  constructor(private http: HttpClient, private indexedDbService: IndexedDbService) {}

  public getSection(sectionId): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.indexedDbService.getIgDocumentId().then((igDocumentId) => {
          this.http.get('api/igdocuments/' + igDocumentId + '/section/' + sectionId).toPromise().then(serverSection => {
            resolve(serverSection);
          }, error => {
            reject(error);
          });
        }).catch((error) => {
          reject(error);
        });
      });
    return promise;
  }








}
