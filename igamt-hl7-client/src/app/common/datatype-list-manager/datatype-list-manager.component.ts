import {Component, OnInit, Input, ViewChild} from '@angular/core';

import * as _ from 'lodash';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'datatype-list-manager',
  templateUrl: './datatype-list-manager.component.html',
  styleUrls: ['./datatype-list-manager.component.css']
})
export class DatatypeListManagerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  scopeTarget:string;

  @Input()
  list:any;

  dest:any=[];

  @ViewChild(NgForm) addingForm ;

  ccRegex: RegExp = /[0-9]{1}[0-9]{1}$/;

  cc: string;



  add(elm) {

    let x: any = {};
    var copy =_.cloneDeep(elm);

    x.domainInfo =copy.domainInfo;
    x.domainInfo.scope = this.scopeTarget;
    x.name = copy.name;
    x.ext = copy.ext;
    x.flavor = true;
    x.sourceScope=elm.domainInfo.scope;
    x.description = copy.description;
    x.id=copy.id;
    this.dest.push(x);
  }

  remove(elm) {
    let index = this.dest.indexOf(elm);
    if (index > -1) {
      this.dest.splice(index, 1);
    }
  }

  getScopeLabel(elm) {

    let scope =elm.domainInfo.scope;
    if (scope === 'HL7STANDARD') {
      return 'HL7';
    } else if (scope === 'USER') {
      return 'USR';
    } else if (scope === 'MASTER') {
      return 'MAS';
    } else if (scope=== 'PRELOADED') {
      return 'PRL';
    } else if (scope === 'PHINVADS') {
      return 'PVS';
    } else {
      return null ;
    }

  }

  getAdded(){
    return this.dest;
  }

  isValid(){

    return this.addingForm.form.valid;
  }
  print(elm){
    console.log(elm);

  }



}
