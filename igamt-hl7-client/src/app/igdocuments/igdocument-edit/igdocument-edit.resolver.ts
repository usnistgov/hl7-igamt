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

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  ig: any;
  segments:any[]=[];
  datatypes:any[]=[];
  profileComponents:any[]=[];

  conformanceProfiles:any[]=[];
  compositeProfiles: any[]=[];
  valueSets: any[]=[];

  constructor(private http: HttpClient,public indexedDbService: IndexedDbService,public saveService:TocDbService,public valuesetsTocService:ValuesetsTocService,public segmentsTocService:SegmentsTocService,public datatypesTocService :DatatypesTocService,public conformanceProfilesTocService:ConformanceProfilesTocService,public compositeProfilesTocService:CompositeProfilesTocService,public profileComponentsTocService:ProfileComponentsTocService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
    return new Promise(
      (resolve , reject) => {
        let igId = route.params["igId"];
        console.log("TEST");

        this.indexedDbService.getIgDocumentId().then(id => {
            this.http.get<any>("/api/igdocuments/" + igId + "/display").subscribe(x => {


              if(id!==igId) {

                this.initToc(igId,resolve,reject);

              } else {
                resolve(this.getMergedIg(x));


              }

            }





            );


          },error =>{
          this.initToc(igId,resolve,reject);
          }
        )

      })

  }


  parseToc(toc:any){


    for(let i =0 ; i<toc.length; i++){
      let node= toc[i];
      if(node.data.type=='PROFILE'){
        this.parseProfile(node);

      }

    }
  }

  parseProfile(profile:any) {
    for (let i = 0; i < profile.children.length; i++) {
      let node = profile.children[i];
      let converted= this.convertList(node.children);
      if (node.data.type == 'CONFORMANCEPROFILEREGISTRY'){
        this.conformanceProfiles =converted

      }
      else if (node.data.type == 'PROFILECOMPONENTSREGISTRY'){
        this.profileComponents =converted;
      }
      else if (node.data.type == 'COMPOSITEPROFILEREGISTRY'){
        this.compositeProfiles = converted;
      }
      else if (node.data.type == 'SEGMENTREGISTRY'){
        this.segments = converted;
      }
      else if (node.data.type == 'DATATYPEREGISTRY'){
        this.datatypes = converted;

      }
      else if (node.data.type == 'VALUESETREGISTRY'){
        this.valueSets =converted;
      }

    }


  }

  convertList(list : any[]){
    let ret : any[]=[];
      for (let i=0; i<list.length;i++ ){
        ret.push({id:list[i].id,treeNode:list[i]});
      }
    return ret;
  }


  getMergedIg(x:any){
    console.log("Appliying the db changes");
    console.log(x.toc);
    this.segments=[];
    this.datatypes=[];
    this.profileComponents=[];
    this.conformanceProfiles=[];
    this.compositeProfiles=[];
    this.valueSets=[];

    this.conformanceProfilesTocService.getAllFromAdded().then( cpsNodes =>{
        this.conformanceProfiles=cpsNodes;
        console.log(this.conformanceProfiles);

        this.profileComponentsTocService.getAllFromAdded().then( pcsNodes=>{
          this.profileComponents=pcsNodes;
          console.log(this.profileComponents);

          this.compositeProfilesTocService.getAllFromAdded().then(composites =>{

            this.compositeProfiles=composites;
            console.log(this.compositeProfiles);

            this.segmentsTocService.getAllFromAdded().then(segments =>{
              this.segments=segments;
              console.log(this.segments);

              this.datatypesTocService.getAllFromAdded().then(datatypes=>{

                this.datatypes=datatypes;
                console.log(this.datatypes);

                this.valuesetsTocService.getAllFromAdded().then(valueSets=>{
                  this.valueSets=valueSets;
                  console.log(this.valueSets);


                },error=>{
                })
              },error => {
              })
            },error=>{

            })

            },error=>{
            }

          )
        },error=>{

        })

    },error=>{

    });


    return x;
  }


  initToc(igId:any,resolve,reject){
    console.log(resolve);
    console.log(reject);



    this.http.get<any>("/api/igdocuments/" + igId + "/display").subscribe(x => {


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

  findNodeByType(children, type){
    return _.find(children, function(node) { return type == node.data.type;});

  }

  addNodes(children:any[], add:any[]){
    children = _.union(children,add);
  }

















}



