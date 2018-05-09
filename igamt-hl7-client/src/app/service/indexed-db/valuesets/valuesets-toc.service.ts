import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class ValuesetsTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getValueset(id, callback) {
    let valueset;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.valuesets, async () => {
        valueset = await this.indexeddbService.tocDataBase.valuesets.get(id);
        callback(valueset);
      });
    } else {
      callback(null);
    }
  }

  public addValueset(valueset) {
    console.log(valueset);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, async () => {
        const savedValueset = await this.indexeddbService.tocDataBase.valuesets.get(valueset.id);
        this.doSave(valueset, savedValueset);
      });
    }
  }

  private doSave(valueset, savedValueset) {
    savedValueset = IndexedDbUtils.populateIObject(valueset, savedValueset);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, async () => {
        await this.indexeddbService.tocDataBase.valuesets.put(savedValueset);
      });
    }
  }

  public bulkAdd(valuesets: Array<TocNode>) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, async () => {
        await this.indexeddbService.tocDataBase.valuesets.bulkPut(valuesets);
      });
    }
  }
}
