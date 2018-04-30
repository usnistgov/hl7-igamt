import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import {IObject} from '../objects-database';
import IndexedDbUtils from "../indexed-db-utils";

@Injectable()
export class DatatypesIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {

  }


  public getDatatype (id, callback) {
    let datatype;
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async() => {
      datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
      callback(datatype);
    });
  }

  public getDatatypeMetadata (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
      const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        callback(datatype.metadata);
      }
    });
  }

  public getDatatypeDefinition (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
      const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        callback(datatype.definition);
      }
    });
  }

  public getDatatypeCrossReference (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
      const datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        callback(datatype.crossReference);
      }
    });
  }

  public saveDatatype(datatype) {
    console.log(datatype);
    this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.datatypes, async() => {
      const savedDatatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(datatype.id);
      this.doSave(datatype, savedDatatype);
    });
  }

  private doSave(datatype, savedDatatype) {
    savedDatatype = IndexedDbUtils.populateIObject(savedDatatype, datatype);
    this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.datatypes, async() => {
      await this.indexeddbService.changedObjectsDatabase.datatypes.put(savedDatatype);
    });
  }
}
