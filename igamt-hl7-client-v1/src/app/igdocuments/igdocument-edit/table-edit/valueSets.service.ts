import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ValuesetsService {
  constructor(private http: HttpClient) {
  }

  public getValuesetMetadata(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/valuesets/' + id + '/metadata').subscribe(serverValuesetMetadata => {
          resolve(serverValuesetMetadata);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getValuesetStructure(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/valuesets/' + id + '/structure').subscribe(serverValuesetStructure => {
          resolve(serverValuesetStructure);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getValuesetCrossReference(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/valuesets/' + id + '/crossReference').subscribe(serverValuesetCrossReference => {
          resolve(serverValuesetCrossReference);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public getValuesetPostDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/valuesets/' + id + '/postdef').subscribe(serverValuesetPostDef => {
          resolve(serverValuesetPostDef);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getValuesetPreDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/valuesets/' + id + '/predef').subscribe(serverValuesetPreDef => {
          resolve(serverValuesetPreDef);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getValuesetConformanceStatements(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/valuesets/' + id + '/conformanceStatement').subscribe(serverValuesetConformanceStatement => {
          resolve(serverValuesetConformanceStatement);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public saveValuesetMetadata(id, metadata): Promise<any> {
   return null;
  }

  public saveValuesetStructure(id, structure): Promise<any> {
    return null;
  }

  public saveValuesetPreDef(id, preDef): Promise<any> {
    return null;
  }

  public saveValuesetPostDef(id, postDef): Promise<any> {

    return null;
  }

  public saveValuesetCrossReferences(id, crossReference): Promise<any> {

    return null;
  }

  public saveValuesetConformanceStatements(id, conformanceStatements): Promise<any> {

    return null;
  }

}
