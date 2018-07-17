import {Component, Input} from '@angular/core';

import {SelectItem} from "primeng/components/common/selectitem";


import {ViewChildren, ViewChild} from "@angular/core";
import {TocService} from "./service/toc.service";
import {TreeModel, TreeNode, IActionHandler, TREE_ACTIONS, TreeComponent} from "angular-tree-component";

import {MenuItem} from 'primeng/api';
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {AddConformanceProfileComponent} from "../add-conformance-profile/add-conformance-profile.component";
import {AddSegmentComponent} from "./add-segment/add-segment.component";
import {AddDatatypeComponent} from "./add-datatype/add-datatype.component";
import {AddValueSetComponent} from "./add-value-set/add-value-set.component";
import {CopyElementComponent} from "./copy-element/copy-element.component";

import {ExportService} from "./service/export.service";
import {Types} from "../../common/constants/types";
import {SectionsService} from "../../service/sections/sections.service";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";


@Component({
    templateUrl: './igdocument-edit.component.html',
    styleUrls : ['./igdocument-edit.component.css']
})
export class IgDocumentEditComponent {
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  @ViewChild(AddConformanceProfileComponent) addCps: AddConformanceProfileComponent;
  @ViewChild(AddSegmentComponent) addSegs: AddSegmentComponent;
  @ViewChild(AddDatatypeComponent) addDts: AddDatatypeComponent;
  @ViewChild(AddValueSetComponent) addVs: AddValueSetComponent;
  @ViewChild(CopyElementComponent) copyElemt: CopyElementComponent;

  igId:any;
  exportModel: MenuItem[];

  metadata:any;

  ig:any;
  currentUrl:any;
  displayMessageAdding: boolean = false;

  hideToc:boolean=false;

  activeNode:any;

  searchFilter:string="";
  blockUI:false;

  types: SelectItem[]=[


    {label:"Narrative",value:"TEXT"},
    {label:"Conforamance profile",value:"CONFORMANCEPROFILE"},
    {label:"Segment",value:"SEGMENT"},
    {label:"Data Type",value:"DATATYPE"},

    {label:"Profile Component",value:"PROFILECOMPONENT"},
    {label:"Composite Profile ",value:"COMPOSITEPROFILE"},
    {label:"ValueSet",value:"VALUESET"}
  ];


  scopes: SelectItem[]=[


    {label:"HL7",value:"HL7STANDARD"},
    {label:"USER",value:"USER"},
    {label:"HL7 Flavors",value:"MASTER"}

  ];


  selectedScopes: SelectItem[];


  selectedTypes :SelectItem[];

  @ViewChild(TreeComponent) private tree: TreeComponent;
  @ViewChild('igcontextmenu') public igcontextmenu: ContextMenuComponent;
  @ViewChild('textcontextmenu') public textcontextmenu: ContextMenuComponent;
  @ViewChild('datatypescontextmenu') public datatypescontextmenu: ContextMenuComponent;
  currentNode:TreeNode;


  private items: MenuItem[];

