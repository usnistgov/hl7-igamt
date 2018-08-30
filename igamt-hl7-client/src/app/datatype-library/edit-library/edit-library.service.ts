import { Injectable } from '@angular/core';
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import {HttpClient} from "@angular/common/http";
import {ErrorService} from "../../error/error.service";
import {DatatypeLibraryInfo} from "../../service/indexed-db/ig-document-info-database";
import {TocService} from "./service/toc.service";

@Injectable()
export class EditLibraryService {

  constructor(private http: HttpClient,public indexedDbService: IndexedDbService, private tocService:TocService, private error: ErrorService) {
  }




  public getLib(libId){

    return new Promise(
      (resolve , reject) => {

        this.indexedDbService.getDataTypeLibrary().then(  x => {



            console.log("ID From DB");

            if(x.id!==libId) {

              this.initDatatypeLibrary(libId, resolve);

            } else {
              this.tocService.metadata.next(x.metadata);
              this.tocService.treeModel.nodes=x.toc;

              resolve(x);                //this.getMergedIg(igId, resolve,reject);
            }
          },error =>{
            this.initDatatypeLibrary(libId, resolve);
          }
        )

      })

  };

  initDatatypeLibrary(libId:any,resolve){
    console.log("Calling Init")
    this.http.get("api/datatype-library/" + libId + "/display").toPromise().then(x => {
        // this.parseToc(x.toc);
        this.indexedDbService.initializeDatatypeLibraryDatabase(libId).then(() => {

            let  lib = new DatatypeLibraryInfo(libId);
            lib.metadata=x["metadata"];
            this.tocService.metadata.next(lib.metadata);

            lib.toc=x["toc"];
            this.tocService.treeModel.nodes=lib.toc;
            this.indexedDbService.initDatatypeLibrary(lib).then(
              () => {
                resolve(lib);
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
        this.error.redirect("Could not load IG with id "+ libId)
      }

    );
  };









}
