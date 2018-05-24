import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {Node} from '../node-database';
import {IObject} from '../objects-database';

@Injectable()
export class ValuesetsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {
  }

  public getValueset(id): Promise<IObject> {
    let valueset;
    const promise = new Promise<IObject>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.valuesets, async () => {
          valueset = await this.indexeddbService.changedObjectsDatabase.valuesets.get(id);
          resolve(valueset);
        });
      } else {
        reject();
      }
    });
    return promise;
  }

  public getValuesetMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getValueset(id).then((valueset) => {
        resolve(valueset.metadata);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getValuesetStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getValueset(id).then((valueset) => {
        resolve(valueset.structure);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getValuesetCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getValueset(id).then((valueset) => {
        resolve(valueset.crossReference);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getValuesetPostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getValueset(id).then((valueset) => {
        resolve(valueset.postDef);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getValuesetPreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getValueset(id).then((valueset) => {
        resolve(valueset.preDef);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getValuesetConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getValueset(id).then((valueset) => {
        resolve(valueset.conformanceStatements);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public saveValueset(valueset): Promise<any> {
    const promise = new Promise<IObject>((resolve, reject) => {
      this.getValueset(valueset.id).then(existingValueset => {
        this.doSave(valueset, existingValueset);
      });
    });
    return promise;
  }

  public saveValuesetStructureToNodeDatabase(id, valuesetStructure) {
    if (this.indexeddbService.nodeDatabase != null) {
      this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.valuesets, async () => {
        const valuesetNode = new Node();
        valuesetNode.id = id;
        valuesetNode.structure = valuesetStructure;
        await this.indexeddbService.nodeDatabase.valuesets.put(valuesetNode);
      });
    }
  }

  private doSave(valueset, savedValueset): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      savedValueset = IndexedDbUtils.populateIObject(valueset, savedValueset);
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.valuesets.put(savedValueset).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        reject();
      }
    });
    return promise;
  }
}
