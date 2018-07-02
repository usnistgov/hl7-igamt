/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import * as _ from 'lodash';
import {Types} from "../../common/constants/types";
import {IgDocumentInfo} from "../../service/indexed-db/ig-document-info-database";
import {TocService} from "./service/toc.service";

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  ig: any;
  segments:any[]=[];
  datatypes:any[]=[];
  profileComponents:any[]=[];

  conformanceProfiles:any[]=[];
  compositeProfiles: any[]=[];
  valueSets: any[]=[];


  constructor(private http: HttpClient,public indexedDbService: IndexedDbService, private tocService:TocService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
    return new Promise(
      (resolve , reject) => {
        let igId = route.params["igId"];
        //console.log("TEST");


        this.indexedDbService.getIgDocumentId().then(id => {

              if(id!==igId) {

               // this.initToc(igId,resolve,reject);
                this.initIgDocument(igId, resolve,reject);

              } else {
                this.getFromClientDb(igId, resolve,reject);
                //this.getMergedIg(igId, resolve,reject);
              }




          },error =>{
          this.initIgDocument(igId, resolve,reject);

         // this.initToc(igId,resolve,reject);
          }
        )

      })

  }


  parseToc(toc:any){


    for(let i =0 ; i<toc.length; i++){
      let node= toc[i];
      if(node.data.type==Types.PROFILE){
        this.parseProfile(node);

      }

    }
  }

  parseProfile(profile:any) {
    for (let i = 0; i < profile.children.length; i++) {
      let node = profile.children[i];
      let converted= this.convertList(node.children);
      if (node.data.type == Types.CONFORMANCEPROFILEREGISTRY){
        this.conformanceProfiles =converted

      }
      else if (node.data.type == Types.PROFILECOMPONENTREGISTRY){
        this.profileComponents =converted;
      }
      else if (node.data.type == Types.COMPOSITEPROFILEREGISTRY){
        this.compositeProfiles = converted;
      }
      else if (node.data.type == Types.SEGMENTREGISTRY){
        this.segments = converted;
      }
      else if (node.data.type == Types.DATATYPEREGISTRY){
        this.datatypes = converted;

      }
      else if (node.data.type == Types.VALUESETREGISTRY){
        this.valueSets =converted;
      }

    }


  }

  convertList(list : any[]){
    let ret : any[]=[];
      for (let i=0; i<list.length;i++ ){
        ret.push(list[i]);
      }
    return ret;
  }

  getFromClientDb(igId:any,resolve,reject){
    this.http.get<any>("api/igdocuments/" + igId + "/display").subscribe(x => {
      this.ig = x;

      this.indexedDbService.getIgDocument().then(x=>{
        this.tocService.metadata.next(x.metadata);
        resolve(x);

      });
    })

  };


  initIgDocument(igId:any,resolve,reject){
    this.http.get<any>("api/igdocuments/" + igId + "/display").subscribe(x => {
        // this.parseToc(x.toc);
        this.indexedDbService.initializeDatabase(igId).then(() => {

            let  ig = new IgDocumentInfo(igId);
            ig.metadata=x["metadata"];
            this.tocService.metadata.next(ig.metadata);


            ig.toc=x["toc"];
          this.indexedDbService.initIg(ig).then(
              () => {
                resolve(ig);
              }, (error) => {
                //console.log("Could not add elements to client db");
                reject();
              }
            );
          },
          (error) => {
            //console.log("Could not load Ig : " + error);
            reject();
          }
        );

      }

    );
  }








  findNodeByType(children, type){
    return _.find(children, function(node) { return type == node.data.type;});

  }

  addNodesByType(tocChildren, type,added){
    let profile=this.findNodeByType(tocChildren, Types.PROFILE);
    if(profile !=null){
      if(profile.children&& profile.children.length>0){
        let registry =this.findNodeByType(profile.children, type);
        if(registry && registry.children && registry.children.length>0){
          //console.log("adding"+type);
          registry.children = _.union(registry.children,added);
          registry.children = _.sortBy(registry.children,[function (node) {
            return node.data.label;

          }
          ]);
        }
      }
    }

  };





}



