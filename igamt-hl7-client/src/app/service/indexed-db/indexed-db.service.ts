import {Injectable} from '@angular/core';

import { ObjectsDatabase, IObject } from './objects-database';
import { ObjectsReferenceDatabase } from './objects-reference-database';
import Dexie from 'dexie';

@Injectable()
export class IndexedDbService {
  changedObjectsDatabase;
  removedObjectsDatabase;
  createdObjectsDatabase;
  addedObjectsDatabase;
  igDocumentId?: string;
  constructor() {
    Dexie.delete('ChangedObjectsDatabase').then(() => {
      console.log('ChangedObjectsDatabase successfully deleted');
    }).catch((err) => {
      console.error('Could not delete ChangedObjectsDatabase');
    }).finally(() => {
      this.changedObjectsDatabase = new ObjectsDatabase('ChangedObjectsDatabase');
    });
    Dexie.delete('RemovedObjectsDatabase').then(() => {
      console.log('RemovedObjectsDatabase successfully deleted');
    }).catch((err) => {
      console.error('Could not delete RemovedObjectsDatabase');
    }).finally(() => {
      this.removedObjectsDatabase = new ObjectsReferenceDatabase('RemovedObjectsDatabase');
    });
    Dexie.delete('CreatedObjectsDatabase').then(() => {
      console.log('CreatedObjectsDatabase successfully deleted');
    }).catch((err) => {
      console.error('Could not delete CreatedObjectsDatabase');
    }).finally(() => {
      this.createdObjectsDatabase = new ObjectsReferenceDatabase('CreatedObjectsDatabase');
    });
    Dexie.delete('AddedObjectsDatabase').then(() => {
      console.log('AddedObjectsDatabase successfully deleted');
    }).catch((err) => {
      console.error('Could not delete AddedObjectsDatabase');
    }).finally(() => {
      this.addedObjectsDatabase = new ObjectsReferenceDatabase('AddedObjectsDatabase');
    });
  }

  public initializeDatabase (igDocumentId) {
    this.igDocumentId = igDocumentId;
  }

  public getDatatype (id, callback) {
    let datatype;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, async() => {
      datatype = await this.changedObjectsDatabase.datatypes.get(id);
      callback(datatype);
    });
  }

  public getDatatypeMetadata (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, async () => {
      const datatype = await this.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        callback(datatype.metadata);
      }
    });
  }

  public getDatatypeDefinition (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, async () => {
      const datatype = await this.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        callback(datatype.definition);
      }
    });
  }

  public getDatatypeCrossReference (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, async () => {
      const datatype = await this.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        callback(datatype.crossReference);
      }
    });
  }

  public getValueset (id, callback) {
    let valueset;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, async() => {
      valueset = await this.changedObjectsDatabase.valueSets.get(id);
      callback(valueset);
    });
  }

  public getValuesetMetadata (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, async () => {
      const valueset = await this.changedObjectsDatabase.valueSets.get(id);
      if (valueset != null) {
        callback(valueset.metadata);
      }
    });
  }

  public getValuesetDefinition (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, async () => {
      const valueset = await this.changedObjectsDatabase.valueSets.get(id);
      if (valueset != null) {
        callback(valueset.definition);
      }
    });
  }

  public getValuesetCrossReference (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, async () => {
      const valueset = await this.changedObjectsDatabase.valueSets.get(id);
      if (valueset != null) {
        callback(valueset.crossReference);
      }
    });
  }

  public saveDatatype(datatype) {
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async() => {
      let savedDatatype = await this.changedObjectsDatabase.datatypes.get(datatype.id);
      if (savedDatatype == null) {
        savedDatatype = new IObject();
        savedDatatype.id = datatype.id;
      }
      let changesToBeSaved = false;
      if (datatype.metadata != null) {
        savedDatatype.metadata = datatype.metadata;
        changesToBeSaved = true;
      }
      if (datatype.definition !== undefined) {
        savedDatatype.definition = datatype.definition;
        changesToBeSaved = true;
      }
      if (datatype.metadata !== undefined) {
        savedDatatype.crossReference = datatype.crossReference;
        changesToBeSaved = true;
      }
      if (changesToBeSaved) {
        await this.changedObjectsDatabase.datatypes.put(savedDatatype);
      }
    });
  }

  public persistChanges() {
    const changedObjects = new ChangedObjects(this.igDocumentId);
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async () => {
        changedObjects.segments = await this.changedObjectsDatabase.segments.toArray();
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async () => {
        changedObjects.datatypes = await this.changedObjectsDatabase.datatypes.toArray();
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.valueSets, async () => {
        changedObjects.valuesets = await this.changedObjectsDatabase.valueSets.toArray();
        resolve();
      });
    }));
    const doPersist = this.doPersist;
    Promise.all(promises).then(function(){
      doPersist(changedObjects);
    });
  }

  private doPersist(changedObjects) {
    console.log(JSON.stringify(changedObjects));
    // TODO call igService.save
  }
}

class ChangedObjects {
  igDocumentId?: string;
  segments?: Array<IObject>;
  datatypes?: Array<IObject>;
  valuesets?: Array<IObject>;
  constructor(igDocumentId) {
    this.igDocumentId = igDocumentId;
  }
}
