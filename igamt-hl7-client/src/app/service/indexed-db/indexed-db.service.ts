import {Injectable} from '@angular/core';
import Dexie from 'dexie';
import {NodeDatabase} from './node-database';
import {IgDocumentInfo, IgDocumentInfoDatabase} from "./ig-document-info-database";
import {IgDocumentService} from "../../igdocuments/igdocument-edit/ig-document.service";

@Injectable()
export class IndexedDbService {
  nodeDatabase;
  tocDataBase;
  igDocumentInfoDataBase;

  igDocumentId?: string;

  constructor() {
    this.igDocumentInfoDataBase = new IgDocumentInfoDatabase();
    this.nodeDatabase = new NodeDatabase('NodeDatabase');
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
      Dexie.delete('cachedb').then(() => {
        console.log('cachedb successfully deleted');
      }).catch((err) => {
        console.error('Could not delete cachedb');
      }).finally(() => {
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

  public updateIgToc(id, nodes): Promise<string> {
    return new Promise((resolve, reject) => {
      this.igDocumentInfoDataBase.igDocument.update(id, {toc: nodes}).then(x => {
        console.log(x);
        resolve(x);

      }).catch((error) => {
        reject(error);
      });
    })
  }
  public updateIgMetadata(id, nodes): Promise<string> {
    return new Promise((resolve, reject) => {
      this.igDocumentInfoDataBase.igDocument.update(id, {metadata: nodes}).then(x => {
        console.log(x);
        resolve(x);

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


}
