import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IBindingType} from '../../models/binding.interface';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-binding-selector',
  templateUrl: './binding-selector.component.html',
  styleUrls: ['./binding-selector.component.css'],
})
export class BindingSelectorComponent implements OnInit {
  selectedValue: IBindingType = IBindingType.VALUESET;
  selectedValueSet: IDisplayElement;

  constructor(public dialogRef: MatDialogRef<BindingSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IBindingSelectorData) {

  }

  ngOnInit() {
  }

  submit() {

  }

  cancel() {

  }
}

export interface IBindingLocationInfo {
  location: string;
  singleCodeAllowed?: boolean;
}

export interface IBindingSelectorData {
  resources?: IDisplayElement[];
  locationInfo: IBindingLocationInfo;
}
