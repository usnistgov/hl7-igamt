import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-valueset-cross-ref',
  templateUrl: 'valueset-cross-ref.component.html',
  styleUrls: ['valueset-cross-ref.component.css']
})
export class ValuesetCrossRefComponent implements OnInit {


  crossRefs:any;

  constructor(private activeRoute: ActivatedRoute, private  router : Router) { }

  ngOnInit() {

    this.activeRoute.data.map(data =>data.refs).subscribe(x=>{

      this.crossRefs=x;


    });



  }

}
