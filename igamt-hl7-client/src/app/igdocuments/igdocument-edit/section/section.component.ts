import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import * as _ from 'lodash';
import {setUpControl} from "@angular/forms/src/directives/shared";

import {TocService} from "../toc/toc.service";
import {NgForm} from "@angular/forms";
import {WithSave} from "../../../guards/with.save.interface";
import {SectionsService} from "../../../service/sections/sections.service";
import {Section} from "../../../service/indexed-db/objects-database";

@Component({
  templateUrl: './section.component.html',


})

export class SectionComponent implements OnInit, WithSave {
  constructor( private sp: ActivatedRoute, private  router : Router,private tocService:TocService, private sectionsService:SectionsService) {
    this.tocService.getActiveNode().subscribe(x=>{
      console.log(x);
      this.currentNode=x;
    });

  }
  section:any;
  backup:any;
  currentNode:any;

  @ViewChild('editForm')
  private editForm: NgForm;

  ngOnInit() {

    this.sp.data.map(data =>data.currentSection).subscribe(x=>{
      console.log(this.section);
      this.backup=x;
      this.section=_.cloneDeep(this.backup);
    });


  }

  save(): Promise<any>{

   this.tocService.getActiveNode().subscribe(x=>{

       console.log("saving");
       let node= x;
       if(this.section.id===node.data.id){
         node.data.label= _.cloneDeep(this.section.label);

       }

      }
    );
    let s= new Section();
    s.id=this.section.id;
    s.changeType="EDITED";
    s.description=this.section.description;
    return this.sectionsService.saveSection(s);



  }
  reset(){
    this.section=_.cloneDeep(this.backup);
  }

  getCurrent(){
    return this.section;
  }
  getBackup(){
    return this.backup;
  }

  isValid(){
    return !this.editForm.invalid;
  }

}
