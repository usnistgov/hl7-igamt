import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import * as _ from 'lodash';
import {Types} from "../../common/constants/types";
import {IgDocumentInfo} from "../../service/indexed-db/ig-document-info-database";
import {TocService} from "./service/toc.service";
import {ErrorService} from "../../error/error.service";



@Injectable()
export class IgDocumentService {
  constructor(private http: HttpClient,public indexedDbService: IndexedDbService, private tocService:TocService, private error: ErrorService) {
  }

  public save(changedObjects): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('api/igdocuments/' + changedObjects.igDocumentId + '/save', changedObjects).subscribe(
        result => {
          console.log('IG Document successfully saved ' + result);
          resolve();
        },
        error => {
          reject();
        }
      );
    });
  }



  public getIg(igId){

    return new Promise(
      (resolve , reject) => {

        this.indexedDbService.getIgDocument().then(  x => {



            console.log("ID From DB");

            if(x.id!==igId) {

              // this.initToc(igId,resolve,reject);
              this.initIgDocument(igId, resolve);

            } else {
              this.tocService.metadata.next(x.metadata);

              // this.initToc(igId,resolve,reject);
              resolve(x);                //this.getMergedIg(igId, resolve,reject);
            }




          },error =>{
            this.initIgDocument(igId, resolve);

            // this.initToc(igId,resolve,reject);
          }
        )

      })



  };

  initIgDocument(igId:any,resolve){
    console.log("Calling Init")
    this.http.get("api/igdocuments/" + igId + "/display").toPromise().then(x => {
        // this.parseToc(x.toc);
        this.indexedDbService.initializeDatabase(igId).then(() => {

            let  ig = new IgDocumentInfo(igId);
            ig.metadata=x["metadata"];
            this.tocService.metadata.next(ig.metadata);
            ig.toc=x["toc"];
            this.indexedDbService.initIg(ig).then(
              () => {
                resolve(ig);
              }, error => {
                console.log("Could not add elements to client db");
              }
            );
          },
          (error) => {
            console.log("Could not load Ig : " + error);
          }
        );

      }, error=>{
          resolve();
          this.error.redirect("Could not load IG with id "+ igId);
      }

    );
  }









}
