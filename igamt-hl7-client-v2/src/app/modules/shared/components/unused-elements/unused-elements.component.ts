import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-unused-elements',
  templateUrl: './unused-elements.component.html',
  styleUrls: ['./unused-elements.component.scss'],
})
export class UnusedElementsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UnusedElementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  submit(){
    this.dialogRef.close(this.data.ids);
  }

  close(){
    this.dialogRef.close();
  }

}
