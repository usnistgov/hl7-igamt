import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-mapping-dialg',
  templateUrl: './add-mapping-dialg.component.html',
  styleUrls: ['./add-mapping-dialg.component.css'],
})
export class AddMappingDialgComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddMappingDialgComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  select(value: any, display: any) {
    this.dialogRef.close({value, display});
  }

  cancel() {
    this.dialogRef.close();
  }
}
