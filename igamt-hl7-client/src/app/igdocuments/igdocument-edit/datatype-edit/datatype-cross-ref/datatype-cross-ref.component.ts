import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TocService} from "../../service/toc.service";
import {TreeNode} from "angular-tree-component";
import {CrossReferenceService} from "../../../../common/cross-reference/cross-reference.service";
import {RelationShip} from "../../../../common/relationship/relationship";

@Component({
  selector: 'app-datatype-cross-ref',
  templateUrl: './datatype-cross-ref.component.html',
  styleUrls: ['./datatype-cross-ref.component.css']
})
export class DatatypeCrossRefComponent implements OnInit {


  crossRefs : any;
  relations : RelationShip[];

  constructor(private activeRoute: ActivatedRoute, private tocService : TocService, private crossReferenceService: CrossReferenceService) {

  }


  ngOnInit () {

    this.activeRoute.data.map(data =>data.refs).subscribe( x  => {

      //this.crossRefs= this.crossReferenceService.getReferenceNodes(this.relations, this.tocService.getTreeModel());

    });
  }



  }
