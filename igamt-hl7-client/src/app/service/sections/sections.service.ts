import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SectionsIndexedDbService} from '../indexed-db/sections/sections-indexed-db.service';
import {Section} from '../indexed-db/objects-database';
import {IndexedDbService} from '../indexed-db/indexed-db.service';

@Injectable()
export class SectionsService {
  constructor(private http: HttpClient, private indexedDbService: IndexedDbService,
              private sectionsIndexedDbService: SectionsIndexedDbService) {}

  public getSection(sectionId): Promise<Section> {
    const promise = new Promise<any>((resolve, reject) => {
      this.sectionsIndexedDbService.getSection(sectionId).then((section) => {
        resolve(section);
      }).catch(() => {
        this.indexedDbService.getIgDocumentId().then((igDocumentId) => {
          this.http.get('api/igdocuments/' + igDocumentId + '/section/' + sectionId).subscribe(serverSection => {
            resolve(serverSection);
          }, error => {
            reject(error);
          });
        }).catch((error) => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public saveSection(section: Section): Promise<void> {
    return this.sectionsIndexedDbService.saveSection(section);
  }


}
