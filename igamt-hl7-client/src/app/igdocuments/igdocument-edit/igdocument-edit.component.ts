import {Component, Input, ElementRef} from '@angular/core';

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
import {LoadingService} from "./service/loading.service";
import {DeleteElementComponent} from "./delete-element/delete-element.component";
import {BreadcrumbService} from "../../breadcrumb.service";
import {DisplayService} from "../../display/display.service";
import {UUID} from "angular2-uuid";


@Component({
    templateUrl: './igdocument-edit.component.html',
    styleUrls : ['./igdocument-edit.component.css'],

})
export class IgDocumentEditComponent {
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  @ViewChild(AddConformanceProfileComponent) addCps: AddConformanceProfileComponent;
  @ViewChild(AddSegmentComponent) addSegs: AddSegmentComponent;
  @ViewChild(AddDatatypeComponent) addDts: AddDatatypeComponent;
  @ViewChild(AddValueSetComponent) addVs: AddValueSetComponent;
  @ViewChild(CopyElementComponent) copyElemt: CopyElementComponent;
  @ViewChild(DeleteElementComponent) deleteElement: DeleteElementComponent;
  @ViewChild("vsLib") vsLib :ElementRef;
  @ViewChild("dtLib") dtLib :ElementRef;
  @ViewChild("segLib") segLib :ElementRef;
  @ViewChild("cpLib") cpLib :ElementRef;

  igId:any;
  exportModel: MenuItem[];
  userUrl : MenuItem[]=[];

