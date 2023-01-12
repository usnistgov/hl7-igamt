import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
