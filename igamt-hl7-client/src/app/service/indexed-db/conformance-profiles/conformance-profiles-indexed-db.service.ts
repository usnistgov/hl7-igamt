import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {Node} from '../node-database';
import {IObject} from '../objects-database';

@Injectable()
export class ConformanceProfilesIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {
  }

  public getConformanceProfile(id): Promise<IObject> {
    let conformanceProfile;
    const promise = new Promise<IObject>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
          conformanceProfile = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id);
          resolve(conformanceProfile);
        });
      } else {
        reject();
      }
    });
    return promise;
  }

  public getConformanceProfileMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getConformanceProfile(id).then((conformanceProfile) => {
        resolve(conformanceProfile.metadata);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getAllMetaData(): Promise<any> {
    let conformanceProfiles;
    const promise = new Promise<any>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
          conformanceProfiles = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.filter(function (conformanceProfile) {
            return conformanceProfile.metadata;
          }).toArray();
          resolve(conformanceProfiles);
        });
      } else {
        reject();
      }
    });
    return promise;
  }


  public getConformanceProfileStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getConformanceProfile(id).then((conformanceProfile) => {
        resolve(conformanceProfile.structure);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getConformanceProfileCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getConformanceProfile(id).then((conformanceProfile) => {
        resolve(conformanceProfile.crossReference);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getConformanceProfilePostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getConformanceProfile(id).then((conformanceProfile) => {
        resolve(conformanceProfile.postDef);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getConformanceProfilePreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getConformanceProfile(id).then((conformanceProfile) => {
        resolve(conformanceProfile.preDef);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getConformanceProfileConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getConformanceProfile(id).then((conformanceProfile) => {
        resolve(conformanceProfile.conformanceStatements);
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public saveConformanceProfile(conformanceProfile): Promise<any> {
    const promise = new Promise<IObject>((resolve, reject) => {
      this.getConformanceProfile(conformanceProfile.id).then(existingConformanceProfile => {
        this.doSave(conformanceProfile, existingConformanceProfile);
      });
    });
    return promise;
  }

  public saveConformanceProfileStructureToNodeDatabase(id, conformanceProfileStructure) {
    if (this.indexeddbService.nodeDatabase != null) {
      this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.conformanceProfiles, async () => {
        const conformanceProfileNode = new Node();
        conformanceProfileNode.id = id;
        conformanceProfileNode.structure = conformanceProfileStructure;
        await this.indexeddbService.nodeDatabase.conformanceProfiles.put(conformanceProfileNode);
      });
    }
  }

  private doSave(conformanceProfile, savedConformanceProfile): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      savedConformanceProfile = IndexedDbUtils.populateIObject(conformanceProfile, savedConformanceProfile);
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles.put(savedConformanceProfile).then(() => {
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
