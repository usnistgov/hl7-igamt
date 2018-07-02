import {Injectable} from '@angular/core';

import { ObjectsDatabase, IObject } from './objects-database';
import { ObjectsReferenceDatabase } from './objects-reference-database';
import Dexie from 'dexie';
import {IgDocumentService} from '../ig-document/ig-document.service';
import {NodeDatabase} from './node-database';
import {TocDatabase} from './toc-database';
import {IgDocumentInfo, IgDocumentInfoDatabase} from "./ig-document-info-database";

@Injectable()
export class IndexedDbService {
  changedObjectsDatabase;
  removedObjectsDatabase;
  createdObjectsDatabase;
  addedObjectsDatabase;
  nodeDatabase;
  tocDataBase;
  igDocumentInfoDataBase;

  igDocumentId?: string;
  constructor(public igDocumentService: IgDocumentService) {
    this.igDocumentInfoDataBase = new IgDocumentInfoDatabase();
    this.changedObjectsDatabase = new ObjectsDatabase('ChangedObjectsDatabase');
    this.removedObjectsDatabase = new TocDatabase('RemovedObjectsDatabase');
    this.createdObjectsDatabase = new TocDatabase('CreatedObjectsDatabase');
    this.addedObjectsDatabase = new TocDatabase('AddedObjectsDatabase');
    this.nodeDatabase = new NodeDatabase('NodeDatabase');
    this.tocDataBase = new TocDatabase('TocDataBase');
  }

  public initializeDatabase(igDocumentId): Promise<{}> {
    this.igDocumentInfoDataBase = new IgDocumentInfoDatabase();
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('IgDocumentInfoDatabase').then(() => {
        console.log('IgDocumentInfoDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete IgDocumentInfoDatabase');
      }).finally(() => {
        this.igDocumentInfoDataBase = new IgDocumentInfoDatabase();
        this.igDocumentInfoDataBase.igDocument.put(new IgDocumentInfo(igDocumentId)).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    }));
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
        this.removedObjectsDatabase = new TocDatabase('RemovedObjectsDatabase');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('CreatedObjectsDatabase').then(() => {
        console.log('CreatedObjectsDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete CreatedObjectsDatabase');
      }).finally(() => {
        this.createdObjectsDatabase = new TocDatabase('CreatedObjectsDatabase');
        resolve();
      });
    }));
    promises.push(new Promise((resolve, reject) => {
      Dexie.delete('AddedObjectsDatabase').then(() => {
        console.log('AddedObjectsDatabase successfully deleted');
      }).catch((err) => {
        console.error('Could not delete AddedObjectsDatabase');
      }).finally(() => {
        this.addedObjectsDatabase = new TocDatabase('AddedObjectsDatabase');
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
        this.tocDataBase = new TocDatabase('TocDataBase');
        resolve();
      });
    }));
    return Promise.all(promises);
  }

  public getIgDocument(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.igDocumentInfoDataBase.igDocument.toArray().then((collection) => {
        if (collection != null && collection.length >= 1) {
          resolve(collection[0]);
        } else {
          reject();
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }

  public updateIgDocument(id, nodes): Promise<string> {
    return new Promise((resolve, reject) => {
      this.igDocumentInfoDataBase.igDocument.update(id, {toc: nodes}).then(x => {
        console.log(x);

      }).catch((error) => {
        reject(error);
      });
    })
  }

  public initIg(ig): Promise<string> {
    return new Promise((resolve, reject) => {
      this.igDocumentInfoDataBase.igDocument.put(ig).then(x => {
        console.log("Putting IG ");
        console.log(x);
        resolve(ig);

      }).catch((error) => {
        reject(error);
      });
    })
  }

  public getIgDocumentId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.igDocumentInfoDataBase.igDocument.toArray().then((collection) => {
        if (collection != null && collection.length >= 1) {
          resolve(collection[0].id);
        } else {
          reject();
        }
      }).catch((error) => {
        reject(error);
      });
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
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(function(){
        console.log('Persisting all changed objects (' + changedObjects.segments.length + ' segments, '
          + changedObjects.datatypes.length + ' datatypes, ' + changedObjects.valuesets.length + ' valuesets).');
        doPersist(changedObjects, igDocumentService).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    });
  }

  private doPersist(changedObjects, igDocumentService): Promise<any> {
    console.log(JSON.stringify(changedObjects));
    return igDocumentService.save(changedObjects);
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
