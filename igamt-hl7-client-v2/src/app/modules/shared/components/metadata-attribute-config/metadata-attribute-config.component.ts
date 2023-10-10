import { FieldType, IMetadataField } from './../metadata-form/metadata-form.component';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-metadata-attribute-config',
  templateUrl: './metadata-attribute-config.component.html',
  styleUrls: ['./metadata-attribute-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetadataAttributeConfigComponent implements OnInit {

  customAttr : IMetadataField[] = [];

  inputName: string;

  constructor(public dialogRef: MatDialogRef<MetadataAttributeConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {


  }

  ngOnInit() {
  }

  addField(){

    this.customAttr.push({
      label: "TESTING",
      type: FieldType.TEXT,
      placeholder: "",
      id: "New Field",
      name: "New Field",
      validators: [],
      custom : true,
      position: this.customAttr.length
    })
  }
  submit(){
    this.dialogRef.close(this.inputName);
  }
  cancel() {
    this.dialogRef.close();
  }
}
