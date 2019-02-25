import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {IgErrorService} from "../ig-error/ig-error.service";
import {LoadingService} from "../service/loading.service";
import {HttpParams} from "@angular/common/http";
import {TocService} from "../service/toc.service";


@Injectable()
export class SegmentsService {
  constructor(private http: HttpClient , private igErrorService:IgErrorService, private loadingService :LoadingService, private  tocService:TocService) {
  }

  public getSegmentMetadata(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.loadingService.show();

        this.http.get('api/segments/' + id + '/metadata').toPromise().then(serverSegmentMetadata => {
          resolve(serverSegmentMetadata);
        }, error => {
          this.igErrorService.redirect(error);
        });
      });
    return promise;
  }

  public getSegmentStructure(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/structure').toPromise().then(serverSegmentStructure => {
          resolve(serverSegmentStructure);
        }, error => {
          console.log("Error");
          resolve(null);
          this.igErrorService.redirect(error);
        });
    });
    return promise;
  }

  public getSegmentCrossReference(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/crossReference').toPromise().then(serverSegmentCrossReference => {
          resolve(serverSegmentCrossReference);
        }, error => {
          this.igErrorService.redirect(error);
        });
      });
    return promise;
  }

  public getSegmentPostDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        this.http.get('api/segments/' + id + '/postdef').toPromise().then(serverSegmentPostDef => {
          resolve(serverSegmentPostDef);
        }, error => {
          this.igErrorService.redirect(error);
        });
      });
    return promise;
  }

  public getSegmentPreDef(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.http.get('api/segments/' + id + '/predef').toPromise().then(serverSegmentPostDef => {
        resolve(serverSegmentPostDef);
      }, error => {
        this.igErrorService.redirect(error);
      });
    });
    return promise;
  }

  public getSegmentConformanceStatements(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      let igId= this.tocService.getIgId();
      return this.http.get('api/segments/' + id + '/conformancestatement/' + igId).toPromise().then(serverSegmentConformancestatement=>{
        resolve(serverSegmentConformancestatement);
    }, error => {
      this.igErrorService.showError(error);
    });
  });
  return promise;
  }

  public getSegmentDynamicMapping(id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      return this.http.get('api/segments/' + id + '/dynamicmapping').toPromise().then(serverSegmentDynamicMapping=>{
        resolve(serverSegmentDynamicMapping);
      }, error => {
        this.igErrorService.showError(error);
      });
    });
    return promise;
  }

  public getSegmentStructureByRef(id, idPath, path) : Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.http.get('api/segments/' + id + '/' + idPath + '/' + path  +'/structure-by-ref').toPromise().then(serverSegmentStructure => {
        resolve(serverSegmentStructure);
      }, error => {
        console.log("Error");
        resolve(null);
        this.igErrorService.redirect(error);
      });
    });
    return promise;
  }

  public saveSegmentMetadata(id, metadata): Promise<any> {
      return this.http.post('api/segments/' + id + '/metadata',metadata).toPromise();
  }

  public saveSegmentStructure(id, structure): Promise<any> {
     return  this.http.post('api/segments/' + id + '/structure',structure).toPromise();
  }

  public saveSegmentPreDef(id, preDef): Promise<any> {
    let igId= this.tocService.getIgId();
    let httpParams = new HttpParams().append("dId", igId);
    return  this.http.post('api/segments/' + id + '/preDef',preDef, {params:httpParams}).toPromise();

  }

  public saveSegmentPostDef(id, postDef): Promise<any> {
    let igId= this.tocService.getIgId();
    let httpParams = new HttpParams().append("dId", igId);
    return  this.http.post('api/segments/' + id + '/postDef',postDef, {params:httpParams}).toPromise();
  }

  public saveSegmentDynamicMapping(id, dynamicmapping): Promise<any> {
    return this.http.post('api/segments/' + id + '/dynamicmapping', dynamicmapping).toPromise();
  }

  public saveSegmentCrossReferences(id, crossReference): Promise<any> {
    return null;
  }

  public save(id,cItem): Promise<any> {
    let igId= this.tocService.getIgId();
    let httpParams = new HttpParams().append("dId", igId);
    return  this.http.post('api/segments/' + id,cItem, {params:httpParams}).toPromise();
  }





}
