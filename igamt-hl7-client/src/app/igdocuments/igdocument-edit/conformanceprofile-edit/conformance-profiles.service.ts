import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpParams} from "@angular/common/http";
import {TocService} from "../service/toc.service";

@Injectable()
export class ConformanceProfilesService {
    constructor(private http: HttpClient, private tocService:TocService) {
    }

    public getConformanceProfileMetadata(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/conformanceprofiles/' + id + '/metadata').toPromise().then(serverConformanceProfileMetadata => {
                resolve(serverConformanceProfileMetadata);
            }).catch(function (e) {

            });

        });
        return promise;

    }

    public getConformanceProfileStructure(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {

            this.http.get('api/conformanceprofiles/' + id + '/structure').toPromise().then(serverConformanceProfileStructure => {
                resolve(serverConformanceProfileStructure);

            }).catch(function (e) {

            });

        });
        return promise;
    }

    public getConformanceProfileCrossReference(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/conformanceprofiles/' + id + '/crossReference').toPromise().then(serverConformanceProfileCrossReference => {
                resolve(serverConformanceProfileCrossReference);
            }).catch(function (e) {

            });
        });
        return promise;
    }

    public getConformanceProfilePostDef(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {

            this.http.get('api/conformanceprofiles/' + id + '/postdef').toPromise().then(serverConformanceProfilePostDef => {
                resolve(serverConformanceProfilePostDef);
            }
            ).catch(function (e) {

            });
        });
        return promise;
    }

    public getConformanceProfilePreDef(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/conformanceprofiles/' + id + '/predef').toPromise().then(serverConformanceProfilePreDef => {
                resolve(serverConformanceProfilePreDef);
            }).catch(function (e) {

            });
        });
        return promise;
    }

    public getConformanceProfileConformanceStatements(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/conformanceprofiles/' + id + '/conformancestatement').toPromise().then(serverConformanceProfileConformanceStatement => {
                resolve(serverConformanceProfileConformanceStatement);
            }).catch(function (e) {

          });
        });
        return promise;
    }

    public saveConformanceProfileMetadata(id, metadata): Promise<any> {
        return this.http.post('api/conformanceprofiles/' + id + '/metadata',metadata).toPromise();
    }

    public saveConformanceProfilePreDef(id, preDef): Promise<any> {
        return this.http.post('api/conformanceprofiles/' + id + '/predef', preDef).toPromise();
    }

    public saveConformanceProfilePostDef(id, postDef): Promise<any> {
        return this.http.post('api/conformanceprofiles/' + id + '/postdef', postDef).toPromise();
    }

    public saveConformanceProfileCrossReferences(id, crossReference): Promise<any> {
        return null;
    }

    public saveConformanceProfileConformanceStatements(id, conformanceStatements): Promise<any> {
        return this.http.post('api/conformanceprofiles/' + id + '/conformancestatement', conformanceStatements).toPromise();
    }

    public save(id, cItem): Promise<any> {
      let igId= this.tocService.getIgId();

      let httpParams = new HttpParams().append("dId", igId);

      return  this.http.post('api/conformanceprofiles/' + id,cItem, {params:httpParams}).toPromise();
    }
}
