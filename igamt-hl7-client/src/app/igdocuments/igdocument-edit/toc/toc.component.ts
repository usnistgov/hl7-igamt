import {Component, Input, ViewChildren, ViewChild} from "@angular/core";
import {WorkspaceService, Entity} from "../../../service/workspace/workspace.service";
import {TocService} from "./toc.service";
import {TreeModel, TreeNode, IActionHandler, TREE_ACTIONS, TreeComponent} from "angular-tree-component";

import {MenuItem} from 'primeng/api';
import {ContextMenuComponent} from "ngx-contextmenu";
import {ActivatedRoute} from "@angular/router";
import {SelectItem} from "primeng/components/common/selectitem";


@Component({
  selector : 'igamt-toc',
  templateUrl:"./toc.component.html",
  styleUrls:["./toc.component.css"]
})
export class TocComponent {
  @Input() ig : any;
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  igId:any;


  types: SelectItem[];
  selectedType: any;


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

          if(from.data.data.type== "TEXT" && (to.parent.data.data.type=="TEXT"||to.parent.data.data.type=="IGDOCUMENT")){
            console.log("Dropping");
            TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});

          }
          if(from.data.data.type== "PROFILE" && to.parent.data.data.type=="IGDOCUMENT") {
            console.log("Dropping");

            TREE_ACTIONS.MOVE_NODE(tree, node,$event, {from, to});


          }


          // use from to get the dragged node.
          // use to.parent and to.index to get the drop location
        },

        contextMenu: (model: any, node: any, event: any) => {
          event.preventDefault();
          this.onContextMenu(event, node);
          console.log('in context menu...');
        }
      }
    }
  };


  constructor( private  tocService:TocService,    private sp: ActivatedRoute){
    this.types=[


      {label:"TEXT",value:"TEXT"},
      {label:"CONFORMANCEPROFILE",value:"CONFORMANCEPROFILE"},
      {label:"SEGMENT",value:"SEGMENT"},

      {label:"MESSAGE",value:"CONFORMANCEPROFILE"},
      {label:"PRFOILECOMPONENT",value:"PROFILECOMPONENT"},
      {label:"Composite Profile ",value:"COMPOSITEPROFILE"},
      {label:"Value Set",value:"VALUESET"},
      {label:"Definition", value:"DISPLAY"}

    ]


    console.log(this.ig);

  }

  filterFn(value){
    this.tree.treeModel.filterNodes((node) => {
      return node.data.data.label.startsWith(value);
    });
  }

  ngOnInit() {
    this.igId= this.sp.snapshot.params["igId"];
  }
  print(node){
    console.log(node);
  }
  ngAfterViewInit() {
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
    // node.data.data.position= parseInt(node.index)+1;
      if(node.parent.data.data.type=="IGDOCUMENT"){
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

  filterByTypes(){
    console.log("")
    this.tree.treeModel.filterNodes((node) => {

    return this.selectedType==node.data.data.type;

    });
  }


}
