import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-segment-cross-ref',
  templateUrl: 'segment-cross-ref.component.html',
  styleUrls: ['segment-cross-ref.component.css']
})
export class SegmentCrossRefComponent implements OnInit {


  crossRefs:any;

  constructor(private activeRoute: ActivatedRoute, private  router : Router) { }

  ngOnInit() {

    this.activeRoute.data.map(data =>data.refs).subscribe(x=>{

      this.crossRefs=x;


    });

  }

}
