import {Component, Input} from '@angular/core';

import {SelectItem} from "primeng/components/common/selectitem";


import {ViewChildren, ViewChild} from "@angular/core";
import {TocService} from "./toc/toc.service";
import {TreeModel, TreeNode, IActionHandler, TREE_ACTIONS, TreeComponent} from "angular-tree-component";

import {MenuItem} from 'primeng/api';
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

@Component({
    templateUrl: './igdocument-edit.component.html',
    styleUrls : ['./igdocument-edit.component.css']
})
export class IgDocumentEditComponent {
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  igId:any;

  ig:any;
  currentUrl:any;
  hideToc:false;

  activeNode:any;

  searchFilter:string="";


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
            console.log("Dropping");
            TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});

          }
          if(from.data.data.type== "PROFILE" && this.isOrphan(to)) {
            console.log("Dropping");

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


    return node.parent&&!node.parent.parent!=null;


  }

  constructor( private  tocService:TocService,    private sp: ActivatedRoute, private  router : Router){

    router.events.subscribe(event => {

      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  filterFn(){
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
    this.igId= this.sp.snapshot.params["igId"];
    console.log("======URl");

    this.sp.children[0].children[0].url.subscribe(x=>{console.log(x)})
    console.log("======eee");

    this.sp.data.map(data =>data.currentIg).subscribe(x=>{
      this.ig= x;
      console.log(this.ig.toc.content);
      console.log(this.ig.toc.content.children);


      this.nodes=this.ig.toc.content[0].children;

    });



  }

  toggleHideToc(){


    this.hideToc= !this.hideToc;

  }
  print(node){
    console.log(node);
  }
  ngAfterViewInit() {
    console.log(this.currentUrl);

    this.tree.treeModel.filterNodes((node) => {



      if(this.currentUrl.includes(node.data.data.type.toLowerCase())){
        console.log(node);
        if(node.data.data.key&& node.data.data.key.id ){
         if( this.currentUrl.includes(node.data.data.key.id)){
           this.activeNode=node.id;
           return true;

         }

        }
      }

    });
    console.log(this.ig);
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

  addSection(node:TreeNode){
    //console.log(this.toc);

    let data1 ={
      label: "new Section",
      content:"",
      type:"TEXT",
      position: node.data.children.length+1
    };
    var newNode = {id : "bla",data:data1, children :[]};

    console.log(node);

    node.data.children.push(newNode);
    node.treeModel.update();

    console.log(this.ig.toc.content);


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
    console.log(node);
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
    this.activeNode=node;
  }


}
