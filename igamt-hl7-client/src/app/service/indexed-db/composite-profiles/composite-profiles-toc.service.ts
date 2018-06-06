import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class CompositeProfilesTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getCompositeProfile(id, callback) {
    let compositeProfile;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        compositeProfile = await this.indexeddbService.tocDataBase.compositeProfiles.get(id);
        callback(compositeProfile);
      });
    } else {
      callback(null);
    }
  }

  public saveCompositeProfile(compositeProfile) {
    console.log(compositeProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        const savedCompositeProfile = await this.indexeddbService.tocDataBase.compositeProfiles.get(compositeProfile.id);
        this.doSave(compositeProfile, savedCompositeProfile);
      });
    }
  }

  private doSave(compositeProfile, savedCompositeProfile) {
    savedCompositeProfile = IndexedDbUtils.populateIObject(compositeProfile, savedCompositeProfile);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        await this.indexeddbService.tocDataBase.compositeProfiles.put(savedCompositeProfile);
      });
    }
  }

  public bulkAdd(compositeProfiles: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.tocDataBase != null) {
      return this.indexeddbService.tocDataBase.compositeProfiles.bulkPut(compositeProfiles);
    }
  }

  public bulkAddNewCompositeProfiles(compositeProfiles: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.addedObjectsDatabase != null) {
      return this.indexeddbService.addedObjectsDatabase.compositeProfiles.bulkPut(compositeProfiles);
    }
  }

  public removeCompositeProfile(compositeProfileNode: TocNode) {
    this.indexeddbService.removedObjectsDatabase.compositeProfiles.put(compositeProfileNode).then(() => {
      this.removeFromToc(compositeProfileNode);
    }, () => {
      console.log('Unable to remove node from TOC');
    });
  }

  private removeFromToc(compositeProfileNode: TocNode) {
    this.indexeddbService.tocDataBase.compositeProfiles.where('id').equals(compositeProfileNode.id).delete();
  }

  public addCompositeProfile(compositeProfileNode: TocNode) {
    this.indexeddbService.addedObjectsDatabase.compositeProfiles.put(compositeProfileNode).then(() => {}, () => {
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
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, async () => {
        const compositeProfiles = await this.indexeddbService.tocDataBase.compositeProfiles.toArray();
        resolve(compositeProfiles);
      });
    });
    return promise;
  }

  public getAllFromAdded(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      this.indexeddbService.addedObjectsDatabase.transaction('rw',
        this.indexeddbService.addedObjectsDatabase.compositeProfiles, async () => {
        const compositeProfiles = await this.indexeddbService.addedObjectsDatabase.compositeProfiles.toArray();
        resolve(compositeProfiles);
      });
    });
    return promise;
  }
}
