/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import {ConformanceProfilesTocService} from "../../service/indexed-db/conformance-profiles/conformance-profiles-toc.service";
import {TocDbService} from "../../service/indexed-db/toc-db.service";
import {ValuesetsTocService} from "../../service/indexed-db/valuesets/valuesets-toc.service";
import {SegmentsTocService} from "../../service/indexed-db/segments/segments-toc.service";
import {DatatypesTocService} from "../../service/indexed-db/datatypes/datatypes-toc.service";
import {CompositeProfilesTocService} from "../../service/indexed-db/composite-profiles/composite-profiles-toc.service";
import {ProfileComponentsTocService} from "../../service/indexed-db/profile-components/profile-components-toc.service";
import * as _ from 'lodash';
import {Types} from "../../common/constants/types";
import {NamesAndPositionsService} from "./service/names-and-positions.service";
import {IgDocumentInfo} from "../../service/indexed-db/ig-document-info-database";

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  ig: any;
  segments:any[]=[];
  datatypes:any[]=[];
  profileComponents:any[]=[];

  conformanceProfiles:any[]=[];
  compositeProfiles: any[]=[];
  valueSets: any[]=[];


  constructor(private http: HttpClient,public indexedDbService: IndexedDbService,public saveService:TocDbService,public valuesetsTocService:ValuesetsTocService,public segmentsTocService:SegmentsTocService,public datatypesTocService :DatatypesTocService,public conformanceProfilesTocService:ConformanceProfilesTocService,public compositeProfilesTocService:CompositeProfilesTocService,public profileComponentsTocService:ProfileComponentsTocService, public namesAndPositionsService:NamesAndPositionsService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
    return new Promise(
      (resolve , reject) => {
        let igId = route.params["igId"];
        console.log("TEST");


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
        resolve(x);

      });
    })

  }


  getMergedIg(igId:any,resolve,reject){
    this.http.get<any>("api/igdocuments/" + igId + "/display").subscribe(x => {
      this.ig=x;
      console.log(this.ig.toc);
      this.segments = [];
      this.datatypes = [];
      this.profileComponents = [];
      this.conformanceProfiles = [];
      this.compositeProfiles = [];
      this.valueSets = [];

      this.conformanceProfilesTocService.getAllFromAdded().then(cpsNodes => {
        this.conformanceProfiles = cpsNodes;
        console.log(this.conformanceProfiles);
        if (this.conformanceProfiles.length > 0) {

          this.addNodesByType(this.ig.toc, Types.CONFORMANCEPROFILEREGISTRY, this.conformanceProfiles);
        }

        this.profileComponentsTocService.getAllFromAdded().then(pcsNodes => {
          this.profileComponents = pcsNodes;
          console.log(this.profileComponents);
          if (this.profileComponents.length > 0) {

            this.addNodesByType(this.ig.toc, Types.PROFILECOMPONENTREGISTRY, this.profileComponents);
          }

          this.compositeProfilesTocService.getAllFromAdded().then(composites => {

              this.compositeProfiles = composites;
              console.log(this.compositeProfiles);
              if (this.compositeProfiles.length > 0) {

                this.addNodesByType(this.ig.toc, Types.COMPOSITEPROFILEREGISTRY, this.compositeProfiles);
              }

              this.segmentsTocService.getAllFromAdded().then(segments => {
                this.segments = segments;
                console.log(this.segments);
                if (this.segments.length > 0) {

                  this.addNodesByType(this.ig.toc, Types.SEGMENTREGISTRY, this.segments);
                }

                this.datatypesTocService.getAllFromAdded().then(datatypes => {

                  this.datatypes = datatypes;
                  console.log(this.datatypes);
                  if (this.datatypes.length > 0) {

                    this.addNodesByType(this.ig.toc, Types.DATATYPEREGISTRY, this.datatypes);
                  }

                  this.valuesetsTocService.getAllFromAdded().then(valueSets => {

                    this.valueSets = valueSets;
                    if (this.valueSets.length > 0) {

                      this.addNodesByType(this.ig.toc, Types.VALUESETREGISTRY, this.valueSets);
                    }
                    console.log("resolving ig");
                    console.log(this.ig);
                    this.namesAndPositionsService.updateIgTocNames(this.ig,resolve,reject);
                    resolve(this.ig);
                  }, error => {
                  })
                }, error => {
                })
              }, error => {

              })

            }, error => {
            }
          )
        }, error => {

        })

      }, error => {

      });
    });

  }


  initToc(igId:any,resolve,reject){
    this.http.get<any>("api/igdocuments/" + igId + "/display").subscribe(x => {
              this.parseToc(x.toc);
                  this.indexedDbService.initializeDatabase(igId).then(() => {
                      this.saveService.bulkAddToc(this.valueSets, this.datatypes, this.segments, this.conformanceProfiles, this.profileComponents, this.compositeProfiles).then(
                        () => {
                          resolve(x);
                        }, (error) => {
                          console.log("Could not add elements to client db");
                          reject();
                        }
                      );
                    },
                    (error) => {
                      console.log("Could not load Ig : " + error);
                      reject();
                    }
                  );

              }

            );
  }

  initIgDocument(igId:any,resolve,reject){
    this.http.get<any>("api/igdocuments/" + igId + "/display").subscribe(x => {
        // this.parseToc(x.toc);
        this.indexedDbService.initializeDatabase(igId).then(() => {

            let  ig = new IgDocumentInfo(igId);
            ig.metadata=x["metadata"];
            ig.toc=x["toc"];
          this.indexedDbService.initIg(ig).then(
              () => {
                resolve(ig);
              }, (error) => {
                console.log("Could not add elements to client db");
                reject();
              }
            );
          },
          (error) => {
            console.log("Could not load Ig : " + error);
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
          console.log("adding"+type);
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



