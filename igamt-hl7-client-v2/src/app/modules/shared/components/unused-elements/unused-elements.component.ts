import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';
import { resourceAdapter } from './../../../../root-store/dam-igamt/igamt.loaded-resources.selectors';
import { Scope } from './../../constants/scope.enum';
import { IDisplayElement } from './../../models/display-element.interface';
import { DeleteListConfirmationComponent } from './../delete-list-confirmation/delete-list-confirmation.component';

@Component({
  selector: 'app-unused-elements',
  templateUrl: './unused-elements.component.html',
  styleUrls: ['./unused-elements.component.scss'],
})
export class UnusedElementsComponent implements OnInit {

  hl7_data: IDisplayElement[] = [];
  hl7_data_group: any = {};
  user_derived: IDisplayElement[] = [];
  user_owned: IDisplayElement[] = [];
  phinvads_owned: IDisplayElement[] = [];
  user_data_group: any = {};
  phinvads_owned_group: any = {};
  selected: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<UnusedElementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,     private dialog: MatDialog,

  ) {
    this.data.ids = [];
    this.hl7_data = this.data.resources.filter((x) => x.domainInfo.scope === Scope.HL7STANDARD);

    this.hl7_data_group = _.groupBy(this.hl7_data, (x) => x.domainInfo.version);

    this.user_owned = this.data.resources.filter((x) => x.domainInfo.scope === Scope.USER);

    this.user_data_group = _.groupBy(this.user_owned, (x) => this.getVersions(x));

    this.phinvads_owned = this.data.resources.filter((x) => x.domainInfo.scope === Scope.PHINVADS);
    this.phinvads_owned_group = _.groupBy(this.phinvads_owned, (x) => this.getVersions(x));

  }

  ngOnInit() {

  }

  getVersions(x) {
    if (x.domainInfo.version && x.domainInfo.version.indexOf('.') > -1) {
     return x.domainInfo.version;
    } else {
      return ' *';
    }
  }

  submit() {

    const selected = this.data.resources.filter((x) => _.indexOf(this.data.ids, x.id) > -1 );
    console.log(selected);
    const dialogRef = this.dialog.open(DeleteListConfirmationComponent, {

      data: {
        resources: this.data.resources.filter((x) => _.indexOf(this.data.ids, x.id) > -1).sort((a, b) => a.fixedName + a.variableName - b.fixedName + b.variableName ),
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.dialogRef.close(this.data.ids);
        }
      },
    );

  }

  close() {
    this.dialogRef.close();
  }

  checkAll(items: IDisplayElement []) {

    this.data.ids = _.union(this.data.ids, _.map(items, (x) => x.id ));

  }

  uncheckAll(items) {

    this.data.ids = _.difference(this.data.ids, _.map(items, (x) => x.id ));

  }
  checkStatus(items: IDisplayElement[]) {
    const diff =  _.difference( _.map(items, (x) => x.id ), this.data.ids);
    if (diff.length === 0) {
      return 'ALL';
    } else if (diff.length === items.length) {
      return 'NONE';
    } else { return 'SOME'; }
  }

  getSelected(items: IDisplayElement[]) {
    const diff =  _.difference( _.map(items, (x) => x.id ), this.data.ids);
    return  items.length - diff.length;
  }

}
