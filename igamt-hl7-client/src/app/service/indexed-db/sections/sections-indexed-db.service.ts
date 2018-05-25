import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import {Section} from '../objects-database';

@Injectable()
export class SectionsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {
  }

  public getSection(id): Promise<Section> {
    return new Promise<Section>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.sections, async () => {
          const section = await this.indexeddbService.changedObjectsDatabase.sections.get(id);
          resolve(section);
        });
      } else {
        reject();
      }
    });
  }

  public saveSection(section: Section): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.sections.put(section).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        reject();
      }
    });
  }

  public getByChangeType(type: string): Promise<Array<Section>> {
    return this.indexeddbService.changedObjectsDatabase.sections.where('changeType').equals(type).toArray();
  }

  public getAll(): Promise<Array<Section>> {
    return this.indexeddbService.changedObjectsDatabase.sections.toArray();
  }

}
