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

  public addSegment(segment) {
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
}
