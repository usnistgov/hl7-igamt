import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class ProfileComponentsTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getProfileComponent(id, callback) {
    let profileComponent;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.profileComponents, async () => {
        profileComponent = await this.indexeddbService.tocDataBase.profileComponents.get(id);
        callback(profileComponent);
      });
    } else {
      callback(null);
    }
  }

  public saveProfileComponent(profileComponent) {
    console.log(profileComponent);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, async () => {
        const savedProfileComponent = await this.indexeddbService.tocDataBase.profileComponents.get(profileComponent.id);
        this.doSave(profileComponent, savedProfileComponent);
      });
    }
  }

  private doSave(profileComponent, savedProfileComponent) {
    savedProfileComponent = IndexedDbUtils.populateIObject(profileComponent, savedProfileComponent);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, async () => {
        await this.indexeddbService.tocDataBase.profileComponents.put(savedProfileComponent);
      });
    }
  }

  public bulkAdd(profileComponents: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.tocDataBase != null) {
      return this.indexeddbService.tocDataBase.profileComponents.bulkPut(profileComponents);
    }
  }

  public bulkAddNewProfileComponents(profileComponents: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.addedObjectsDatabase != null) {
      return this.indexeddbService.addedObjectsDatabase.profileComponents.bulkPut(profileComponents);
    }
  }

  public removeProfileComponent(profileComponentNode: TocNode) {
    this.indexeddbService.removedObjectsDatabase.profileComponents.put(profileComponentNode).then(() => {
      this.removeFromToc(profileComponentNode);
    }, () => {
      console.log('Unable to remove node from TOC');
    });
  }

  private removeFromToc(profileComponentNode: TocNode) {
    this.indexeddbService.tocDataBase.profileComponents.where('id').equals(profileComponentNode.id).delete();
  }

  public addProfileComponent(profileComponentNode: TocNode) {
    this.indexeddbService.addedObjectsDatabase.profileComponents.put(profileComponentNode).then(() => {}, () => {
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
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, async () => {
        const profileComponents = await this.indexeddbService.tocDataBase.profileComponents.toArray();
        resolve(profileComponents);
      });
    });
    return promise;
  }

  public getAllFromAdded(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      this.indexeddbService.addedObjectsDatabase.transaction('rw',
        this.indexeddbService.addedObjectsDatabase.profileComponents, async () => {
        const profileComponents = await this.indexeddbService.addedObjectsDatabase.profileComponents.toArray();
        resolve(profileComponents);
      });
    });
    return promise;
  }
}
