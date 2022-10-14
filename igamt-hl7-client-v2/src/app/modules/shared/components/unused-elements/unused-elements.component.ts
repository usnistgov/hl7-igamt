import { Scope } from './../../constants/scope.enum';
import { filter } from 'rxjs/operators';
import { IDisplayElement } from './../../models/display-element.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-unused-elements',
  templateUrl: './unused-elements.component.html',
  styleUrls: ['./unused-elements.component.scss'],
})
export class UnusedElementsComponent implements OnInit {

  hl7_data: IDisplayElement[]=[];
  hl7_data_group: any ={};
  user_derived: IDisplayElement[]=[];
  user_owned: IDisplayElement[]=[];
  user_data_group: any = {};

  constructor(
    public dialogRef: MatDialogRef<UnusedElementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.hl7_data = this.data.resources.filter((x)=> x.domainInfo.scope === Scope.HL7STANDARD);

    this.hl7_data_group = _.groupBy(this.hl7_data,(x) => x.domainInfo.version);

    this.user_owned = this.data.resources.filter((x)=> x.domainInfo.scope === Scope.USER);


    this.user_data_group =_.groupBy(this.user_owned,(x) => this.getVersions(x));
    // this.user_derived = this.data.resource.filter((x)=> x.domainInfo.scope === Scope.HL7STANDARD);
    this.user_owned = this.data.resources.filter((x)=> x.domainInfo.scope === Scope.USER);




  }

  ngOnInit() {


  }

  getVersions(x){
    if(x.domainInfo.version && x.domainInfo.version.indexOf('.')>-1){
     return x.domainInfo.version;
    }else {
      return " *";
    }

  }
  submit(){
    this.dialogRef.close(this.data.ids);
  }

  close(){
    this.dialogRef.close();
  }

  checkAll(items: IDisplayElement []){

    this.data.ids = _.union(this.data.ids, _.map(items, (x) => x.id ));

  }

  uncheckAll(items){

    this.data.ids = _.difference(this.data.ids, _.map(items, (x) => x.id ));

  }

}