  nodes: any[];
  treeData: any;
  options = {
    allowDrag: (node: TreeNode) =>{ return node.data.data.type==Types.TEXT|| node.data.data.type==Types.CONFORMANCEPROFILE||node.data.data.type==Types.PROFILE},
    actionMapping: {
      mouse: {
        drop: (tree:TreeModel, node:TreeNode, $event:any, {from, to}) => {
          //console.log("dropping");
          //console.log(node);
          //console.log(from);
          //console.log(to);


          if(from.data.data.type== Types.TEXT && (!this.isOrphan(to) && to.parent.data.data.type==Types.TEXT||this.isOrphan(to))){
            //console.log(from);



              TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});
              this.indexedDbService.updateIgToc(this.igId,this.tree.treeModel.nodes);


          }
          if(from.data.data.type== Types.PROFILE && this.isOrphan(to)) {
            //console.log(from);

            TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});
            this.indexedDbService.updateIgToc(this.igId,this.tree.treeModel.nodes);

            //this.sectionService.updateDnD(node.id,node.data, {from:from.id,to:to.id,position:node.data.data.position})


          }
        },
        mouse: {
          click: TREE_ACTIONS.ACTIVATE
        },
        contextMenu: (model: any, node: any, event: any) => {
          event.preventDefault();
          this.onContextMenu(event, node);
          //console.log('in context menu...');
        }
      }
    }
  };

  isOrphan(node:any){

    return node.parent&&!node.parent.parent;
  }

  constructor( private  tocService:TocService,    private sp: ActivatedRoute, private  router : Router,public exportService:ExportService, public sectionService:SectionsService, public indexedDbService:IndexedDbService){

    router.events.subscribe(event => {
      //console.log(event);

      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
        this.parseUrl();
      }
    });
  }

  filterFn(){
    this.hideToc=false; // show the TOC if we filter
    this.tree.treeModel.filterNodes((node) => {
      if(node.data.data.domainInfo) {

        if (node.data.data.domainInfo.scope) {

          return node.data.data.label.startsWith(this.searchFilter) && (!this.selectedTypes||this.selectedTypes.indexOf(node.data.data.type)>-1)&&(!this.selectedScopes||this.selectedScopes.indexOf(node.data.data.domainInfo.scope)>-1);
        }

      }
      return node.data.data.label.startsWith(this.searchFilter) && (!this.selectedTypes||this.selectedTypes.indexOf(node.data.data.type)>-1)&&(!this.selectedScopes||this.selectedScopes.length==0);


    });

  }



  ngOnInit() {
    //console.log("Calling on Init");
    this.igId= this.sp.snapshot.params["igId"];

    this.sp.data.map(data =>data.currentIg).subscribe(x=>{
      this.ig= x;



      this.nodes=this.ig.toc;

    });

    this.tocService.metadata.subscribe(x=>{

      this.metadata=x;
    })


    this.exportModel = [
      {label: 'As Word', command: () => {

        this.exportAsWord();

      }},
      {label: 'As HTML', command: () => {
        this.exportAsHTML();

      }}

    ];

  }

  exportAsWord(){
  this.exportService.exportAsWord(this.igId);
  }
  exportAsHTML(){
    this.exportService.exportAsHtml(this.igId);

  }

  toggleHideToc(){


    this.hideToc=!this.hideToc;

  }
  print(node){
    console.log(node);
  }
  ngAfterViewInit() {

      this.setTreeModel();

      this.parseUrl();


  }
  setTreeModel(){
    this.tocService.setTreeModel(this.tree.treeModel);
  }


  parseUrl(){
    if(this.tree) {


      var index = this.currentUrl.indexOf("/ig/");
      var fromIg = this.currentUrl.substring(this.currentUrl.indexOf("/ig/") + 4);

      var paramIndex = fromIg.indexOf('?');
      //console.log(paramIndex);
      if (paramIndex > -1) {
        fromIg = fromIg.substring(0, paramIndex);
      }
      var slashIndex = fromIg.indexOf("/");

      if (slashIndex > 0) {
        var fromChild = fromIg.substring(slashIndex + 1, fromIg.length);
        var child = fromChild.substring(fromChild.indexOf("/") + 1, fromChild.length);
        let childId="";
        //console.log(child);
        if(child.indexOf("/")>0||child.indexOf("/")==child.length-1){
          //console.log(childId);
          childId=child.substring( 0,child.indexOf("/"));

        }else{

          childId=child;

        }
        let node = this.tree.treeModel.getNodeById(childId);
        if (node) {
          this.tocService.setActiveNode(node);
          node.setIsActive(true);
          this.activeNode=node.id;
        }
      }
    }

  }
  filterByUrl(url: any){
    this.tree.treeModel.filterNodes((node) => {
       if(node.data.data.key){
          if(node.data.data.key&& node.data.data.key.id) {
            if (this.currentUrl.includes(node.data.data.key.id)) {
              this.activeNode = node.id;
              return true;
            }
          }
        }else{
        }

    });
  }





  getItemFromTargetType(node:TreeNode) {
    this.currentNode=node;

    if (node.data.data.type == Types.IGDOCUMENT) {

      this.items =  [
        {label: 'Add Section', icon: 'fa-plus', command :(event)=>{

          //console.log(event);
        }
        }
      ];

      return this.items;
    }
  }
  onContextMenu(event, node){


  }

  addSection(){
    ////console.log(this.toc);

    let data1 ={
      label: "new Section",
      content:"",
      type:Types.TEXT,
      position: this.tree.treeModel.nodes.length+1
    };
    var newNode = {id : "bla",data:data1, children :[]};
    this.tree.treeModel.nodes.push(newNode);

    this.tree.treeModel.update();



  };

  getPath =function (node) {
    node.data.data.position= parseInt(node.index)+1; // temporary to be discussed
    if(this.isOrphan(node)){
      return  node.data.data.position+".";
    }else{
      return this.getPath(node.parent)+ node.data.data.position+".";
    }
  };

  path(node){
    return node.path;
  }

  collapseAll(){
    this.tree.treeModel.collapseAll();
  }
  expandAll(){
    this.tree.treeModel.expandAll();
  }

  filterByTypes(){
    this.tree.treeModel.filterNodes((node) => {

      return (!this.selectedTypes||this.selectedTypes.indexOf(node.data.data.type)>-1)&&(this.selectedScopes||this.selectedScopes.indexOf(node.data.data.domainInfo.scope)>-1) && node.data.data.label.startsWith(this.searchFilter);

    });
  }


  activateNode(node){
   // this.activeNode=node.id;
  }




  goToSection(id) {


    this.sp.queryParams
      .subscribe(params => {
        //console.log(params);

        this.router.navigate(["./section/"+id],{ preserveQueryParams:true ,relativeTo:this.sp, preserveFragment:true});

      });



  }
  goToMetaData(){
  this.sp.queryParams
    .subscribe(params => {

      this.router.navigate(["./metadata/"],{ preserveQueryParams:true ,relativeTo:this.sp, preserveFragment:true});

    });
  }

  addMessage(node){

    this.addCps.open({
      id : this.igId
    })
      .subscribe(
        result => {

          this.distributeResult(result);
          //console.log(result);
        }
      )

  }


  distributeResult(object:any){
    //console.log("Adding Objs");

    //console.log(object);

    if(object.conformanceProfiles){
      this.tocService.addNodesByType(object.conformanceProfiles,this.tree.treeModel.nodes, Types.CONFORMANCEPROFILEREGISTRY);

    }if(object.segments){
      this.tocService.addNodesByType(object.segments,this.tree.treeModel.nodes,  Types.SEGMENTREGISTRY);



    }
    if(object.datatypes){
      this.tocService.addNodesByType( object.datatypes,this.tree.treeModel.nodes, Types.DATATYPEREGISTRY);

    }
    if(object.valueSets){
      this.tocService.addNodesByType(object.valueSets,this.tree.treeModel.nodes, Types.VALUESETREGISTRY);

    }


      this.tree.treeModel.update();
      this.indexedDbService.updateIgToc(this.igId,this.tree.treeModel.nodes).then(x => {

        //console.log("updated");
        }, error=>{
        //console.log("could not update IG")

        }

      )


  };



  addSegments(){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.SEGMENTREGISTRY);

    //console.log(existing);
    this.addSegs.open({
      id : this.igId,
      namingIndicators:existing
    })
      .subscribe(
        result => {

          this.distributeResult(result);
          //console.log(result);
        }
      )
  }


  addDatatypes(){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.DATATYPEREGISTRY);

    this.addDts.open({
      id : this.igId,
      namingIndicators:existing
    })
      .subscribe(
        result => {

          this.distributeResult(result);
        }
      )

  }

  addValueSets(){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.VALUESETREGISTRY);

    this.addVs.open({
      id : this.igId,
      namingIndicators:existing
    }).subscribe(
        result => {

          this.distributeResult(result);
        }
      )

  }

  copyDatatype(node){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.DATATYPEREGISTRY);

    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.key,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      namingIndicators:existing

    })
      .subscribe(
        result => {
          let toDistribute:any={};
          let datatypes=[];
          datatypes.push(result);
          toDistribute.datatypes=datatypes;
          this.distributeResult(toDistribute);

        }
      )
  };

  copySegment(node){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.SEGMENTREGISTRY);

    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.key,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      namingIndicators:existing

    })
      .subscribe(
        result => {
          let toDistribute:any={};
          let segments=[];
          segments.push(result);
          toDistribute.segments=segments;
          this.distributeResult(toDistribute);

        }
      )
  };

  copyValueSet(node){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.VALUESETREGISTRY);
    //console.log(existing);

    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.key,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      namingIndicators:existing

    })
      .subscribe(
        result => {
          let toDistribute:any={};
          let valueSets=[];
          valueSets.push(result);
          toDistribute.valueSets=valueSets;
          this.distributeResult(toDistribute);

        }
      )

  };

  copyConformanceProfile(node){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.CONFORMANCEPROFILEREGISTRY);
    //console.log(existing);

    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.key,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      namingIndicators:existing

    })
      .subscribe(
        result => {
          let toDistribute:any={};
          let conformanceProfiles=[];
          conformanceProfiles.push(result);
          toDistribute.conformanceProfiles=conformanceProfiles;
          this.distributeResult(toDistribute);

        }
      )
  }

  copySection(node){
   //console.log( this.tree._options);
    this.tocService.cloneNode(node);
   let ret =  this.tree.treeModel.getNodeById(node.id);
    //console.log(ret);
    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.id,
      name:node.data.data.label,
      type:node.data.data.type,

    })
      .subscribe(
        result => {
         //console.log("result");
         //console.log(result);
         //console.log(node.parent);
         //console.log(node.parent.treeModel);
         node.parent.data.children.push(result);
          this.tree.treeModel.update();
          this.indexedDbService.updateIgToc(this.igId,this.tree.treeModel.nodes).then(x => {

              //console.log("updated");
            }, error=>{
              //console.log("could not update IG")

            }

          )


        }
      )

  }


}
