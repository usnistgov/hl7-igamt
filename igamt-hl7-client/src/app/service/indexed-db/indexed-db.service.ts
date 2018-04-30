import {Injectable} from '@angular/core';

import { ObjectsDatabase, IObject } from './objects-database';
import { ObjectsReferenceDatabase } from './objects-reference-database';

@Injectable()
export class IndexedDbService {
  changedObjectsDatabase;
  removedObjectsDatabase;
  createdObjectsDatabase;
  addedObjectsDatabase;
  igDocumentId?: string;
  constructor() {
    if (this.changedObjectsDatabase == null) {
      this.changedObjectsDatabase = new ObjectsDatabase('ChangedObjectsDatabase');
    }
    if (this.removedObjectsDatabase == null) {
      this.removedObjectsDatabase = new ObjectsReferenceDatabase('RemovedObjectsDatabase');
    }
    if (this.createdObjectsDatabase == null) {
      this.createdObjectsDatabase = new ObjectsReferenceDatabase('CreatedObjectsDatabase');
    }
    if (this.addedObjectsDatabase == null) {
      this.addedObjectsDatabase = new ObjectsReferenceDatabase('AddedObjectsDatabase');
    }
  }
  public init() {}

  public initializeDatabase (igDocumentId) {
    this.igDocumentId = igDocumentId;
    // this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase, async () => {
    //   this.changedObjectsDatabase.clear();
    // });
    // this.removedObjectsDatabase.transaction('rw', this.removedObjectsDatabase, async () => {
    //   this.removedObjectsDatabase.clear();
    // });
    // this.createdObjectsDatabase.transaction('rw', this.createdObjectsDatabase, async () => {
    //   this.createdObjectsDatabase.clear();
    // });
    // this.addedObjectsDatabase.transaction('rw', this.addedObjectsDatabase, async () => {
    //   this.addedObjectsDatabase.clear();
    // });
  }

  public getSegment (id, callback) {
    let segment;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, async() => {
      segment = await this.changedObjectsDatabase.segments.get(id);
      callback(segment);
    });
  }

  public getSegmentMetadata (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, async () => {
      const segment = await this.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        callback(segment.metadata);
      }
    });
  }

  public getSegmentDefinition (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, async () => {
      const segment = await this.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        callback(segment.definition);
      }
    });
  }

  public getSegmentCrossReference (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, async () => {
      const segment = await this.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        callback(segment.crossReference);
      }
    });
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
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valuesets, async() => {
      valueset = await this.changedObjectsDatabase.valuesets.get(id);
      callback(valueset);
    });
  }

  public getValuesetMetadata (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valuesets, async () => {
      const valueset = await this.changedObjectsDatabase.valuesets.get(id);
      if (valueset != null) {
        callback(valueset.metadata);
      }
    });
  }

  public getValuesetDefinition (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valuesets, async () => {
      const valueset = await this.changedObjectsDatabase.valuesets.get(id);
      if (valueset != null) {
        callback(valueset.definition);
      }
    });
  }

  public getValuesetCrossReference (id, callback) {
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valuesets, async () => {
      const valueset = await this.changedObjectsDatabase.valuesets.get(id);
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
  public saveSegment(segment) {
    console.log(segment);
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async() => {
      let savedSegment = await this.changedObjectsDatabase.segments.get(segment.id);
      if (savedSegment == null) {
        savedSegment = new IObject();
        savedSegment.id = segment.id;
      }
      let changesToBeSaved = false;
      if (segment.metadata != null) {
        savedSegment.metadata = segment.metadata;
        changesToBeSaved = true;
      }
      if (segment.definition != null) {
        savedSegment.definition = segment.definition;
        changesToBeSaved = true;
      }
      if (segment.metadata != null) {
        savedSegment.crossReference = segment.crossReference;
        changesToBeSaved = true;
      }
      if (changesToBeSaved) {
        await this.changedObjectsDatabase.segments.put(savedSegment);
      }
    });
  }

  public persistChanges() {
    this.getAllChanges().then(changedObjects => {
      console.log('persist5');
      console.log(JSON.stringify(changedObjects));
    });
  }
  private getAllChanges(): Promise<any> {
    const changedObjects = new ChangedObjects(this.igDocumentId);
    console.log('persist1');
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async () => {
        changedObjects.segments = await this.changedObjectsDatabase.segments.toArray();
        console.log('persist2');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async () => {
        changedObjects.datatypes = await this.changedObjectsDatabase.datatypes.toArray();
        console.log('persist3');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.valuesets, async () => {
        changedObjects.valuesets = await this.changedObjectsDatabase.valuesets.toArray();
        console.log('persist4');
        resolve();
      });
    }));
    return Promise.all(promises);
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
