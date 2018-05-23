import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class ConformanceProfilesTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getConformanceProfile(id, callback) {
    let conformanceProfile;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
        conformanceProfile = await this.indexeddbService.tocDataBase.conformanceProfiles.get(id);
        callback(conformanceProfile);
      });
    } else {
      callback(null);
    }
  }

  public saveConformanceProfile(conformanceProfile) {
    console.log(conformanceProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
        const savedConformanceProfile = await this.indexeddbService.tocDataBase.conformanceProfiles.get(conformanceProfile.id);
        this.doSave(conformanceProfile, savedConformanceProfile);
      });
    }
  }

  private doSave(conformanceProfile, savedConformanceProfile) {
    savedConformanceProfile = IndexedDbUtils.populateIObject(conformanceProfile, savedConformanceProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
        await this.indexeddbService.tocDataBase.conformanceProfiles.put(savedConformanceProfile);
      });
    }
  }

  public bulkAdd(conformanceProfiles: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.tocDataBase != null) {
      return this.indexeddbService.tocDataBase.conformanceProfiles.bulkPut(conformanceProfiles);
    }
  }

  public bulkAddNewConformanceProfiles(conformanceProfiles: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.addedObjectsDatabase != null) {
      return this.indexeddbService.addedObjectsDatabase.conformanceProfiles.bulkPut(conformanceProfiles);
    }
  }

  public removeConformanceProfile(conformanceProfileNode: TocNode) {
    this.indexeddbService.removedObjectsDatabase.conformanceProfiles.put(conformanceProfileNode).then(() => {
      this.removeFromToc(conformanceProfileNode);
    }, () => {
      console.log('Unable to remove node from TOC');
    });
  }

  private removeFromToc(conformanceProfileNode: TocNode) {
    this.indexeddbService.tocDataBase.conformanceProfiles.where('id').equals(conformanceProfileNode.id).delete();
  }

  public addConformanceProfile(conformanceProfileNode: TocNode) {
    this.indexeddbService.addedObjectsDatabase.conformanceProfiles.put(conformanceProfileNode).then(() => {}, () => {
      console.log('Unable to add node from TOC');
    });
  }

  public getAll(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      const promises = [];
      promises.push(this.getAllFromToc());
      promises.push(this.getAllFromAdded());
      Promise.all(promises).then( (results: Array<any>) => {
        const allNodes = new Array<TocNode>();
        const tocNodes = results[0];
        const addedNodes = results[1];
        if (tocNodes != null) {
          allNodes.push(tocNodes);
        }
        if (addedNodes != null) {
          allNodes.push(addedNodes);
        }
        resolve(allNodes);
      });
    });
    return promise;
  }

  private getAllFromToc(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, async () => {
        const conformanceProfiles = await this.indexeddbService.tocDataBase.conformanceProfiles.toArray();
        resolve(conformanceProfiles);
      });
    });
    return promise;
  }

  private getAllFromAdded(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      this.indexeddbService.addedObjectsDatabase.transaction('rw',
        this.indexeddbService.addedObjectsDatabase.conformanceProfiles, async () => {
        const conformanceProfiles = await this.indexeddbService.addedObjectsDatabase.conformanceProfiles.toArray();
        resolve(conformanceProfiles);
      });
    });
    return promise;
  }
}
