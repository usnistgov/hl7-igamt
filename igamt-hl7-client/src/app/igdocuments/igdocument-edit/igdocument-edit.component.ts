import {Component, Input} from '@angular/core';

import {SelectItem} from "primeng/components/common/selectitem";


import {ViewChildren, ViewChild} from "@angular/core";
import {TocService} from "./toc/toc.service";
import {TreeModel, TreeNode, IActionHandler, TREE_ACTIONS, TreeComponent} from "angular-tree-component";

import {MenuItem} from 'primeng/api';
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import {AddConformanceProfileComponent} from "../add-conformance-profile/add-conformance-profile.component";
import {AddSegmentComponent} from "./add-segment/add-segment.component";
import {AddDatatypeComponent} from "./add-datatype/add-datatype.component";
import {AddValueSetComponent} from "./add-value-set/add-value-set.component";
import {CopyElementComponent} from "./copy-element/copy-element.component";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import {DatatypesTocService} from "../../service/indexed-db/datatypes/datatypes-toc.service";
import {TocDbService} from "../../service/indexed-db/toc-db.service";


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
  bsModalRef: BsModalRef;

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
    allowDrag: (node: TreeNode) =>{ return node.data.data.type=="TEXT"|| node.data.data.type=='CONFORMANCEPROFILE'||node.data.data.type=='PROFILE'},
    actionMapping: {
      mouse: {
        drop: (tree:TreeModel, node:TreeNode, $event:any, {from, to}) => {

          if(from.data.data.type== "TEXT" && (!this.isOrphan(to) && to.parent.data.data.type=="TEXT"||this.isOrphan(to))){
            console.log(from);
            TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});

          }
          if(from.data.data.type== "PROFILE" && this.isOrphan(to)) {
            console.log(from);

            TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});


          }
        },
        mouse: {
          click: TREE_ACTIONS.ACTIVATE
        },
        contextMenu: (model: any, node: any, event: any) => {
          event.preventDefault();
          this.onContextMenu(event, node);
          console.log('in context menu...');
        }
      }
    }
  };

  isOrphan(node:any){


    return node.parent&&!node.parent.parent;


  }

  constructor( private  tocService:TocService,    private sp: ActivatedRoute, private  router : Router,public dtsToCService  : DatatypesTocService,public tocDbService:TocDbService){

    router.events.subscribe(event => {
      console.log(event);

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
    console.log("Calling on Init");
    this.igId= this.sp.snapshot.params["igId"];

    this.sp.data.map(data =>data.currentIg).subscribe(x=>{
      this.ig= x;



      this.nodes=this.ig.toc;

    });



  }

  toggleHideToc(){


    this.hideToc=!this.hideToc;

  }
  print(node){
    console.log("calling print  ");
    console.log(node);
  }
  ngAfterViewInit() {

      this.parseUrl();


  }
  parseUrl(){
    if(this.tree) {


      var index = this.currentUrl.indexOf("/ig/");
      var fromIg = this.currentUrl.substring(this.currentUrl.indexOf("/ig/") + 4);

      var paramIndex = fromIg.indexOf('?');
      console.log(paramIndex);
      if (paramIndex > -1) {
        fromIg = fromIg.substring(0, paramIndex);
      }
      var slashIndex = fromIg.indexOf("/");

      if (slashIndex > 0) {
        var fromChild = fromIg.substring(slashIndex + 1, fromIg.length);
        var child = fromChild.substring(fromChild.indexOf("/") + 1, fromChild.length);
        let childId="";
        console.log(child);
        if(child.indexOf("/")>0||child.indexOf("/")==child.length-1){
          console.log(childId);
          childId=child.substring( 0,child.indexOf("/"));

        }else{
          console.log("wdwd");

          childId=child;

        }
        let node = this.tree.treeModel.getNodeById(childId);
        if (node) {
          this.tocService.setActiveNode(node);
          node.setIsActive(true);
          this.activateNode(node);
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

    if (node.data.data.type == 'IGDOCUMENT') {

      this.items =  [
        {label: 'Add Section', icon: 'fa-plus', command :(event)=>{

          console.log(event);
        }
        }
      ];

      return this.items;
    }
  }
  onContextMenu(event, node){


  }

  addSection(){
    //console.log(this.toc);

    let data1 ={
      label: "new Section",
      content:"",
      type:"TEXT",
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
    this.activeNode=node.id;
  }



  goToSection(id) {


    this.sp.queryParams
      .subscribe(params => {
        console.log(params);

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
          console.log(result);
        }
      )

  }


  distributeResult(object:any){
    var conformanceProfiles=[];
    var segments=[];
    var datatypes=[];
    var valueSets=[];
    var compositeProfiles=[];
    var profileComponents=[];

    if(object.conformanceProfiles){
      conformanceProfiles= this.convertList(object.conformanceProfiles);
    }if(object.segments){

      segments=this.convertList(object.segments);

    }
    if(object.datatypes){
      datatypes=this.convertList(object.datatypes);
    }
    if(object.valueSets){
      valueSets=this.convertList(object.valueSets);
    }

    this.tocDbService.bulkAddTocNewElements(valueSets,datatypes,segments,conformanceProfiles,profileComponents,compositeProfiles).then(()=>{

      if(object.conformanceProfiles){
        this.tocService.addNodesByType(object.conformanceProfiles,this.tree.treeModel.nodes, "CONFORMANCEPROFILEREGISTRY");
      }
      if(object.segments){
        this.tocService.addNodesByType(object.segments,this.tree.treeModel.nodes,  "SEGMENTREGISTRY");
      }
      if(object.datatypes){

        this.tocService.addNodesByType( object.datatypes,this.tree.treeModel.nodes, "DATATYPEREGISTRY");
      }
      if(object.valueSets){
        this.tocService.addNodesByType(object.valueSets,this.tree.treeModel.nodes, "VALUESETREGISTRY");
      }
      this.tree.treeModel.update();

    }).catch((error)=>{

        }
      );





  }



  addSegments(){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,"SEGMENTREGISTRY");

    console.log(existing);
    this.addSegs.open({
      id : this.igId,
      namingIndicators:existing
    })
      .subscribe(
        result => {

          this.distributeResult(result);
          console.log(result);
        }
      )
  }


  addDatatypes(){
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,"DATATYPEREGISTRY");

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
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,"VALUESETREGISTRY");

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
    let existing=this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes,"DATATYPEREGISTRY");

    this.copyElemt.open({
      igDocumentId : this.igId,
      id:node.data.data.key,
      name:node.data.data.label,

      namingIndicators:existing

    })
      .subscribe(
        result => {

          this.distributeResult(result);
        }
      )
  }



  convertList(list : any[]){
    let ret : any[]=[];
    for (let i=0; i<list.length;i++ ){
      ret.push(list[i]);
    }
    return ret;
  }








}
