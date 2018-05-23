import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class DatatypesTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getDatatype(id, callback) {
    let datatype;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.datatypes, async () => {
        datatype = await this.indexeddbService.tocDataBase.datatypes.get(id);
        callback(datatype);
      });
    } else {
      callback(null);
    }
  }

  public saveDatatype(datatype) {
    console.log(datatype);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, async () => {
        const savedDatatype = await this.indexeddbService.tocDataBase.datatypes.get(datatype.id);
        this.doSave(datatype, savedDatatype);
      });
    }
  }

  private doSave(datatype, savedDatatype) {
    savedDatatype = IndexedDbUtils.populateIObject(datatype, savedDatatype);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, async () => {
        await this.indexeddbService.tocDataBase.datatypes.put(savedDatatype);
      });
    }
  }

  public bulkAdd(datatypes: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.tocDataBase != null) {
      return this.indexeddbService.tocDataBase.datatypes.bulkPut(datatypes);
    }
  }

  public removeDatatype(datatypeNode: TocNode) {
    this.indexeddbService.removedObjectsDatabase.datatypes.put(datatypeNode).then(() => {
      this.removeFromToc(datatypeNode);
    }, () => {
      console.log('Unable to remove node from TOC');
    });
  }

  private removeFromToc(datatypeNode: TocNode) {
    this.indexeddbService.tocDataBase.datatypes.where('id').equals(datatypeNode.id).delete();
  }

  private addDatatype(datatypeNode: TocNode) {
    this.indexeddbService.addedObjectsDatabase.datatypes.put(datatypeNode).then(() => {}, () => {
      console.log('Unable to add node from TOC');
    });
  }

  public bulkAddNewDatatypes(datatypes: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.addedObjectsDatabase != null) {
      return this.indexeddbService.addedObjectsDatabase.datatypes.bulkPut(datatypes);
    }
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
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, async () => {
        const datatypes = await this.indexeddbService.tocDataBase.datatypes.toArray();
        resolve(datatypes);
      });
    });
    return promise;
  }

  private getAllFromAdded(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      this.indexeddbService.addedObjectsDatabase.transaction('rw', this.indexeddbService.addedObjectsDatabase.datatypes, async () => {
        const datatypes = await this.indexeddbService.addedObjectsDatabase.datatypes.toArray();
        resolve(datatypes);
      });
    });
    return promise;
  }
}
