import { Component, OnInit } from '@angular/core';
import {IgListService} from "../igdocument-list.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './my-igs.component.html'
})

export class MyIgsComponent implements OnInit {

  igs :any

  constructor(public activeRoute: ActivatedRoute,public  router:Router) {
    this.activeRoute.data.map(data =>data.myIgs).subscribe(x=>{
      this.igs=x;


    });



  }


  ngOnInit() {

  }

  open(ig,readnly){
    console.log(ig.id.id);
    this.router.navigate(['/ig-documents/igdocuments-edit/'+ig.id.id],{ queryParams: { readOnly: "true" } });
  }

}
