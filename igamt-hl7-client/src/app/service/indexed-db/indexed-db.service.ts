import {Injectable} from '@angular/core';

import { ObjectsDatabase, IObject } from './objects-database';
import { ObjectsReferenceDatabase } from './objects-reference-database';
import Dexie from 'dexie';
import {IgDocumentService} from "../ig-document/ig-document.service";

@Injectable()
export class IndexedDbService {
  changedObjectsDatabase;
  removedObjectsDatabase;
  createdObjectsDatabase;
  addedObjectsDatabase;
  igDocumentId?: string;
  constructor(public igDocumentService: IgDocumentService) {
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
      console.log('Loading changed segments');
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async () => {
        changedObjects.segments = await this.changedObjectsDatabase.segments.toArray();
        console.log('Changed segments successfully loaded');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      console.log('Loading changed datatypes');
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async () => {
        changedObjects.datatypes = await this.changedObjectsDatabase.datatypes.toArray();
        console.log('Changed datatypes successfully loaded');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      console.log('Loading changed valuesets');
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.valuesets, async () => {
        changedObjects.valuesets = await this.changedObjectsDatabase.valuesets.toArray();
        console.log('Changed valuesets successfully loaded');
        resolve();
      });
    }));
    const doPersist = this.doPersist;
    const igDocumentService = this.igDocumentService;
    Promise.all(promises).then(function(){
      console.log('Persisting all changed objects (' + changedObjects.segments.length + ' segments, '
        + changedObjects.datatypes.length + ' datatypes, ' + changedObjects.valuesets.length + ' valuesets).');
      doPersist(changedObjects, igDocumentService);
    });
  }

  private doPersist(changedObjects, igDocumentService) {
    console.log(JSON.stringify(changedObjects));
    igDocumentService.save(changedObjects);
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
