import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MetadataAttributeConfigComponent } from '../metadata-attribute-config/metadata-attribute-config.component';

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

  @Output()
  modelChange: EventEmitter<Array<{
    key: string;
    data: IMetadataField
  }>> = new EventEmitter<Array<{
    key: string;
    data: IMetadataField
  }>>();
  viewOnly: boolean;

  changesSubscription: Subscription;
  dataSubscription: Subscription;
  viewOnlySubscription: Subscription;
  @Input()
  froalaConfig: any;

  constructor(private dialog: MatDialog) {
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
    console.log('input');

    console.log(input.model);
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
        this.metadataForm.patchValue(data, { emitEvent: false });
      },
    );
    this.changesSubscription = this.metadataForm.valueChanges.subscribe(
      (change) => {
        console.log(this.metadataForm);
        this.dataChange.emit(this.metadataForm);
      },
    );
  }

  ngOnInit() {
  }

  openCustomAttributeDialog() {
    const dialogRef = this.dialog.open(MetadataAttributeConfigComponent, {
      data: { form: this.model },
    });
    dialogRef.afterClosed().pipe(
      filter((res) => res !== undefined),
      map((result: any) => {

        for (const field of result) {
          this.metadataForm.addControl(field.name, new FormControl('', field.validators));
          this.model.splice(this.model.length - 1, 0, { key: field.name, data: field });
        }
        this.modelChange.emit(this.model);

      }),
    ).subscribe();
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
  addBefore?: boolean;
  custom?: boolean;
  position?: number;
}

export enum FieldType {
  TEXT = 'TEXT',
  RICH = 'RICH',
  SELECT = 'SELECT',
  STRING_LIST = 'STRING_LIST',
  FILE = 'FILE',
}
