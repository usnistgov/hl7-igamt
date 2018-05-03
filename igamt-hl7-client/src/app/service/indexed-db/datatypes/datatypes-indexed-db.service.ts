import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';

@Injectable()
export class DatatypesIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {

  }


  public getDatatype(id, callback) {
    let datatype;
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
        callback(datatype);
      });
    } else {
      callback(null);
    }
  }

  public getDatatypeMetadata(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
        if (datatype != null) {
          callback(datatype.metadata);
        }
      });
    } else {
      callback(null);
    }
  }

  public getDatatypeStructure(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
        if (datatype != null) {
          callback(datatype.structure);
        }
      });
    } else {
      callback(null);
    }
  }

  public getDatatypePreDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
        if (datatype != null) {
          callback(datatype.preDef);
        }
      });
    } else {
      callback(null);
    }
  }
  public getDatatypePostDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
        if (datatype != null) {
          callback(datatype.postDef);
        }
      });
    } else {
      callback(null);
    }
  }

  public getDatatypeCrossReference(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {

      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
        if (datatype != null) {
          callback(datatype.crossReference);
        }
      });
    } else {
      callback(null);
    }
  }

  public saveDatatype(datatype) {
    console.log(datatype);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        const savedDatatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(datatype.id);
        this.doSave(datatype, savedDatatype);
      });
    }
  }

  private doSave(datatype, savedDatatype) {
    savedDatatype = IndexedDbUtils.populateIObject(datatype, savedDatatype);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
        await this.indexeddbService.changedObjectsDatabase.datatypes.put(savedDatatype);
      });
    }
  }
}
