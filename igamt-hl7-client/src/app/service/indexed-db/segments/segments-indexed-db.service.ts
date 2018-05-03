import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';

@Injectable()
export class SegmentsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {

  }


  public getSegment(id, callback) {
    let segment;
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
        callback(segment);
      });
    } else {
      callback(null);
    }
  }

  public getSegmentMetadata(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
        if (segment != null) {
          callback(segment.metadata);
        }
      });
    } else {
      callback(null);
    }
  }

  public getSegmentDefinition(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
        if (segment != null) {
          callback(segment.definition);
        }
      });
    } else {
      callback(null);
    }
  }

  public getSegmentCrossReference(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {

      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
        if (segment != null) {
          callback(segment.crossReference);
        }
      });
    } else {
      callback(null);
    }
  }

  public saveSegment(segment) {
    console.log(segment);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        const savedSegment = await this.indexeddbService.changedObjectsDatabase.segments.get(segment.id);
        this.doSave(segment, savedSegment);
      });
    }
  }

  private doSave(segment, savedSegment) {
    savedSegment = IndexedDbUtils.populateIObject(segment, savedSegment);
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        await this.indexeddbService.changedObjectsDatabase.segments.put(savedSegment);
      });
    }
  }
}
