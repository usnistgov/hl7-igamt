import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ConformanceProfilesService {
  constructor(private http: HttpClient) {
  }

  public getConformanceProfileMetadata(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/conformanceprofiles/' + id + '/metadata').toPromise().then(serverConformanceProfileMetadata => {
          resolve(serverConformanceProfileMetadata);
        }, error => {
          reject(error);
        });

  });
    return promise;

  }

  public getConformanceProfileStructure(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/conformanceprofiles/' + id + '/structure').toPromise().then(serverConformanceProfileStructure => {
          resolve(serverConformanceProfileStructure);
        }, error => {
          reject(error);
        });

    });
    return promise;
  }

  public getConformanceProfileCrossReference(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/conformanceprofiles/' + id + '/crossReference').toPromise().then(serverConformanceProfileCrossReference => {
          resolve(serverConformanceProfileCrossReference);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getConformanceProfilePostDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/conformanceprofiles/' + id + '/postDef').toPromise().then(serverConformanceProfilePostDef => {
          resolve(serverConformanceProfilePostDef);
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  public getConformanceProfilePreDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/conformanceprofiles/' + id + '/preDef').toPromise().then(serverConformanceProfilePreDef => {
          resolve(serverConformanceProfilePreDef);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public getConformanceProfileConformanceStatements(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {

        this.http.get('api/conformanceprofiles/' + id + '/conformanceStatement').toPromise().then(serverConformanceProfileConformanceStatement => {
          resolve(serverConformanceProfileConformanceStatement);
        }, error => {
          reject(error);
        });
      });
    return promise;
  }

  public saveConformanceProfileMetadata(id, metadata): Promise<any> {
    return null;

  }

  public saveConformanceProfileStructure(id, structure): Promise<any> {
  return null;
  }

  public saveConformanceProfilePreDef(id, preDef): Promise<any> {
    return null;
  }

  public saveConformanceProfilePostDef(id, postDef): Promise<any> {

    return null;
  }

  public saveConformanceProfileCrossReferences(id, crossReference): Promise<any> {
  return null;
  }

  public saveConformanceProfileConformanceStatements(id, conformanceStatements): Promise<any> {
    return null;
  }

}
