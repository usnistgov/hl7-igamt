import {Component, Input} from '@angular/core';

import {SelectItem} from "primeng/components/common/selectitem";

import * as _ from 'lodash'

import {ViewChild} from "@angular/core";
import {TocService} from "./service/toc.service";
import {TreeModel, TreeNode, IActionHandler, TREE_ACTIONS, TreeComponent} from "angular-tree-component";

import {MenuItem} from 'primeng/api';
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {Types} from "../../common/constants/types";
import {LocationStrategy} from "@angular/common";
import {LibraryExportService} from "./service/lib-export.service";



@Component({
  templateUrl: './edit-library.component.html',
  styleUrls : ['./edit-library.component.css'],

})
export class EditLibraryComponent {


  libId:any;
  exportModel: MenuItem[];

  loading=false;
  metadata:any;

  lib:any;
  currentUrl:any;
  displayMessageAdding: boolean = false;

  hideToc:boolean=false;

  activeNode:any;

  searchFilter:string="";
  blockUI:false;

  types: SelectItem[]=[


    {label:"Narrative",value:"TEXT"},
    {label:"Data Type",value:"DATATYPE"}
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

  constructor( private  tocService:TocService,    private sp: ActivatedRoute, private  router : Router, private location: LocationStrategy, private exportService: LibraryExportService){

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
    this.libId= this.sp.snapshot.params["libId"];
    this.tocService.setIgId(this.libId);




    this.sp.data.map(data =>data.currentLib).subscribe(x=>{
      this.lib= x;



      this.nodes=this.lib.toc;

    });

    this.tocService.metadata.subscribe(x=>{

      this.metadata=x;
    });

    this.exportModel = [
      {label: 'As Word', command: () => {

        this.exportAsWord();

      }},
      {label: 'As HTML', command: () => {
        this.exportAsHTML();

      }},
      {label: 'As Web', command: () => {

      }}

    ];




  }


  exportAsWord(){
    this.exportService.exportAsWord(this.libId);
  }
  exportAsHTML(){
    this.exportService.exportAsHtml(this.libId);

  }
  toggleHideToc(){


    this.hideToc=!this.hideToc;

  }
  print(node){
    console.log(node);
  }
  ngAfterViewInit() {

    this.initTreeModel();

    this.parseUrl();


  }

  setTreeModel(){
    return this.tocService.setTreeModel(this.tree.treeModel);
  }


  initTreeModel(){
    return this.tocService.initTreeModel(this.tree.treeModel);
  }


  parseUrl(){
    if(this.tree) {


      var index = this.currentUrl.indexOf("/datatype-library/");
      var fromIg = this.currentUrl.substring(this.currentUrl.indexOf("/datatype-library/") + 4);

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
    this.setTreeModel();


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



  distributeResult(object:any){

    if(object.datatypes){
      this.tocService.addNodesByType( object.datatypes,this.tree.treeModel.nodes, Types.DATATYPEREGISTRY);

    }
    if(object.valueSets){
      this.tocService.addNodesByType(object.valueSets,this.tree.treeModel.nodes, Types.VALUESETREGISTRY);

    }


    this.tree.treeModel.update();
    this.setTreeModel();

  };

  exportToHtml() {
    window.open(this.prepareUrl('5b2184a8cc89678ae75feacf', 'html'));
  }

  exportToWord() {
    window.open(this.prepareUrl('5b2184a8cc89678ae75feacf', 'word'));
  }

  private prepareUrl(id: string, type: string): string {
    return this.location.prepareExternalUrl('api/datatype-library/' + id + '/export/' + type).replace('#', '');
  }



























}
