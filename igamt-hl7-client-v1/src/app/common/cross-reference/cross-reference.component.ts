import {Component, OnInit, Input} from '@angular/core';
import {TreeNode} from "primeng/components/common/treenode";

@Component({
  selector: 'cross-reference',
  templateUrl: './cross-reference.component.html',
  styleUrls: ['./cross-reference.component.css']
})
export class CrossReferenceComponent implements OnInit {

  constructor() { }


  treeModel=[];
  segmentTreeModel:any;
  messageTreeModel:any;
  @Input()
  crossReference :any;


  root:TreeNode={};


  processed=false;

  ngOnInit() {
    console.log(this.crossReference);
    this.root.label="Cross References Graph";
    this.root.children=[];


    this.processed=false;




    for(let prop in this.crossReference){


      this.root.children.push(this.processCrossReference(prop, this.crossReference[prop]));



    }
    this.treeModel.push(this.root);
    this.processed=true;


  }





  processCrossReference(label: string, crossRefEntry:any): TreeNode{

    var ret:TreeNode={};

    ret.label=label;
    ret.expanded=true;
    ret.children =[];
    let data :any={};


    ret.data=data;

     for(let i=0; i<crossRefEntry.length;  i++){

       var child=this.createNode(crossRefEntry[i]);

       ret.children.push(child);

     }

      return ret;
  }


  createNode(resource:any):TreeNode{
    console.log(resource)

    var ret:TreeNode={};
    let data :any={};
    ret.expanded=true;
    ret.label=resource.name;
    if(resource.path){
      ret.label=resource.path+":"+ret.label;
    }

    for(let prop in resource ){

      if(prop!=="children"){
        data[prop]=resource[prop];
      }
    }

    if(resource.children){
      ret.children =[];

      for(let i=0 ; i < resource.children.length; i++){
        ret.children.push(this.createNode(resource.children[i]));

      }


    }
    return ret;

  }



}
