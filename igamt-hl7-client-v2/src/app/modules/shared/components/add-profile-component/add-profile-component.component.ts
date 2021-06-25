import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ICreateProfileComponent} from '../../../document/models/toc/toc-operation.class';
import {Type} from '../../constants/type.enum';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-add-profile-component',
  templateUrl: './add-profile-component.component.html',
  styleUrls: ['./add-profile-component.component.css'],
})
export class AddProfileComponentComponent implements OnInit {
  model: ICreateProfileComponent = {
    children: [],
    name: '',
  };
  table: IDisplayElement[];
  constructor(  public dialogRef: MatDialogRef<AddProfileComponentComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    this.table = this.data.children;
  }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.model);
  }
  cancel() {
    this.dialogRef.close();
  }

  onSelect($event: IDisplayElement[]) {
    this.model.children = $event;
  }
}
