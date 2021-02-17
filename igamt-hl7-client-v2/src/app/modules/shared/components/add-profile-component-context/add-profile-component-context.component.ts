import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-add-profile-component-context',
  templateUrl: './add-profile-component-context.component.html',
  styleUrls: ['./add-profile-component-context.component.css'],
})
export class AddProfileComponentContextComponent implements OnInit {

  added: IDisplayElement[] = [];
  existing = {};

  constructor(  public dialogRef: MatDialogRef<AddProfileComponentContextComponent>,
                @Inject(MAT_DIALOG_DATA) public data: IAddProfileComponentContextData) {
    if (data.pc.children) {
    this.data.pc.children.forEach((x) => {
      this.existing[x.id] = true;
    });
    }
  }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.added);
  }
  cancel() {
    this.dialogRef.close();
  }

  onSelect($event: IDisplayElement[] ) {
    this.added = $event;
  }
}

export interface IAddProfileComponentContextData {
  pc: IDisplayElement;
  available: IDisplayElement[];
}
