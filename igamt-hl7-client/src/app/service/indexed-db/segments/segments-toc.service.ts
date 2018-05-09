import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {IObject} from '../objects-database';

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

  public getSegmentMetadata(id, callback) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.segments, async () => {
        const segment = await this.indexeddbService.tocDataBase.segments.get(id);
        if (segment != null) {
          callback(segment.metadata);
        }
      });
    } else {
      callback(null);
    }
  }

  public getSegmentStructure(id, callback) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.segments, async () => {
        const segment = await this.indexeddbService.tocDataBase.segments.get(id);
        if (segment != null && segment.structure != null) {
          callback(segment.structure);
        } else {
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  }

  public getSegmentPreDef(id, callback) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.segments, async () => {
        const segment = await this.indexeddbService.tocDataBase.segments.get(id);
        if (segment != null) {
          callback(segment.preDef);
        }
      });
    } else {
      callback(null);
    }
  }
  public getSegmentPostDef(id, callback) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.segments, async () => {
        const segment = await this.indexeddbService.tocDataBase.segments.get(id);
        if (segment != null) {
          callback(segment.postDef);
        }
      });
    } else {
      callback(null);
    }
  }

  public getSegmentCrossReference(id, callback) {
    if (this.indexeddbService.tocDataBase != null) {

      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.segments, async () => {
        const segment = await this.indexeddbService.tocDataBase.segments.get(id);
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

  public bulkAdd(segments: Array<IObject>) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.segments, async () => {
        await this.indexeddbService.tocDataBase.segments.bulkPut(segments);
      });
    }
  }
}
