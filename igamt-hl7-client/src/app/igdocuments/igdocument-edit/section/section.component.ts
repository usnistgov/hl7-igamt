import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

@Component({
  templateUrl: './section.component.html',
  changeDetection: ChangeDetectionStrategy.Default,


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
  ngOnDestroy(){
    console.log("destroying section");

  }



}
