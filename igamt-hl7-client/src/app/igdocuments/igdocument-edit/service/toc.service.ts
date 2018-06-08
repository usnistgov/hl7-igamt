/**
 * Created by ena3 on 10/26/17.
 */
import {Injectable}  from "@angular/core";
import {BehaviorSubject} from "rxjs";

import * as _ from 'lodash';
import {Types} from "../../../common/constants/types";
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";


@Injectable()
export  class TocService{

  activeNode :BehaviorSubject<any> =new BehaviorSubject(null);
  constructor(private dbService:IndexedDbService){
  }

  setActiveNode(node){
    this.activeNode.next(node);
  }
  getActiveNode(){

    return  this.activeNode;
  }

  findDirectChildByType(nodes, type){

    for(let i=0;i<nodes.length; i++){
      if(nodes[i].data.type==type){
        return nodes[i];
      }
    }
    return null;

  }
  addNodesByType(toAdd, toc,type ){
    var profile= this.findDirectChildByType(toc,Types.PROFILE);
    var registry = this.findDirectChildByType(profile.children,type);
    var position=registry.children.length+1;
    for(let i=0 ; i<toAdd.length; i++){
      toAdd[i].data.position =position;
      position++;
      registry.children.push(toAdd[i]);
    }


  }

  getNameUnicityIndicators(nodes,type){


    if(type==Types.SEGMENTREGISTRY){
      return this.getNameUnicityIndicatorsForSegment(nodes, type);
    }else if(type==Types.DATATYPEREGISTRY){
      return this.getNameUnicityIndicatorsForDatatype(nodes,type);
    }
  }

  getNameUnicityIndicatorsForSegment(nodes, type){
    var profile= this.findDirectChildByType(nodes,Types.PROFILE);
    var registry = this.findDirectChildByType(profile.children,type);
    return _.map(registry.children, function (obj) {
      return obj.data.label+obj.data.ext;

    });
  }


  getRegistryByType(nodes, type){
    var profile= this.findDirectChildByType(nodes,Types.PROFILE);
    if(profile !=null){
      return  this.findDirectChildByType(profile.children,type);

    }

  }

  getNameUnicityIndicatorsForDatatype(nodes, type){
    var profile= this.findDirectChildByType(nodes,Types.PROFILE);
    var registry = this.findDirectChildByType(profile.children,type);
    return _.map(registry.children, function (obj) {
      return obj.data.label+obj.data.ext;
    });

  }

  getNodesList(type){
    return new Promise((resolve, reject)=>{
    this.dbService.getIgDocument().then(
      x => {
        if(x.toc){
          resolve(this.findRegistryByType(x.toc,type));
        }else{
          console.log("Could not find the toc ")
        }
      },
      error=>{

        console.log("Could not find the toc ")

      }
    )
  })
  };

  getSegmentsList(){
    return this.getNodesList(Types.SEGMENTREGISTRY);

  }
  getDataypeList(){
    return this.getNodesList(Types.DATATYPEREGISTRY);

  }

  getValueSetList(){
    return this.getNodesList(Types.VALUESETREGISTRY);
  }

  getConformanceProfileList(){
    return this.getNodesList(Types.CONFORMANCEPROFILEREGISTRY);

  }

  getCurrentValueSetList(id){

  }


  findRegistryByType(toc, type){

    var profile = _.find(toc, function(node) { return Types.PROFILE == node.data.type;});
    if(profile&&profile.children){




    var registry=  _.find(profile.children, function(node) { return type == node.data.type;});

    if(registry !=null){
      return registry.children;
    }
    else{
      return null;
    }


  }else{

      return null;
    }
  }








}
