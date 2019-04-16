import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import * as _ from 'lodash';

import {TocService} from "../service/toc.service";
import {NgForm} from "@angular/forms";
import {WithSave} from "../../../guards/with.save.interface";
import {SectionsService} from "../../../service/sections/sections.service";
import {IgErrorService} from "../ig-error/ig-error.service";
import {HasFroala} from "../../../configuration/has-froala";

@Component({
  templateUrl: './section.component.html',

})

export class SectionComponent extends HasFroala implements OnInit, WithSave {
  constructor( private sp: ActivatedRoute, private  router : Router,private tocService:TocService,private ref: ChangeDetectorRef, private sectionsService:SectionsService, private igErrorService:IgErrorService) {
  super();
  }
  section:any;
  backup:any;
  currentNode:any;
  sectionId:any;
  path:any;

  @ViewChild('editForm')
  private editForm: NgForm;

  ngOnInit() {

    this.sectionId= this.sp.snapshot.params["sectionId"];
    console.log("======================this.sectionId");

    console.log(this.sectionId);

    this.sp.data.map(data =>data.currentSection).subscribe(x=>{
      this.backup=x;
      console.log("xxxxxx=====");
      this.tocService.getPathTree().subscribe(x=>{

        if(x){
          console.log(x);
          console.log("path for id "+this.sectionId +"====is "+ x[this.sectionId])
          this.path=x[this.backup.id];
         // this.ref.detectChanges();
          console.log(this.path);

         // this.ref.detectChanges();
        }

      });



      this.section=_.cloneDeep(this.backup);


      //console.log(this.section);
    });





  }

  save(): Promise<any>{
    return new Promise((resolve, reject)=>{

       let treeModel=this.tocService.getTreeModel();
       let node = treeModel.getNodeById(this.section.id);

         console.log(node);

      node.data.data=this.section;

      this.tocService.setTreeModel(treeModel).then(x=>{
        this.backup=_.cloneDeep(this.section);
        this.editForm.control.markAsPristine();
           resolve(true);

         },error=>{
           reject(error);
         })
       }
     )
  };

  reset(){
    this.section=_.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();
  }

  getCurrent(){
    return this.section;
  }
  getBackup(){
    return this.backup;
  }

  canSave(){
    return !this.editForm.invalid;
  }

  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;
  }

  ngAfterViewInit() {







  }


}
