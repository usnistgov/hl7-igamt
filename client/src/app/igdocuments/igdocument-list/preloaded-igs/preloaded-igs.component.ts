import { Component, OnInit } from '@angular/core';
import {IgListService} from "../igdocument-list.service";

@Component({
  templateUrl: './preloaded-igs.component.html'
})

export class PreloadedIgsComponent implements OnInit {

  igs;

  constructor(private listService :IgListService ) {

    listService.getListByType("PRELOADED").subscribe( res =>
      this.igs= res);
  }

  ngOnInit() {
    // this.listService.getListByType("PRELOADED").then( res =>
    //   this.igs= res);


  }
}
