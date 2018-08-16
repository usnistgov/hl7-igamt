/**
 * Created by ena3 on 10/26/17.
 */
import {Injectable}  from "@angular/core";
import {BehaviorSubject} from "rxjs";

import * as _ from 'lodash';
import {Types} from "../../../common/constants/types";
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";
import { UUID } from 'angular2-uuid';
import {TreeNode, TreeModel} from "angular-tree-component";
import {HttpClient} from "@angular/common/http";


@Injectable()
export  class TocService{

  activeNode :BehaviorSubject<any> =new BehaviorSubject(null);
  metadata :BehaviorSubject<any> =new BehaviorSubject(null);

  treeModel :TreeModel;
  libId:any;


  constructor(private dbService:IndexedDbService, private http:HttpClient){
  }
  setIgId(libId){

    this.libId=libId;
  };

  getIgId(){

    return this.libId;
  };


  setActiveNode(node){
    this.activeNode=node;
  }
  getActiveNode(){

    return  this.activeNode;
  }
  setTreeModel(treeModel){
    console.log("Setting tree model");
    return new Promise((resolve, reject)=> {
      this.treeModel=treeModel;
      this.dbService.getDataTypeLibrary().then(
        x => {
          x.toc = treeModel.nodes;
          this.saveNodes(x.id, x.toc,resolve, reject);
          this.dbService.updateIgToc(x.id, x.toc).then(saved => {
            this.treeModel.update();
            resolve(true);
          });
        });
    })
  };

  setTreeModelInDB(treeModel){
    console.log("Setting tree model");
    return new Promise((resolve, reject)=> {
      this.treeModel=treeModel;
      this.dbService.getDataTypeLibrary().then(
        x => {
          x.toc = treeModel.nodes;
          this.dbService.updateIgToc(x.id, x.toc).then(saved => {
            this.treeModel.update();
            resolve(true);
          });
        });
    })
  }




  initTreeModel(treeModel){
    console.log("init tree model");

    return new Promise((resolve, reject)=> {
      this.treeModel=treeModel;
      this.dbService.getDataTypeLibrary().then(
        x => {
          x.toc = treeModel.nodes;
          this.dbService.updateDatatypeLibraryToc(x.id, x.toc).then(saved => {
            resolve(true);
          });
        });
    })
  };




  setMetaData(metadata){
    return new Promise((resolve, reject)=> {
      this.dbService.getIgDocument().then(
        x => {
          x.metadata = metadata;

          this.dbService.updateDatatypeLibraryMetadata(x.id,metadata ).then(saved => {
            this.saveMetadata(x.id,x.metadata,resolve, reject);
            this.metadata.next(_.cloneDeep(metadata));
            resolve(true);
          });
        });
    })
  }

  getTreeModel(){
    return  this.treeModel;
  }



  findDirectChildByType(nodes, type){

    for(let i=0;i<nodes.length; i++){
      if(nodes[i].data.type==type){
        return nodes[i];
      }
    }
    return null;

  }
  addNodesByType(toAdd:any, toc:any,type ){
    var profile= this.findDirectChildByType(toc,Types.PROFILE);
    var registry = this.findDirectChildByType(profile.children,type);


    let union :any[]=_.union(registry.children,toAdd);
    union= _.sortBy(union, [function(node) { return node.data.label+node.data.ext; }]);

    for(let i=0 ; i<union.length; i++){
      union[i].data.position =i+1;
    }

    registry.children=union;




  }

  getNameUnicityIndicators(nodes,type){

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
      this.dbService.getDataTypeLibrary().then(
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
    return this.getNodesList(Types.DATATYPEREGISTRY) ;

  }
  getDataypeNamesList(){
    return new Promise((resolve, reject)=> {

      this.getNodesList(Types.DATATYPEREGISTRY).then( children =>{
          resolve(_.map(children, function (obj:any) {
            return obj.data.label+obj.data.ext;
          }))

        },
        error=>{
          resolve([]);
        });
    })
  }






  findRegistryByType(toc, type){

    var profile = _.find(toc, function(node) { return Types.PROFILE == node.data.type;});
    if(profile&&profile.children){




      if(type==Types.DATATYPEREGISTRY) {
        var registry = _.find(profile.children, function (node) {
          return type == node.data.type;
        });



        var derivedRegistry = _.find(profile.children, function (node) {
          return  node.data.type==Types.DERIVEDDATATYPEREGISTRY;
        });

        var children=[];
        if (registry != null ) {
          children= registry.children;
        }
        if (derivedRegistry != null ) {
          children= _.union(children,derivedRegistry.children);
        }
        return children;
      }


        else {
          return null;
        }
      }


  }


  cloneNode(treeNode: TreeNode){
    let newData=_.cloneDeep(treeNode.data);
    newData.id = UUID.UUID();
    if(newData.data.id){
      newData.id = UUID.UUID();

    }
    console.log(treeNode);

    newData.data.label=treeNode.data.label+"Copy";

    console.log(newData);
    if(treeNode.data.children && treeNode.data.children.length>0) {
      _.forEach(treeNode.data.children, function (child) {
        newData.children.push(this.cloneNode(child));

      })

    }
    treeNode.parent.data.children.push(newData);
    treeNode.parent.treeModel.update();
  };

  saveNodes(id,nodes,resolve, reject){
    this.http.post('/api/datatype-library/'+id+'/updatetoc',nodes).toPromise().then(result=>{
        resolve(result);
        console.log(result);

      },error=>{
        console.log(error);
        reject(error);

      }
    );

  }


  saveMetadata(id,metadata,resolve, reject){
    this.http.post('/api/datatype-library/'+id+'/updatemetadata',metadata).toPromise().then(result=>{
        resolve(result);
        console.log(result);

      },error=>{
        console.log(error);
        reject(error);

      }
    );

  }




  deleteNodeById(id){

    let node =this.treeModel.getNodeById(id);

    if(node){

      let parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
      _.remove(parentNode.data.children, function (child:any) {
        return child.id === id;
      });

      if (node.parent.data.children.length === 0) {
        node.parent.data.hasChildren = false;
      }
    }
  }












}
