import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-metadata-attribute-config',
  templateUrl: './metadata-attribute-config.component.html',
  styleUrls: ['./metadata-attribute-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataAttributeConfigComponent implements OnInit {

  customAttr: any[] = [];

  inputName: string;

  constructor(public dialogRef: MatDialogRef<MetadataAttributeConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  addField() {

    this.customAttr.push({
      label: 'Label',
      type: 'TEXT',
      placeholder: '',
      id: 'New Field',
      name: 'New Field',
      validators: [],
      custom : true,
      position: this.customAttr.length,
    });
  }
  submit() {
    this.dialogRef.close(this.inputName);
  }
  cancel() {
    this.dialogRef.close();
  }
}
