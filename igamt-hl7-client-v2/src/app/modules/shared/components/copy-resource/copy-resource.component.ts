import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectIsAdmin} from '../../../dam-framework/store/authentication';
import {IAddingInfo} from '../../models/adding-info';
import {ICopyResourceData} from '../../models/copy-resource-data';
import {SelectNameComponent} from '../select-name/select-name.component';

@Component({
  selector: 'app-copy-resource',
  templateUrl: './copy-resource.component.html',
  styleUrls: ['./copy-resource.component.css'],
})
export class CopyResourceComponent implements OnInit {

  @ViewChild(SelectNameComponent) child;

  flavor: IAddingInfo;
  redirect = true;
  master$: Observable<boolean>;

  constructor(public dialogRef: MatDialogRef<CopyResourceComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ICopyResourceData, private store: Store<any>) {
    this.master$ = this.store.select(selectIsAdmin);
  }

  ngOnInit() {
  }
  selected($event: IAddingInfo) {
    this.flavor = $event;
  }

  submit() {
    this.dialogRef.close({redirect: this.redirect, flavor: this.flavor});
  }
  cancel() {
    this.dialogRef.close();
  }

  isValid() {
    return this.child && this.child.isValid();
  }

}
