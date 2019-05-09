import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.scss'],
})
export class MetadataFormComponent implements OnInit {

  model: Array<{
    key: string;
    data: IMetadataField,
  }>;
  metadataForm: FormGroup;
  constructor() { }

  @Input()
  set metadataModel(model: MetadataModel<any>) {
    const formGroup = new FormGroup({});
    this.model = [];
    for (const field of Object.keys(model)) {
      if (model.hasOwnProperty(field)) {
        formGroup.addControl(field, new FormControl(model[field].value, model[field].validators));
        this.model.push({
          key: field,
          data: model[field],
        });
      }
    }
    this.metadataForm = formGroup;
  }

  ngOnInit() {
  }

}

export type MetadataModel<T> = {
  [P in keyof T]?: IMetadataField;
};

export interface IMetadataField {
  label: string;
  type: FieldType;
  value: any;
  enum: Array<{
    value: string;
    label: string;
  }>;
  viewOnly: boolean;
  placeholder: string;
  id: string;
  name: string;
  validators: ValidatorFn[];
}

export type FieldType = 'TEXT' | 'RICH' | 'SELECT' | 'STRING_LIST';
