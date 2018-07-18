import { Component, OnInit } from '@angular/core';
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {WorkspaceService} from "../../../service/workspace/workspace.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as _ from 'lodash';
import {FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from "@angular/forms";
import {Types} from "../../../common/constants/types";
import {CopyService} from "./copy.service";
import {SectionsService} from "../../../service/sections/sections.service";
@Component({
  selector: 'app-copy-element',
  templateUrl: './copy-element.component.html',
  styleUrls: ['./copy-element.component.css']
})
export class CopyElementComponent extends PrimeDialogAdapter{
  igDocumentId="";
  name="";
  ext="";
  type="";
  userExt="";
  id={};
  wrapper:any={};
  namingIndicators = [];
  namingForm:FormGroup;


  constructor(private router: Router, private route: ActivatedRoute,private copyService:CopyService ) {
    super();

    this.namingForm= new FormGroup({

      'ext':new FormControl(
        this.userExt,
        [this.duplicationValidator(this.name+this.userExt),this.conventionValidator(this.userExt),Validators.required,Validators.minLength(4),Validators.maxLength(4) ] )
      ,
      'name':new FormControl(
        this.name,
        [ Validators.required] )
    });
  }

  ngOnInit() {
    // Mandatory
    super.hook(this);
  }


  onDialogOpen() {
    // Init code
  }

  close() {

    this.dismissWithNoData();
  }

  closeWithData(data: any) {
    this.dismissWithData(data);
  }




  isDuplicated(name){
    return this.namingIndicators.indexOf(name)>-1;


  }


  duplicationValidator(obj: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      return !this.isDuplicated(this.name+this.userExt) ? null: {'duplicated': {value: control.value}};
    };

  }

  conventionValidator(obj: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      return !this.validConvention(this.userExt) ? {'invalidConvention': {value: control.value}} : null;
    };

  }

  validConvention(ext){
    if(this.type==Types.DATATYPE.toString()){

      return ext.length>0 && this.isLetter(ext.substring(0,1))|| !ext.length

    }else {
      return true;
    }

  }

  isLetter(str) {

  return str.length === 1 && str.match(/[a-z]/i);

  }
  submit(){

    this.wrapper.igId=this.igDocumentId;
    this.wrapper.id=this.id;
    this.wrapper.name=this.name;
    if(this.type !== Types.TEXT.toString()){
      this.wrapper.ext=this.userExt;

    }



    this.copyService.copyElement(this.wrapper, this.type).subscribe(
      res => {
        console.log(res);
        this.closeWithData(res);
      }
    )

  }


  print(obj){
    console.log(obj);
  }
}
