import {Injectable} from '@angular/core';

import { ObjectsDatabase, IObject } from './objects-database';
import { ObjectsReferenceDatabase } from './objects-reference-database';
import Dexie from 'dexie';
import {IgDocumentService} from '../ig-document/ig-document.service';
import {NodeDatabase} from './node-database';
import {TocDatabase} from './toc-database';

@Injectable()
export class IndexedDbService {
  changedObjectsDatabase;
  removedObjectsDatabase;
  createdObjectsDatabase;
  addedObjectsDatabase;
  nodeDatabase;
  tocDataBase;

  igDocumentId?: string;
  constructor(public igDocumentService: IgDocumentService) {
  }

  public initializeDatabase(igDocumentId): Promise<{}> {
    this.igDocumentId = igDocumentId;
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('ChangedObjectsDatabase').then(() => {
        console.log('ChangedObjectsDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete ChangedObjectsDatabase');
      }).finally(() => {
        this.changedObjectsDatabase = new ObjectsDatabase('ChangedObjectsDatabase');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('RemovedObjectsDatabase').then(() => {
        console.log('RemovedObjectsDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete RemovedObjectsDatabase');
      }).finally(() => {
        this.removedObjectsDatabase = new ObjectsReferenceDatabase('RemovedObjectsDatabase');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('CreatedObjectsDatabase').then(() => {
        console.log('CreatedObjectsDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete CreatedObjectsDatabase');
      }).finally(() => {
        this.createdObjectsDatabase = new ObjectsReferenceDatabase('CreatedObjectsDatabase');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('AddedObjectsDatabase').then(() => {
        console.log('AddedObjectsDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete AddedObjectsDatabase');
      }).finally(() => {
        this.addedObjectsDatabase = new ObjectsReferenceDatabase('AddedObjectsDatabase');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('NodeDatabase').then(() => {
        console.log('NodeDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete NodeDatabase');
      }).finally(() => {
        this.nodeDatabase = new NodeDatabase('NodeDatabase');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('tocDataBase').then(() => {
        console.log('tocDataBase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete NodeDatabase');
      }).finally(() => {
        this.tocDataBase = new TocDatabase();
        resolve();
      });
    }));
    return Promise.all(promises);
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
  conformanceProfiles?: Array<IObject>;
  valuesets?: Array<IObject>;
  constructor(igDocumentId) {
    this.igDocumentId = igDocumentId;
  }
}
