import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {IgErrorService} from "../ig-error/ig-error.service";
import {LoadingService} from "../service/loading.service";

@Injectable()
export class DatatypesService {
    constructor(private http: HttpClient, private  router:Router , private igErrorService:IgErrorService, private loadingService :LoadingService) {

    }

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

    public saveDatatypeMetadata(id, metadata): Promise<any> {
        return this.http.post('api/datatypes/' + id + '/metadata',metadata).toPromise();
    }

    public saveDatatypeStructure(id, structure): Promise<any> {
        return this.http.post('api/datatypes/' + id + '/structure',structure).toPromise();
    }

    public saveDatatypePreDef(id, preDef): Promise<any> {
        return this.http.post('api/datatypes/' + id + '/predef', preDef).toPromise();
    }

    public saveDatatypePostDef(id, postDef): Promise<any> {
        return this.http.post('api/datatypes/' + id + '/postdef', postDef).toPromise();
    }

    public saveDatatypeCrossReferences(id, crossReference): Promise<any> {
        return null;
    }

    public saveDatatypeConformanceStatements(id, conformanceStatements): Promise<any> {
        return this.http.post('api/datatypes/' + id + '/conformancestatement', conformanceStatements).toPromise();
    }
}
