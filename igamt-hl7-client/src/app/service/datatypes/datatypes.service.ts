import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DatatypesService {
  constructor(private http: HttpClient) {
  }

  public getDatatypeMetadata(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/datatypes/' + id + '/metadata').toPromise().then(serverDatatypeMetadata => {
          resolve(serverDatatypeMetadata);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getDatatypeStructure(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/datatypes/' + id + '/structure').toPromise().then(serverDatatypeStructure => {
          resolve(serverDatatypeStructure);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getDatatypeCrossReference(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/datatypes/' + id + '/crossReference').toPromise().then(serverDatatypeCrossReference => {
          resolve(serverDatatypeCrossReference);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public getDatatypePostDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/datatypes/' + id + '/postdef').toPromise().then(serverDatatypePostDef => {
          resolve(serverDatatypePostDef);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public getDatatypePreDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/datatypes/' + id + '/predef').toPromise().then(serverDatatypePreDef => {
          resolve(serverDatatypePreDef);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public getDatatypeConformanceStatements(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/datatypes/' + id + '/conformancestatement').toPromise().then(serverDatatypeConformanceStatement => {
          resolve(serverDatatypeConformanceStatement);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public saveDatatypeMetadata(id, metadata): Promise<any> {
  return null;
  }

  public saveDatatypeStructure(id, structure): Promise<any> {
   return null;
  }

  public saveDatatypePreDef(id, preDef): Promise<any> {
  return null;
  }

  public saveDatatypePostDef(id, postDef): Promise<any> {
  return null;
  }

  public saveDatatypeCrossReferences(id, crossReference): Promise<any> {
  return null;
  }

  public saveDatatypeConformanceStatements(id, conformanceStatements): Promise<any> {
  return null;
  }

}
