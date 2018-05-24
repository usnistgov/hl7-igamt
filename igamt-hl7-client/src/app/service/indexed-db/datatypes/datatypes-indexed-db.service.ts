import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {Node} from '../node-database';
import {IObject} from '../objects-database';

@Injectable()
export class DatatypesIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {
  }

  public getDatatype(id): Promise<IObject> {
    let datatype;
    const promise = new Promise<IObject>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.datatypes, async () => {
          datatype = await this.indexeddbService.changedObjectsDatabase.datatypes.get(id);
          resolve(datatype);
        });
      } else {
        reject();
      }
    });
    return promise;
  }

  public getDatatypeMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getDatatype(id).then((datatype) => {
        resolve(datatype.metadata);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getDatatypeStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getDatatype(id).then((datatype) => {
        resolve(datatype.structure);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getDatatypeCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getDatatype(id).then((datatype) => {
        resolve(datatype.crossReference);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getDatatypePostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getDatatype(id).then((datatype) => {
        resolve(datatype.postDef);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getDatatypePreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getDatatype(id).then((datatype) => {
        resolve(datatype.preDef);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getDatatypeConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getDatatype(id).then((datatype) => {
        resolve(datatype.conformanceStatements);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public saveDatatype(datatype): Promise<any> {
    const promise = new Promise<IObject>((resolve, reject) => {
      this.getDatatype(datatype.id).then(existingDatatype => {
        this.doSave(datatype, existingDatatype);
      });
    });
    return promise;
  }

  public saveDatatypeStructureToNodeDatabase(id, datatypeStructure) {
    if (this.indexeddbService.nodeDatabase != null) {
      this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.datatypes, async () => {
        const datatypeNode = new Node();
        datatypeNode.id = id;
        datatypeNode.structure = datatypeStructure;
        await this.indexeddbService.nodeDatabase.datatypes.put(datatypeNode);
      });
    }
  }

  private doSave(datatype, savedDatatype): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      savedDatatype = IndexedDbUtils.populateIObject(datatype, savedDatatype);
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.datatypes.put(savedDatatype).then(() => {
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
