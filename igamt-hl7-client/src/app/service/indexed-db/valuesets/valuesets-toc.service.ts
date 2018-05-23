import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class ValuesetsTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getValueset(id, callback) {
    let valueset;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.valuesets, async () => {
        valueset = await this.indexeddbService.tocDataBase.valuesets.get(id);
        callback(valueset);
      });
    } else {
      callback(null);
    }
  }

  public saveValueset(valueset) {
    console.log(valueset);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, async () => {
        const savedValueset = await this.indexeddbService.tocDataBase.valuesets.get(valueset.id);
        this.doSave(valueset, savedValueset);
      });
    }
  }

  private doSave(valueset, savedValueset) {
    savedValueset = IndexedDbUtils.populateIObject(valueset, savedValueset);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, async () => {
        await this.indexeddbService.tocDataBase.valuesets.put(savedValueset);
      });
    }
  }

  public bulkAdd(valuesets: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.tocDataBase != null) {
      return this.indexeddbService.tocDataBase.valuesets.bulkPut(valuesets);
    }
  }

  public bulkAddNewValuesets(valuesets: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.addedObjectsDatabase != null) {
      return this.indexeddbService.addedObjectsDatabase.valuesets.bulkPut(valuesets);
    }
  }

  public removeValueset(valuesetNode: TocNode) {
    this.indexeddbService.removedObjectsDatabase.valuesets.put(valuesetNode).then(() => {
      this.removeFromToc(valuesetNode);
    }, () => {
      console.log('Unable to remove node from TOC');
    });
  }

  private removeFromToc(valuesetNode: TocNode) {
    this.indexeddbService.tocDataBase.valuesets.where('id').equals(valuesetNode.id).delete();
  }

  public addValueset(valuesetNode: TocNode) {
    this.indexeddbService.addedObjectsDatabase.valuesets.put(valuesetNode).then(() => {}, () => {
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
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, async () => {
        const valuesets = await this.indexeddbService.tocDataBase.valuesets.toArray();
        resolve(valuesets);
      });
    });
    return promise;
  }

  private getAllFromAdded(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      this.indexeddbService.addedObjectsDatabase.transaction('rw', this.indexeddbService.addedObjectsDatabase.valuesets, async () => {
        const valuesets = await this.indexeddbService.addedObjectsDatabase.valuesets.toArray();
        resolve(valuesets);
      });
    });
    return promise;
  }
}
