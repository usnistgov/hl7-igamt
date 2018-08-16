import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IgErrorService} from "../ig-error/ig-error.service";
import {LoadingService} from "../service/loading.service";

@Injectable()
export class ValuesetsService {
    constructor(private http: HttpClient, private igErrorService:IgErrorService, private loadingService :LoadingService) {
    }

    public getValuesetMetadata(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.loadingService.show();

            this.http.get('api/valuesets/' + id + '/metadata').toPromise().then(serverValuesetMetadata => {
                resolve(serverValuesetMetadata);
            }, error => {
                this.igErrorService.redirect(error);
            });
        });
        return promise;
    }

    public getValuesetStructure(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/valuesets/' + id + '/structure').toPromise().then(serverValuesetStructure => {
                resolve(serverValuesetStructure);
            }, error => {
                console.log("Error");
                resolve(null);
                this.igErrorService.redirect(error);
            });
        });
        return promise;
    }

    public getValuesetCrossReference(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/valuesets/' + id + '/crossReference').toPromise().then(serverValuesetCrossReference => {
                resolve(serverValuesetCrossReference);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }


    public getValuesetPostDef(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/valuesets/' + id + '/postdef').toPromise().then(serverValuesetPostDef => {
                resolve(serverValuesetPostDef);
            }, error => {
                this.igErrorService.redirect(error);
            });
        });
        return promise;
    }


  public getValueSetCodes(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.http.get('api/valuesets/' + id + '/codes').toPromise().then(codes => {
        resolve(codes);
      }, error => {
        this.igErrorService.redirect(error);
      });
    });
    return promise;
  }


  public getValuesetPreDef(id): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/valuesets/' + id + '/predef').toPromise().then(serverValuesetPreDef => {
                resolve(serverValuesetPreDef);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

    public saveValuesetMetadata(id, metadata): Promise<any> {
        return this.http.post('api/valuesets/' + id + '/metadata',metadata).toPromise();
    }

    public saveValuesetStructure(id, structure): Promise<any> {
        return this.http.post('api/valuesets/' + id + '/structure',structure).toPromise();
    }

    public saveValuesetPreDef(id, preDef): Promise<any> {
        return this.http.post('api/valuesets/' + id + '/predef', preDef).toPromise();
    }

    public saveValuesetPostDef(id, postDef): Promise<any> {
        return this.http.post('api/valuesets/' + id + '/postdef', postDef).toPromise();
    }

    public saveValuesetCrossReferences(id, crossReference): Promise<any> {
        return null;
    }
}
