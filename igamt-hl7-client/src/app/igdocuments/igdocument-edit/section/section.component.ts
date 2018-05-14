import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import * as _ from 'lodash';
import {setUpControl} from "@angular/forms/src/directives/shared";

import {WithSave} from "../../../with.save.interface";

@Component({
  templateUrl: './section.component.html',


})

export class SectionComponent implements OnInit, WithSave {
  constructor( private sp: ActivatedRoute, private  router : Router) {


  }
  section:any;
  backup:any;

  ngOnInit() {

    this.sp.data.map(data =>data.currentSection).subscribe(x=>{
      console.log(this.section);

      this.backup=x;
      this.section=_.cloneDeep(this.backup);



    });

  }

  save(){
  this.backup=this.section;
  this.section=_.cloneDeep(this.backup);

  }
  reset(){

  }

  getCurrent(){
    return this.section;
  }
  getBackup(){
    return this.backup;
  }

  isValid(){

  }
}