  loading=false;
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
    {label:"SDTF",value:"SDTF"}
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
          if(from.data.data.type== Types.TEXT && (!this.isOrphan(to) && to.parent.data.data.type==Types.TEXT||this.isOrphan(to))){
             TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});
              this.setTreeModel();
          }
          if(from.data.data.type== Types.PROFILE && this.isOrphan(to)) {
            TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});
            this.setTreeModel();
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

  constructor( private  tocService:TocService,    private sp: ActivatedRoute, private  router : Router,public exportService:ExportService, private loadingService:LoadingService, private  breadCrump:BreadcrumbService, private displayService:DisplayService){
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
      this.tocService.setIgId(this.igId);

      this.igId=x.id;
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

  scrollTo(ref: ElementRef ){
    console.log("Scrolling");
    console.log(ref);
    ref.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

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



    console.log("Initing IG");
    this.initTreeModel();

    //this.parseUrl();

  }

  setTreeModel(){
    this.parseUrl();
    return this.tocService.setTreeModel(this.tree.treeModel);
  }


  initTreeModel(){
    this.parseUrl();

    return this.tocService.initTreeModel(this.tree.treeModel);
  }

  getElementUrl(elm){
    var type=elm.type.toLowerCase();
    return "./"+type+"/"+elm.id;
  }


  parseUrl(){
  this.userUrl=[];
    if(this.tree) {


      let rest =this.currentUrl;

      let paramsIndex = this.currentUrl.indexOf("?");

      if (paramsIndex > -1) {
        rest = this.currentUrl.substring(0, paramsIndex);

      }
      rest = rest.replace("/ig/" + this.igId + "/", "");

      console.log("rest");
      console.log(rest);
      this.userUrl.push({label: "IG Documents"}, {label: this.metadata.title, icon:"fa fa-folder"});
      let splitted = rest.split("/");
      if (splitted && splitted.length) {
        for (let i = 1; i < splitted.length; i++) {


          this.userUrl.push(this.getDisplay(splitted[i]));

        }
      } else {
        this.userUrl.push({label: this.displayService.getLabel(rest), icon:this.displayService.getIcon(rest)});
      }
    }

    this.breadCrump.setItems(this.userUrl);


  }

  getDisplay(string){

       let node = this.tree.treeModel.getNodeById(string);
       if(node&&node.data && node.data.data && node.data.data.label) {
         if(node.data.data.type && node.data.data.type==Types.TEXT){
           return {label: this.getPath(node)+node.data.data.label}
         }else{
           return {label: node.data.data.label, badge:this.displayService.getBadge(node.data.data.type),badgeStyleClass:this.displayService.getBadgeClass(node.data.data.type)}
         }
         }
         else {
         return {label: this.displayService.getLabel(string), icon: this.displayService.getIcon(string)}
       }
  }

  filterByUrl(url: any){
    this.tree.treeModel.filterNodes((node) => {
       if(node.data.data){
          if(node.data.data.id) {
            if (this.currentUrl.includes(node.data.data.id)) {
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
    var newNode = {id : UUID.UUID(),data:data1, children :[]};
    this.tree.treeModel.nodes.push(newNode);

    this.tree.treeModel.update();
    this.setTreeModel();

  };
  addSectionToNode( node:TreeNode){
    ////console.log(this.toc);

    let data1 ={
      label: "new Section",
      content:"",
      type:Types.TEXT,
      position: this.tree.treeModel.nodes.length+1
    };
    var newNode = {id : UUID.UUID(),data:data1, children :[]};
    node.data.children.push(newNode);

    this.tree.treeModel.update();
    this.setTreeModel();

  };

  getPath =function (node) {

    //node.data.data.position= parseInt(node.index)+1; // temporary to be discussed
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
    this.activeNode=node.id;
  }




  goToSection(id) {



    this.sp.queryParams
      .subscribe(params => {
        //console.log(params);
        this.router.navigate(["./section/"+id],{ preserveQueryParams:true ,relativeTo:this.sp, preserveFragment:true});

      });



  }

  getSectionUrl(id){

    return "./section/"+id;
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
     this.setTreeModel();

  };



  addSegments(){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.SEGMENTREGISTRY);
    this.addSegs.open({
      id : this.igId,
      namingIndicators:existing
    })
      .subscribe(
        result => {
          this.distributeResult(result);
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
      id:node.data.data.id,
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
          this.router.navigate(["./"+"datatype"+"/"+result.id+"/metadata"],{ preserveQueryParams:true,relativeTo:this.sp, preserveFragment:true});
        }
      )
  };



  copySegment(node){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.SEGMENTREGISTRY);

    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.id,
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
          this.router.navigate(["./"+"segment"+"/"+result.id+"/metadata"],{ preserveQueryParams:true,relativeTo:this.sp, preserveFragment:true});


        }
      )
  };

  copyValueSet(node){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.VALUESETREGISTRY);
    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.id,
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
          this.router.navigate(["./"+"valueset"+"/"+result.id+"/metadata"],{ preserveQueryParams:true,relativeTo:this.sp, preserveFragment:true});


        }
      )

  };

  copyConformanceProfile(node){

    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.CONFORMANCEPROFILEREGISTRY);
    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.id,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      namingIndicators:existing

    }).subscribe(
        result => {
          let toDistribute:any={};
          let conformanceProfiles=[];
          conformanceProfiles.push(result);
          toDistribute.conformanceProfiles=conformanceProfiles;
          this.distributeResult(toDistribute);
          this.router.navigate(["./"+"conformanceprofile"+"/"+result.id+"/metadata"],{ preserveQueryParams:true,relativeTo:this.sp, preserveFragment:true});
        }
      )
  }

  copySection(node){
    this.tocService.cloneNode(node);
  }




  // Delete

  deleteDatatype(node){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,Types.DATATYPEREGISTRY);

    this.deleteElement.open({
      igId : this.igId,
      id:node.data.data.id,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      node:node.data.data
    })
      .subscribe(
        id => {
          this.tocService.deleteNodeById(id);
          this.tocService.setTreeModelInDB(this.tree.treeModel);
        }
      )
  };

  deleteSegment(node){

    this.deleteElement.open({
      igId : this.igId,
      id:node.data.data.id,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      node:node.data.data
    })
      .subscribe(
        id => {
          this.tocService.deleteNodeById(id);
          this.tocService.setTreeModelInDB(this.tree.treeModel);
        }
      )
  };

  deleteValueSet(node){
    this.deleteElement.open({
      igId : this.igId,
      id:node.data.data.id,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      node:node.data.data
    })
      .subscribe(
        id => {
          this.tocService.deleteNodeById(id);
          this.tocService.setTreeModelInDB(this.tree.treeModel);
        }
      )

  };

  deleteConformanceProfile(node){
    this.deleteElement.open({
      igId : this.igId,
      id:node.data.data.id,
      name:node.data.data.label,
      ext:node.data.data.ext,
      type:node.data.data.type,
      node:node.data.data
    })
      .subscribe(
        id => {
          this.tocService.deleteNodeById(id);
          this.tocService.setTreeModelInDB(this.tree.treeModel);
        }
      )
  }

  deleteSection(node){
  let ret =  this.tree.treeModel.getNodeById(node.id);
  this.deleteElement.open({
    igId : this.igId,
    id:node.id,
    name:node.data.data.label,
    type:node.data.data.type,
    node:node.data.data

  }).subscribe(
      id => {
        this.tocService.deleteNodeById(id);
        this.setTreeModel();
      }
    )
  }
  ngOnDestroy() {
    if (this.tree) {
      this.tree=null;
    }
    this.breadCrump.setItems(null);
  }

}
