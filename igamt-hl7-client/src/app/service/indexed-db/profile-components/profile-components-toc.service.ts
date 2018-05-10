import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class ProfileComponentsTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getProfileComponent(id, callback) {
    let profileComponent;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.profileComponents, async () => {
        profileComponent = await this.indexeddbService.tocDataBase.profileComponents.get(id);
        callback(profileComponent);
      });
    } else {
      callback(null);
    }
  }

  public addProfileComponent(profileComponent) {
    console.log(profileComponent);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, async () => {
        const savedProfileComponent = await this.indexeddbService.tocDataBase.profileComponents.get(profileComponent.id);
        this.doSave(profileComponent, savedProfileComponent);
      });
    }
  }

  private doSave(profileComponent, savedProfileComponent) {
    savedProfileComponent = IndexedDbUtils.populateIObject(profileComponent, savedProfileComponent);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, async () => {
        await this.indexeddbService.tocDataBase.profileComponents.put(savedProfileComponent);
      });
    }
  }

  public bulkAdd(profileComponents: Array<TocNode>) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, async () => {
        this.indexeddbService.tocDataBase.profileComponents.bulkPut(profileComponents).subscribe(success => {
          return true;
        }, error => {
          return false;
        });
      });
    }
  }
}
