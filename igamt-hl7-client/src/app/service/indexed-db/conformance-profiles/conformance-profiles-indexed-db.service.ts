import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';

@Injectable()
export class ConformanceProfilesIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {

  }


  public getConformanceProfile(id, callback) {
    let conformanceProfile;
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        conformanceProfile = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id);
        callback(conformanceProfile);
      });
    } else {
      callback(null);
    }
  }

  public getConformanceProfileMetadata(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        const conformanceProfile = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id);
        if (conformanceProfile != null) {
          callback(conformanceProfile.metadata);
        }
      });
    } else {
      callback(null);
    }
  }

  public getConformanceProfileStructure(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        const conformanceProfile = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id);
        if (conformanceProfile != null && conformanceProfile.structure != null) {
          callback(conformanceProfile.structure);
        } else {
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  }

  public getConformanceProfilePreDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        const conformanceProfile = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id);
        if (conformanceProfile != null) {
          callback(conformanceProfile.preDef);
        }
      });
    } else {
      callback(null);
    }
  }
  public getConformanceProfilePostDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        const conformanceProfile = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id);
        if (conformanceProfile != null) {
          callback(conformanceProfile.postDef);
        }
      });
    } else {
      callback(null);
    }
  }

  public getConformanceProfileCrossReference(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {

      this.indexeddbService.changedObjectsDatabase.transaction('r',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        const conformanceProfile = await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id);
        if (conformanceProfile != null) {
          callback(conformanceProfile.crossReference);
        }
      });
    } else {
      callback(null);
    }
  }

  public saveConformanceProfile(conformanceProfile) {
    console.log(conformanceProfile);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        const savedConformanceProfile = await this.indexeddbService.changedObjectsDatabase.
          conformanceProfiles.get(conformanceProfile.id);
        this.doSave(conformanceProfile, savedConformanceProfile);
      });
    }
  }

  private doSave(conformanceProfile, savedConformanceProfile) {
    savedConformanceProfile = IndexedDbUtils.populateIObject(conformanceProfile, savedConformanceProfile);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw',
        this.indexeddbService.changedObjectsDatabase.conformanceProfiles, async () => {
        await this.indexeddbService.changedObjectsDatabase.conformanceProfiles.put(savedConformanceProfile);
      });
    }
  }
}
