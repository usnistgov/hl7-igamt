import { Component, OnInit } from '@angular/core';
import {IgListService} from "../igdocument-list.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './my-igs.component.html'
})

export class MyIgsComponent implements OnInit {

  igs :any

  constructor(private listService :IgListService, public router: Router ) {

    listService.getMyIGs().subscribe( res =>{
      console.log(res);
       this.igs=res;


      }
    );

  }


  ngOnInit() {

  }

  open(ig,readnly){
    this.router.navigate(['/ig-documents/igdocuments-edit/'+ig.id],{ queryParams: { readOnly: "true" } });
  }

}
