import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';

@Injectable()
export class SegmentsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {

  }


  public getSegment (id, callback) {
    let segment;
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async() => {
      segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
      callback(segment);
    });
  }

  public getSegmentMetadata (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
      const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        callback(segment.metadata);
      }
    });
  }

  public getSegmentDefinition (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
      const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        callback(segment.definition);
      }
    });
  }

  public getSegmentCrossReference (id, callback) {
    this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
      const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        callback(segment.crossReference);
      }
    });
  }

  public saveSegment(segment) {
    console.log(segment);
    this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.segments, async() => {
      const savedSegment = await this.indexeddbService.changedObjectsDatabase.segments.get(segment.id);
      this.doSave(segment, savedSegment);
    });
  }

  private doSave(segment, savedSegment) {
    savedSegment = IndexedDbUtils.populateIObject(savedSegment, segment);
    this.indexeddbService.changedObjectsDatabase.transaction('rw', this.indexeddbService.changedObjectsDatabase.segments, async() => {
      await this.indexeddbService.changedObjectsDatabase.segments.put(savedSegment);
    });
  }
}
