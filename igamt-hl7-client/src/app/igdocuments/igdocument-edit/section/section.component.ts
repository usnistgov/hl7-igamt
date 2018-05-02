import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './section.component.html'
})

export class SectionComponent implements OnInit {
  constructor( private sp: ActivatedRoute, private  router : Router) {

  }
  section:any;

  ngOnInit() {

    this.sp.data.map(data =>data.currentSection).subscribe(x=>{
      this.section= x;
      console.log(this.section);



    });

  }





}
