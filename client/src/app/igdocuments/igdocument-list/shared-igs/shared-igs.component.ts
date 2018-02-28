import { Component, OnInit } from '@angular/core';
import {IgListService} from "../igdocument-list.service";

@Component({
  templateUrl: './shared-igs.component.html'
})

export class SharedIgsComponent implements OnInit {

  igs :any[];

  constructor(private listService :IgListService ) {


  }

  ngOnInit() {
    // this.listService.getListByType("SHARED").then( res =>
    //   this.igs= res);
  }
}
