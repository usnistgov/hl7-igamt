import {Component, OnInit, Input} from '@angular/core';
import {TreeNode} from "primeng/components/common/treenode";

@Component({
  selector: 'cross-reference',
  templateUrl: './cross-reference.component.html',
  styleUrls: ['./cross-reference.component.css']
})
export class CrossReferenceComponent implements OnInit {

  constructor() {}


  treeModel=[];
  @Input()
  crossReference :any;
  root:TreeNode={};

  ngOnInit() {
    console.log(this.crossReference);

  }




}
