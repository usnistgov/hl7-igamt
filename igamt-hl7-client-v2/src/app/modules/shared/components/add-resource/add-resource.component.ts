import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Scope} from '../../constants/scope.enum';
import {Type} from '../../constants/type.enum';
import {IAddingInfo, SourceType} from '../../models/adding-info';
import {IDisplayElement} from '../../models/display-element.interface';
@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.css'],
})
export class AddResourceComponent implements OnInit {
  model: IAddingInfo;
  @ViewChild(NgForm) child;
  redirect = true;

  constructor(public dialogRef: MatDialogRef<AddResourceComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IAddResourceData) {
    this.model = {
      originalId: null,
      id: null,
      name: '',
      type: this.data.type,
      ext: '',
      flavor : true,
      includeChildren : true,
      url : ''};
  }

  ngOnInit() {
  }
  submit() {
    this.dialogRef.close(this.model);
  }

  cancel() {
    this.dialogRef.close();
  }

  isValid() {
    return this.child && this.child.isValid();
  }
}
export class IAddResourceData {
  existing?: IDisplayElement[];
  type?: Type;
  title?: string;
  scope?: Scope;
}
