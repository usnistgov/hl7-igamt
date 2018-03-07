import {Component, Input, ViewChildren} from "@angular/core";
import {WorkspaceService, Entity} from "../../../service/workspace/workspace.service";
import {TocService} from "./toc.service";
import  {ViewChild} from '@angular/core';
import {UITreeNode, Tree} from "primeng/components/tree/tree";
import {TreeNode} from "primeng/components/common/treenode";
import {falseIfMissing} from "protractor/built/util";
// import {ContextMenuModule,MenuItem} from 'primeng/primeng';
import {ContextMenuComponent} from "ngx-contextmenu";


@Component({
  selector : 'igamt-toc',
  templateUrl:"./toc.component.html",
  styleUrls:["./toc.component.css"]
})
export class TocComponent {
  @ViewChild(Tree) toc :Tree;
  //rootMenu: MenuItem[];
  public items = [
    { name: 'John', otherProperty: 'Foo' },
    { name: 'Joe', otherProperty: 'Bar' }
  ];

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;


  _ig : any;
  currentNode: any;

  treeData: any;
  constructor(private _ws : WorkspaceService, private  tocService:TocService){

  }

  @Input() set ig(ig){
    this._ig = ig;
  }


  ngOnInit() {
    var ctrl=this;

    this.ig = this._ws.getCurrent(Entity.IG).subscribe(data =>{
      this.ig= data
      this.treeData = this.tocService.buildTreeFromIgDocument(this._ig);


      // this.rootMenu= [{label: "add Section", command:function(event){
      //   console.log(event);
      //   var data= {position: 4, sectionTitle: "New Section", referenceId: "", referenceType: "section", sectionContent: null};
      //   var node={};
      //   node["data"]=data;
      //   ctrl.treeData[0].children.push(node);
      //
      //
      // }}];
      this.toc.allowDrop = this.allow;
      // this.toc.draggableNodes = true;
      // this.toc.droppableNodes = true;
      this.toc.onNodeDrop.subscribe(x => {
        for(let a = 0; a<x.dragNode.parent.children.length; a++){
          x.dragNode.parent.children[a].data.position=a+1;
        }

        for(let c = 0; c<x.dropNode.children.length; c++){
          if(x.dropNode.children[c].data){
            x.dropNode.children[c].data.position=c+1;

          }
        }
        for(let b = 0; b<x.dropNode.parent.children.length; b++){
          x.dropNode.parent.children[b].data.position=b+1;
        }

      });





    });

    // this.toc.dragDropService.stopDrag = function (x) {
    //   console.log("HT");
    //   console.log(x);
    // };









  }

  print =function (obj) {
    console.log("Printing Obj");
    console.log(obj);
  };

  getPath =function (node) {
    if(node.data.position){
      if(node.parent.data.referenceType=="root"){
        return node.data.position;
      }else{
        return this.getPath(node.parent)+"."+node.data.position;
      }
    }
  };

  onDragStart(event,node) {
    console.log(event);

    console.log("Drag Start");
  };
  onDragEnd(event, node) {
    console.log("DRAG END ")


  };
  onDrop(event) {
    console.log("Performed");
    console.log(event);
  };
  onDragEnter(event, node) {

  };
  onDragLeave(event, node) {
  };

  prevent(dragNode: TreeNode, dropNode: TreeNode, dragNodeScope: any) {
    console.log("Called");
    return false;
  };

  allow(dragNode: TreeNode, dropNode: TreeNode, dragNodeScope: any) {
    if(dragNode==dropNode){
      return false;
    }
    if(dropNode&&dropNode.parent&&dropNode.parent.data) {

      if (dragNode.data.referenceType == 'profile') {
        console.log(dropNode);
        return dropNode.parent.data.referenceType == 'root';
      } else if (dragNode.data.referenceType == 'section') {
        return dropNode.parent.data.referenceType=='root'|| dropNode.parent.data.referenceType=='section';

      }
    }else {
      return false;
    }


  };
  setActualNode(node: Node){
      this._ws.setCurrent(Entity.CURRENTNODE, node);
     // this.currentNode=node;
     // console.log(node);
     // this.currentNode.data.ref.name="test";

  }
  AddSection(parent:TreeNode){
      console.log(parent);
      var data= { position: 4, sectionTitle: "New Section", referenceId: "", referenceType: "section", sectionContent: null};
      let node:TreeNode ={};
      node.data=data;
      parent.children.push(node);
  }


}
