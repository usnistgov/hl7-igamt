import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';

@Injectable()
export class ValuesetsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {

  }


  public getValueset (id, callback) {
    let valueset;
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async() => {
      valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
      callback(valueset);
    });
  }

  public getValuesetMetadata (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
      const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
      if (valueset != null) {
        callback(valueset.metadata);
      }
    });
  }

  public getValuesetDefinition (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
      const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
      if (valueset != null) {
        callback(valueset.definition);
      }
    });
  }

  public getValuesetCrossReference (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
      const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
      if (valueset != null) {
        callback(valueset.crossReference);
      }
    });
  }

  public saveValueset(valueset) {
    console.log(valueset);
    this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.valuesets, async() => {
      const savedValueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(valueset.id);
      this.doSave(valueset, savedValueset);
    });
  }

  private doSave(valueset, savedValueset) {
    savedValueset = IndexedDbUtils.populateIObject(savedValueset, valueset);
    this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.valuesets, async() => {
      await this.indexeddbService.changedObjectsDatabase.valuesets.put(savedValueset);
    });
  }
}
