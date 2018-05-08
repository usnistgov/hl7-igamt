import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';

@Injectable()
export class ValuesetsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {

  }


  public getValueset(id, callback) {
    let valueset;
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
        callback(valueset);
      });
    } else {
      callback(null);
    }
  }

  public getValuesetMetadata(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
        if (valueset != null) {
          callback(valueset.metadata);
        }
      });
    } else {
      callback(null);
    }
  }

  public getValuesetStructure(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
        if (valueset != null) {
          callback(valueset.structure);
        }
      });
    } else {
      callback(null);
    }
  }

  public getValuesetPreDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
        if (valueset != null) {
          callback(valueset.preDef);
        }
      });
    } else {
      callback(null);
    }
  }
  public getValuesetPostDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
        if (valueset != null) {
          callback(valueset.postDef);
        }
      });
    } else {
      callback(null);
    }
  }

  public getValuesetCrossReference(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {

      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        const valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
        if (valueset != null) {
          callback(valueset.crossReference);
        }
      });
    } else {
      callback(null);
    }
  }

  public saveValueset(valueset) {
    console.log(valueset);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        const savedValueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(valueset.id);
        this.doSave(valueset, savedValueset);
      });
    }
  }

  private doSave(valueset, savedValueset) {
    savedValueset = IndexedDbUtils.populateIObject(valueset, savedValueset);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
        await this.indexeddbService.changedObjectsDatabase.valuesets.put(savedValueset);
      });
    }
  }
}
