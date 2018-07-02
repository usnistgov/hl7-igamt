// import { Injectable } from '@angular/core';
// import {SegmentsIndexedDbService} from "../../../service/indexed-db/segments/segments-indexed-db.service";
// import {DatatypesIndexedDbService} from "../../../service/indexed-db/datatypes/datatypes-indexed-db.service";
// import {ValuesetsIndexedDbService} from "../../../service/indexed-db/valuesets/valuesets-indexed-db.service";
// import {SectionsIndexedDbService} from "../../../service/indexed-db/sections/sections-indexed-db.service";
// import {ConformanceProfilesIndexedDbService} from "../../../service/indexed-db/conformance-profiles/conformance-profiles-indexed-db.service";
// import {Types} from "../../../common/constants/types";
// import {Scopes} from "../../../common/constants/scopes";
// import * as _ from 'lodash';
//
// @Injectable()
// export class NamesAndPositionsService {
//
//   constructor(private segmentsIndexedDbService:SegmentsIndexedDbService,private datatypesIndexedDbService:DatatypesIndexedDbService,
//
//               private valueSetsIndexedDbService:ValuesetsIndexedDbService,
//               private sectionsIndexedDbService:SectionsIndexedDbService,
//               private conformanceProfilesIndexedDbService:ConformanceProfilesIndexedDbService) {
//   }
//
//   updateIgTocNames(ig, resolve,reject){
//     console.log("Merging profile");
//     this.updateProfile(ig, resolve,reject);
//   }
//
//   findNodeByType(children, type){
//
//     return _.find(children, function(node) { return type == node.data.type;});
//
//   }
//
//   updateProfile(igToc:any[], resolve, reject ){
//           this.mergeRegistries(igToc, resolve, reject);
//   }
//
//   mergeRegistries(ig, resolve ,reject){
//     var profile = this.findNodeByType(ig.toc, Types.PROFILE);
//
//     this.segmentsIndexedDbService.getAllMetaData().then(metadataList=>{
//         if(metadataList.length>0){
//           var registry =this.findNodeByType(profile.children ,Types.SEGMENTREGISTRY);
//           this.updateChildren(registry, metadataList);
//         }
//
//       this.datatypesIndexedDbService.getAllMetaData().then(metadataList=>{
//         if(metadataList.length>0){
//           var registry =this.findNodeByType(profile.children ,Types.SEGMENTREGISTRY);
//           this.updateChildren(registry, metadataList);
//         }
//         this.conformanceProfilesIndexedDbService.getAllMetaData().then(metadataList=>{
//           if(metadataList.length>0){
//             var registry =this.findNodeByType(profile.children ,Types.SEGMENTREGISTRY);
//             this.updateChildren(registry, metadataList);
//           }
//
//           this.valueSetsIndexedDbService.getAllMetaData().then(metadataList=>{
//             if(metadataList.length>0){
//               var registry =this.findNodeByType(profile.children ,Types.SEGMENTREGISTRY);
//               this.updateChildren(registry, metadataList);
//             }
//             resolve(ig);
//
//           }, error=>{
//           });
//         },error =>{
//         });
//       },error=>{
//       });
//     },error=>{
//     });
//   };
//
//   updateChildren(registry , metadataList){
//
//     _.forEach(metadataList, function(metadata){
//       let node=_.find(registry.children, function (node) {
//         return node.id==metadata.id;
//       });
//         if(node!=null){
//           node.data.ext=metadata.metadata.ext;
//           node.data.label=metadata.metadata.label;
//           node.data.description=metadata.metadata.description;
//         }
//     }
//     );
//
//   };
//
//   findNodeById(children, id){
//
//     return _.find(children, function(node) { return id == node.id});
//
//   }
//
//
//
//
//
//
// }
