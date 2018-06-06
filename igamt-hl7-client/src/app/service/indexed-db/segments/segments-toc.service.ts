import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class SegmentsTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getSegment(id, callback) {
    let segment;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.segments, async () => {
        segment = await this.indexeddbService.tocDataBase.segments.get(id);
        callback(segment);
      });
    } else {
      callback(null);
    }
  }

  public saveSegment(segment) {
    console.log(segment);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.segments, async () => {
        const savedSegment = await this.indexeddbService.tocDataBase.segments.get(segment.id);
        this.doSave(segment, savedSegment);
      });
    }
  }

  private doSave(segment, savedSegment) {
    savedSegment = IndexedDbUtils.populateIObject(segment, savedSegment);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.segments, async () => {
        await this.indexeddbService.tocDataBase.segments.put(savedSegment);
      });
    }
  }

  public bulkAdd(segments: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.tocDataBase != null) {
      return this.indexeddbService.tocDataBase.segments.bulkPut(segments);
    }
  }

  public bulkAddNewSegments(segments: Array<TocNode>): Promise<any> {
    if (this.indexeddbService.addedObjectsDatabase != null) {
      return this.indexeddbService.addedObjectsDatabase.segments.bulkPut(segments);
    }
  }

  public removeSegment(segmentNode: TocNode) {
    this.indexeddbService.removedObjectsDatabase.segments.put(segmentNode).then(() => {
      this.removeFromToc(segmentNode);
    }, () => {
      console.log('Unable to remove node from TOC');
    });
  }

  private removeFromToc(segmentNode: TocNode) {
    this.indexeddbService.tocDataBase.segments.where('id').equals(segmentNode.id).delete();
  }

  public addSegment(segmentNode: TocNode) {
    this.indexeddbService.addedObjectsDatabase.segments.put(segmentNode).then(() => {}, () => {
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
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.segments, async () => {
        const segments = await this.indexeddbService.tocDataBase.segments.toArray();
        resolve(segments);
      });
    });
    return promise;
  }

  public getAllFromAdded(): Promise<Array<TocNode>> {
    const promise = new Promise<Array<TocNode>>((resolve, reject) => {
      this.indexeddbService.addedObjectsDatabase.transaction('rw', this.indexeddbService.addedObjectsDatabase.segments, async () => {
        const segments = await this.indexeddbService.addedObjectsDatabase.segments.toArray();
        resolve(segments);
      });
    });
    return promise;
  }
}
