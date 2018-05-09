import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class CompositeProfilesTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getCompositeProfile(id, callback) {
    let compositeProfile;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        compositeProfile = await this.indexeddbService.tocDataBase.compositeProfiles.get(id);
        callback(compositeProfile);
      });
    } else {
      callback(null);
    }
  }

  public addCompositeProfile(compositeProfile) {
    console.log(compositeProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        const savedCompositeProfile = await this.indexeddbService.tocDataBase.compositeProfiles.get(compositeProfile.id);
        this.doSave(compositeProfile, savedCompositeProfile);
      });
    }
  }

  private doSave(compositeProfile, savedCompositeProfile) {
    savedCompositeProfile = IndexedDbUtils.populateIObject(compositeProfile, savedCompositeProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        await this.indexeddbService.tocDataBase.compositeProfiles.put(savedCompositeProfile);
      });
    }
  }

  public bulkAdd(compositeProfiles: Array<TocNode>) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        this.indexeddbService.tocDataBase.compositeProfiles.bulkPut(compositeProfiles).subscribe(success => {
          return true;
        }, error => {
          return false;
        });
      });
    }
  }
}
