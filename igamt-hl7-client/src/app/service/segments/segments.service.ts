import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IObject} from '../indexed-db/objects-database';

@Injectable()
export class SegmentsService {
  constructor(private http: HttpClient) {
  }

  public getSegmentMetadata(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/segments/' + id + '/metadata').toPromise().then(serverSegmentMetadata => {
          resolve(serverSegmentMetadata);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getSegmentStructure(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/structure').toPromise().then(serverSegmentStructure => {
          resolve(serverSegmentStructure);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public getSegmentCrossReference(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/crossReference').toPromise().then(serverSegmentCrossReference => {
          resolve(serverSegmentCrossReference);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getSegmentPostDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/postdef').toPromise().then(serverSegmentPostDef => {
          resolve(serverSegmentPostDef);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getSegmentPreDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/predef').toPromise().then(serverSegmentPreDef => {
          resolve(serverSegmentPreDef);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public getSegmentConformanceStatements(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/conformancestatement').toPromise().then(serverSegmentConformanceStatement => {
          resolve(serverSegmentConformanceStatement);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public saveSegmentMetadata(id, metadata): Promise<any> {
    return null;
  }

  public saveSegmentStructure(id, structure): Promise<any> {
    return null;
  }

  public saveSegmentPreDef(id, preDef): Promise<any> {
    return null;
  }

  public saveSegmentPostDef(id, postDef): Promise<any> {
    return null;
  }

  public saveSegmentCrossReferences(id, crossReference): Promise<any> {
    return null;
  }

  public saveSegmentConformanceStatements(id, conformanceStatements): Promise<any> {
    return null;
  }

}
