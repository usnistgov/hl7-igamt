import { IUserConfig } from './../../../shared/models/config.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';

@Component({
  selector: 'app-configuration-dialog',
  templateUrl: './configuration-dialog.component.html',
  styleUrls: ['./configuration-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
  }
  submit(config: IUserConfig){
    this.dialogRef.close(config);
  }
  close(){
    this.dialogRef.close();
  }


}
