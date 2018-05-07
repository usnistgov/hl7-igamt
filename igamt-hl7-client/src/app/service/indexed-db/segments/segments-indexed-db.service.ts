import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {Node} from '../node-database';

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

  public getSegmentStructure(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
        if (segment != null) {
          callback(segment.structure);
        } else {
          this.getSegmentStructureFromNodeDatabase(id, callback);
        }
      });
    } else {
      callback(null);
    }
  }

  private getSegmentStructureFromNodeDatabase(id, callback) {
    if (this.indexeddbService.nodeDatabase != null) {
      this.indexeddbService.nodeDatabase.transaction('r', this.indexeddbService.nodeDatabase.segments, async () => {
        const segmentStructure = await this.indexeddbService.nodeDatabase.segments.get(id);
        if (segmentStructure != null) {
          callback(segmentStructure.structure);
        }else {
            callback(null);
        }
      });
    } else {
      callback(null);
    }
  }

  public getSegmentPreDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
        if (segment != null) {
          callback(segment.preDef);
        }
      });
    } else {
      callback(null);
    }
  }
  public getSegmentPostDef(id, callback) {
    if (this.indexeddbService.changedObjectsDatabase != null) {
      this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
        const segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
        if (segment != null) {
          callback(segment.postDef);
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

  public saveSegmentStructureToNodeDatabase(id, segmentStructure) {
    if (this.indexeddbService.nodeDatabase != null) {
      this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.segments, async () => {
        const segmentNode = new Node();
        segmentNode.id = id;
        segmentNode.structure = segmentStructure;
        await this.indexeddbService.nodeDatabase.segments.put(segmentNode);
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
