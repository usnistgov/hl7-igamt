import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {Node} from '../node-database';
import {IObject} from '../objects-database';

@Injectable()
export class SegmentsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {
  }

  public getSegment(id): Promise<IObject> {
    let segment;
    const promise = new Promise<IObject>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.segments, async () => {
          segment = await this.indexeddbService.changedObjectsDatabase.segments.get(id);
          resolve(segment);
        });
      } else {
        reject();
      }
    });
    return promise;
  }

  public getSegmentMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getSegment(id).then((segment) => {
        if(segment.metadata) resolve(segment.metadata);
        else reject();
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getMetadataByListOfIds(ids:any[]): Promise<object> {
    const promises=[];
    for(let i=0;i<ids.length;i++){
      promises.push(this.getSegmentMetadata(ids[i]));

    }

    return Promise.all(promises);

  }

  public getSegmentStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getSegment(id).then((segment) => {
        if(segment.structure) resolve(segment.structure);
        else reject();
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getSegmentCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getSegment(id).then((segment) => {
        if(segment.crossReference) resolve(segment.crossReference);
        else reject();
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getSegmentPostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getSegment(id).then((segment) => {
        if(segment.postDef) resolve(segment.postDef);
        else reject();
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getSegmentPreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getSegment(id).then((segment) => {
        if(segment.preDef) resolve(segment.preDef);
        else reject();
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public getSegmentConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.getSegment(id).then((segment) => {
        if(segment.conformanceStatements) resolve(segment.conformanceStatements);
        else reject();
      }).catch(() => {
        reject();
      });
    });
    return promise;
  }

  public saveSegment(segment): Promise<any> {
    const promise = new Promise<IObject>((resolve, reject) => {
      this.getSegment(segment.id).then(existingSegment => {
        console.log("existing segment");
        this.doSave(segment, existingSegment).then(()=>{resolve()}).catch(error=>{reject("")});
      }).catch(error => {
        this.indexeddbService.changedObjectsDatabase.segments.put(segment).then(() => {
          resolve();
        }).catch(error=>{
          reject("")
        })
      });
    });
    return promise;
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

  private doSave(segment, savedSegment): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      savedSegment = IndexedDbUtils.populateIObject(segment, savedSegment);
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.segments.put(savedSegment).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        reject();
      }
    });
    return promise;
  }
}
