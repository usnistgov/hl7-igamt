import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SegmentsIndexedDbService} from '../indexed-db/segments/segments-indexed-db.service';
import {IObject} from '../indexed-db/objects-database';

@Injectable()
export class SegmentsService {
  constructor(private http: HttpClient, private segmentsIndexedDbService: SegmentsIndexedDbService) {
  }

  public getSegmentMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.segmentsIndexedDbService.getSegmentMetadata(id).then((metadata) => {
        resolve(metadata);
      }).catch(() => {
        this.http.get('api/segments/' + id + '/metadata').subscribe(serverSegmentMetadata => {
          resolve(serverSegmentMetadata);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getSegmentStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.segmentsIndexedDbService.getSegmentStructure(id).then((structure) => {
        resolve(structure);
      }).catch(() => {
        this.http.get('api/segments/' + id + '/structure').subscribe(serverSegmentStructure => {
          resolve(serverSegmentStructure);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getSegmentCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.segmentsIndexedDbService.getSegmentCrossReference(id).then((crossReference) => {
        resolve(crossReference);
      }).catch(() => {
        this.http.get('api/segments/' + id + '/crossReference').subscribe(serverSegmentCrossReference => {
          resolve(serverSegmentCrossReference);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getSegmentPostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.segmentsIndexedDbService.getSegmentPostDef(id).then((postDef) => {
        resolve(postDef);
      }).catch(() => {
        this.http.get('api/segments/' + id + '/postDef').subscribe(serverSegmentPostDef => {
          resolve(serverSegmentPostDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getSegmentPreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.segmentsIndexedDbService.getSegmentPreDef(id).then((preDef) => {
        resolve(preDef);
      }).catch(() => {
        this.http.get('api/segments/' + id + '/preDef').subscribe(serverSegmentPreDef => {
          resolve(serverSegmentPreDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getSegmentConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.segmentsIndexedDbService.getSegmentConformanceStatements(id).then((conformanceStatement) => {
        resolve(conformanceStatement);
      }).catch(() => {
        this.http.get('api/segments/' + id + '/conformanceStatement').subscribe(serverSegmentConformanceStatement => {
          resolve(serverSegmentConformanceStatement);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public saveSegmentMetadata(id, metadata): Promise<any> {
    const segment = new IObject();
    segment.id = id;
    segment.metadata = metadata;
    return this.segmentsIndexedDbService.saveSegment(segment);
  }

  public saveSegmentStructure(id, structure): Promise<any> {
    const segment = new IObject();
    segment.id = id;
    segment.structure = structure;
    return this.segmentsIndexedDbService.saveSegment(segment);
  }

  public saveSegmentPreDef(id, preDef): Promise<any> {
    const segment = new IObject();
    segment.id = id;
    segment.preDef = preDef;
    return this.segmentsIndexedDbService.saveSegment(segment);
  }

  public saveSegmentPostDef(id, postDef): Promise<any> {
    const segment = new IObject();
    segment.id = id;
    segment.postDef = postDef;
    return this.segmentsIndexedDbService.saveSegment(segment);
  }

  public saveSegmentCrossReferences(id, crossReference): Promise<any> {
    const segment = new IObject();
    segment.id = id;
    segment.crossReference = crossReference;
    return this.segmentsIndexedDbService.saveSegment(segment);
  }

  public saveSegmentConformanceStatements(id, conformanceStatements): Promise<any> {
    const segment = new IObject();
    segment.id = id;
    segment.conformanceStatements = conformanceStatements;
    return this.segmentsIndexedDbService.saveSegment(segment);
  }

}
