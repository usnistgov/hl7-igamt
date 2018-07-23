import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-datatype-cross-ref',
  templateUrl: './datatype-cross-ref.component.html',
  styleUrls: ['./datatype-cross-ref.component.css']
})
export class DatatypeCrossRefComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute, private  router : Router) { }

  ngOnInit() {
    this.activeRoute.data.map(data =>data.ref).subscribe( x =>{


    });
  }

}
