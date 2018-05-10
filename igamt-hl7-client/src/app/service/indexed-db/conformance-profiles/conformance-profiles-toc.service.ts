import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class ConformanceProfilesTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getConformanceProfile(id, callback) {
    let conformanceProfile;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
        conformanceProfile = await this.indexeddbService.tocDataBase.conformanceProfiles.get(id);
        callback(conformanceProfile);
      });
    } else {
      callback(null);
    }
  }

  public addConformanceProfile(conformanceProfile) {
    console.log(conformanceProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
        const savedConformanceProfile = await this.indexeddbService.tocDataBase.conformanceProfiles.get(conformanceProfile.id);
        this.doSave(conformanceProfile, savedConformanceProfile);
      });
    }
  }

  private doSave(conformanceProfile, savedConformanceProfile) {
    savedConformanceProfile = IndexedDbUtils.populateIObject(conformanceProfile, savedConformanceProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
        await this.indexeddbService.tocDataBase.conformanceProfiles.put(savedConformanceProfile);
      });
    }
  }

  public bulkAdd(conformanceProfiles: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.tocDataBase != null) {
      return this.indexeddbService.tocDataBase.conformanceProfiles.bulkPut(conformanceProfiles);
      // this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
      //   return this.indexeddbService.tocDataBase.conformanceProfiles.bulkPut(conformanceProfiles);
      // });
    }
  }
}
