import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {IgErrorService} from "../ig-error/ig-error.service";
import {LoadingService} from "../service/loading.service";
import {HttpParams} from "@angular/common/http";
import {TocService} from "../service/toc.service";

@Injectable()
export class DatatypesService {
    constructor(private http: HttpClient, private  router:Router , private igErrorService:IgErrorService, private loadingService :LoadingService, private tocService: TocService) {}

    public getDatatypeMetadata(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.loadingService.show();

            this.http.get('api/datatypes/' + id + '/metadata').toPromise().then(serverDatatypeMetadata => {
                resolve(serverDatatypeMetadata);
            }, error => {
                this.igErrorService.redirect(error);
            });
        });
        return promise;
    }

    public getDatatypeStructure(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/datatypes/' + id + '/structure').toPromise().then(serverDatatypeStructure => {
                resolve(serverDatatypeStructure);
            }, error => {
                console.log("Error");
                resolve(null);
                this.igErrorService.redirect(error);
            });
        });
        return promise;
    }

    public getDatatypeStructureByRef(id, idPath, path, viewScope) : Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/datatypes/' + id + '/' + idPath + '/' + path + '/' + viewScope +'/structure-by-ref').toPromise().then(serverDatatypeStructure => {
                resolve(serverDatatypeStructure);
            }, error => {
                console.log("Error");
                resolve(null);
                this.igErrorService.redirect(error);
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
                this.igErrorService.redirect(error);
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
            return this.http.get('api/datatypes/' + id + '/conformancestatement').toPromise().then(serverDatatypeConformanceStatement=>{
                resolve(serverDatatypeConformanceStatement);
            }, error => {
                this.igErrorService.showError(error);
            });
        });
        return promise;
    }

    public saveDatatypeCrossReferences(id, crossReference): Promise<any> {
        return null;
    }

    public save(id, cItem): Promise<any> {
      let igId= this.tocService.getIgId();
      let httpParams = new HttpParams().append("dId", igId);
        return  this.http.post('api/datatypes/'+ id,cItem, {params:httpParams}).toPromise();
    }
}
