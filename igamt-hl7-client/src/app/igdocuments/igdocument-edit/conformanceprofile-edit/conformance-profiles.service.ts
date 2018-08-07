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

            this.http.get('api/conformanceprofiles/' + id + '/postdef').toPromise().then(serverConformanceProfilePostDef => {
                resolve(serverConformanceProfilePostDef);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

    public getConformanceProfilePreDef(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {

            this.http.get('api/conformanceprofiles/' + id + '/predef').toPromise().then(serverConformanceProfilePreDef => {
                resolve(serverConformanceProfilePreDef);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

    public getConformanceProfileConformanceStatements(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {

            this.http.get('api/conformanceprofiles/' + id + '/conformancestatement').toPromise().then(serverConformanceProfileConformanceStatement => {
                resolve(serverConformanceProfileConformanceStatement);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

    public saveConformanceProfileMetadata(id, metadata): Promise<any> {
        return this.http.post('api/conformanceprofiles/' + id + '/metadata',metadata).toPromise();
    }

    public saveConformanceProfileStructure(id, structure): Promise<any> {
        return this.http.post('api/conformanceprofiles/' + id + '/structure',structure).toPromise();
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
}
