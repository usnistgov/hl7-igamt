import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.scss'],
})
export class MetadataFormComponent implements OnInit, OnDestroy {

  model: Array<{
    key: string;
    data: IMetadataField,
  }>;
  metadataForm: FormGroup;
  @Output()
  dataChange: EventEmitter<FormGroup>;
  viewOnly: boolean;

  changesSubscription: Subscription;
  dataSubscription: Subscription;
  viewOnlySubscription: Subscription;

  constructor() {
    this.dataChange = new EventEmitter<FormGroup>();
  }

  initializeForm(model: MetadataModel<any>) {
    const formGroup = new FormGroup({});
    this.model = [];
    for (const field of Object.keys(model)) {
      if (model.hasOwnProperty(field)) {
        formGroup.addControl(field, new FormControl('', model[field].validators));
        this.model.push({
          key: field,
          data: model[field],
        });
      }
    }
    this.metadataForm = formGroup;
  }

  @Input()
  set metadataFormInput(input: IMetadataFormInput<any>) {

    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.viewOnlySubscription) {
      this.viewOnlySubscription.unsubscribe();
    }

    this.initializeForm(input.model);

    this.viewOnlySubscription = input.viewOnly.subscribe(
      (vOnly) => this.viewOnly = vOnly,
    );
    this.dataSubscription = input.data.subscribe(
      (data) => {
        console.log(data);
        this.metadataForm.patchValue(data, { emitEvent: false });
      },
    );
    this.changesSubscription = this.metadataForm.valueChanges.subscribe(
      (change) => {
        this.dataChange.emit(this.metadataForm);
      },
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.viewOnlySubscription) {
      this.viewOnlySubscription.unsubscribe();
    }
  }

}

export interface IMetadataFormInput<T> {
  viewOnly: Observable<boolean>;
  data: Observable<T>;
  model: MetadataModel<T>;
}

export type MetadataModel<T> = {
  [P in keyof T | any]?: IMetadataField;
};

export interface IMetadataField {
  label: string;
  type: FieldType;
  enum?: Array<{
    value: string;
    label: string;
  }>;
  disabled?: boolean;
  placeholder: string;
  id: string;
  name: string;
  validators: ValidatorFn[];
}

export enum FieldType {
  TEXT = 'TEXT',
  RICH = 'RICH',
  SELECT = 'SELECT',
  STRING_LIST = 'STRING_LIST',
  FILE = 'FILE',
}
