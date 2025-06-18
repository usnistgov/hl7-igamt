import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as config from '../../../../root-store/config/config.reducer';
import { MessageEventTreeData, MessageEventTreeNode } from '../../../document/models/message-event/message-event.class';
import { IgService } from '../../../ig/services/ig.service';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { IEvent } from '../../../shared/models/conformance-profile.interface';
import { ICreateMessageStructure } from '../../domain/structure-editor.model';

@Component({
  selector: 'app-create-message-dialog',
  templateUrl: './create-message-dialog.component.html',
  styleUrls: ['./create-message-dialog.component.scss'],
})
export class CreateMessageDialogComponent implements OnInit {

  messages$: Observable<MessageEventTreeNode[]>;
  hl7Version$: Observable<string[]>;
  selectedVersion: string;
  messageStructure: MessageEventTreeData;
  eventStub: IEvent = {
    id: undefined,
    name: '',
    parentStructId: undefined,
    description: '',
    type: Type.EVENT,
    hl7Version: undefined,
  };
  selectedScope = Scope.HL7STANDARD;
  formGroup: FormGroup;
  subFormGroup: FormGroup;
  readonly AXX_PATTERN = '[A-Z][A-Z0-9]{2}';
  readonly AXX_AXX_PATTERN = '[A-Z][A-Z0-9]{2}(_[A-Z][A-Z0-9]{2})?';
  patternsUserFriendlyDescription = {
    '^Z[A-Z0-9]{2}$': 'ZXX where X is an alphanumerical character',
    '^[A-Z][A-Z0-9]{2}(_[A-Z][A-Z0-9]{2})?$': 'AXX[_AXX] where A is a letter and X is an alphanumerical',
    '^[A-Z][A-Z0-9]{2}$': 'AXX where A is a letter and X is an alphanumerical',
  };

  get events() {
    return (this.formGroup.controls['events'] as FormArray).controls;
  }

  constructor(
    private igService: IgService,
    private store: Store<any>,
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<CreateMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.hl7Version$ = this.store.select(config.getHl7Versions);
    this.subFormGroup = this.builder.group({
      name: ['', [Validators.pattern(this.AXX_PATTERN), Validators.required]],
      description: [''],
    });
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.builder.group({
      name: ['', [Validators.pattern(this.AXX_AXX_PATTERN), Validators.required]],
      messageType: ['', [Validators.pattern(this.AXX_PATTERN), Validators.required]],
      description: ['', [Validators.required]],
      hl7Version: ['', [Validators.required]],
      events: this.builder.array([]),
    });
  }

  startFrom(metn: MessageEventTreeNode) {
    this.messageStructure = {
      ...metn.data,
    };

    const value = {
      name: metn.data.name,
      description: metn.data.description,
      messageType: metn.data.messageType,
      hl7Version: metn.data.hl7Version,
      events: [],
    };

    this.formGroup.patchValue(value);

    for (const event of metn.children) {
      (this.formGroup.controls['events'] as FormArray).controls.push(
        this.builder.group({
          name: [event.data.name, [Validators.pattern(this.AXX_PATTERN), Validators.required]],
          description: [event.data.description],
        }),
      );
    }
  }

  deleteEvent(i: number) {
    (this.formGroup.controls['events'] as FormArray).controls.splice(i, 1);
    this.formGroup.controls['events'].updateValueAndValidity();
  }

  getErrorText(label: string, control: FormControl): string[] {
    const errors = [];
    for (const property in control.errors) {
      if (property === 'required') {
        errors.push(label + ' is required');
        break;
      } else if (property === 'minlength') {
        errors.push(label + ' is too short');
        break;

      } else if (property === 'maxlength') {
        errors.push(label + ' is too long');
        break;

      } else if (property === 'pattern') {
        let error = 'Invalid ' + label + ' format';
        const requiredPattern = control.errors['pattern'].requiredPattern;
        if (requiredPattern && this.patternsUserFriendlyDescription[requiredPattern]) {
          error += ' name must follow the pattern ' + this.patternsUserFriendlyDescription[requiredPattern];
        }
        errors.push(error);
        break;
      } else if (control.errors[property]) {
        errors.push(control.errors[property]);
        break;
      }
    }
    return errors;
  }

  addEvent() {
    if (this.subFormGroup.valid) {
      const event: { name: string, description: string } = this.subFormGroup.getRawValue();
      (this.formGroup.controls['events'] as FormArray).controls.push(
        this.builder.group({
          name: [event.name, [Validators.pattern(this.AXX_PATTERN), Validators.required]],
          description: [event.description],
        }),
      );
      this.formGroup.controls['events'].updateValueAndValidity();
      this.subFormGroup.patchValue({ name: '', description: '' });
    }
  }

  clearSelection() {
    this.messageStructure = undefined;
    this.initFormGroup();
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    const value = this.formGroup.getRawValue();
    const query: ICreateMessageStructure = {
      structureId: value.name,
      messageType: value.messageType,
      description: value.description,
      from: this.messageStructure.id,
      events: value.events,
      version: value.hl7Version,
    };
    this.dialogRef.close(query);
  }

  getMessages($event) {
    this.messages$ = this.igService.getMessagesByVersionAndScope($event.version, $event.scope).pipe(
      map((messages) => {
        return messages.data;
      }),
    );
  }

  ngOnInit() {
  }

}
