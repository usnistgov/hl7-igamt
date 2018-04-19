import {Injectable} from '@angular/core';

import { ObjectsDatabase, IObject } from './objects-database';
import { ObjectsReferenceDatabase } from './objects-reference-database';
import {isUndefined} from 'ngx-bootstrap/bs-moment/utils/type-checks';

@Injectable()
export class IndexedDbService {
  changedObjectsDatabase;
  removedObjectsDatabase;
  createdObjectsDatabase;
  addedObjectsDatabase;
  igDocumentId?: string;
  constructor(igDocumentId) {
    this.changedObjectsDatabase = new ObjectsDatabase('ChangedObjectsDatabase');
    this.removedObjectsDatabase = new ObjectsReferenceDatabase('RemovedObjectsDatabase');
    this.createdObjectsDatabase = new ObjectsReferenceDatabase('CreatedObjectsDatabase');
    this.addedObjectsDatabase = new ObjectsReferenceDatabase('AddedObjectsDatabase');
    this.igDocumentId = igDocumentId;
  }
  public init() {
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase, async() => {
       this.changedObjectsDatabase.clear();
    });
    this.removedObjectsDatabase.transaction('rw', this.removedObjectsDatabase, async() => {
       this.removedObjectsDatabase.clear();
    });
    this.createdObjectsDatabase.transaction('rw', this.createdObjectsDatabase, async() => {
       this.createdObjectsDatabase.clear();
    });
    this.addedObjectsDatabase.transaction('rw', this.addedObjectsDatabase, async() => {
      this.addedObjectsDatabase.clear();
    });
  }

  public getDatatype (id, callback, field) {
    let datatype;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, async() => {
      datatype = await this.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        if (field === 'metadata') {
          callback(datatype.metadata);
        } else if (field === 'definition') {
          callback(datatype.definition);
        } else if (field === 'crossReference') {
          callback(datatype.crossReference);
        }
      }
    });
  }
  public getValueSet (id, callback, field) {
    let valueSet;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, async() => {
      valueSet = await this.changedObjectsDatabase.valueSets.get(id);
      if (valueSet != null) {
        if (field === 'metadata') {
          callback(valueSet.metadata);
        } else if (field === 'definition') {
          callback(valueSet.definition);
        } else if (field === 'crossReference') {
          callback(valueSet.crossReference);
        }
      }
    });
  }

  public getSegment (id, callback, field) {
    let segment;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, async() => {
      segment = await this.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        if (field === 'metadata') {
          callback(segment.metadata);
        } else if (field === 'definition') {
          callback(segment.definition);
        } else if (field === 'crossReference') {
          callback(segment.crossReference);
        }
      }
    });
  }
  public saveDatatype(datatype) {
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async() => {
      let savedDatatype = await this.changedObjectsDatabase.datatypes.get(datatype.id);
      if (savedDatatype.isUndefined()) {
        savedDatatype = new IObject();
        savedDatatype.id = datatype.id;
      }
      let changesToBeSaved = false;
      if (!datatype.metadata.isUndefined()) {
        savedDatatype.metadata = datatype.metadata;
        changesToBeSaved = true;
      }
      if (!datatype.definition.isUndefined()) {
        savedDatatype.definition = datatype.definition;
        changesToBeSaved = true;
      }
      if (!datatype.metadata.isUndefined()) {
        savedDatatype.crossReference = datatype.crossReference;
        changesToBeSaved = true;
      }
      if (changesToBeSaved) {
        await this.changedObjectsDatabase.datatypes.put(savedDatatype);
      }
    });
  }
  public saveSegment(segment) {
    console.log(segment);
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async() => {
      await this.changedObjectsDatabase.segments.put({
        'id': segment.id,
        'metadata': segment.metadata,
        'definition': segment.definition,
        'crossReference': segment.crossReference
      });
    });
  }

  public persistChanges() {
    const changedObjects = new ChangedObjects(this.igDocumentId);
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async() => {
      changedObjects.segments = await this.changedObjectsDatabase.segments.toArray();
    });
    // call igDocumentService save method
  }

}

class ChangedObjects {
  igDocumentId?: string;
  segments?: IObject;
  datatypes?: IObject;
  constructor(igDocumentId) {
    this.igDocumentId = igDocumentId;
  }
}
