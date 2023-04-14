import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Scope } from './../../constants/scope.enum';
import { IAddingInfo } from './../../models/adding-info';
import { IDisplayElement } from './../../models/display-element.interface';
import { IResourcePickerData } from './../../models/resource-picker-data.interface';
import { IResource } from './../../models/resource.interface';
import { ResourceService } from './../../services/resource.service';

import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Type } from '../../constants/type.enum';

@Component({
  selector: 'app-message-picker',
  templateUrl: './message-picker.component.html',
  styleUrls: ['./message-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagePickerComponent implements OnInit {
  selectedData: any[];
  toSubmit: IAddingInfo[] = [];
  canSave = false;
  step = 1;
  @ViewChild('child') child;
  data$: Observable<IResource[]> = of([]);
  constructor(public dialogRef: MatDialogRef<MessagePickerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IMessagePickerData, private resourceService: ResourceService ) {

    this.data$ = this.resourceService.importResource({ type: Type.EVENTS, scope: data.scope, version: data.version}).pipe(map((x) =>  x.data));

  }
  ngOnInit() {
  }

  select($event: string) {
    this.data$ = this.resourceService.importResource({ type: Type.EVENTS, scope: this.data.scope, version: $event}).pipe(map((x) =>  x.data));
  }

  selected($event: any[]) {
    console.log($event);
    this.selectedData = $event;
  }

  submit() {
    console.log(this.selectedData);
    this.dialogRef.close(this.selectedData);
  }
  cancel() {
    this.dialogRef.close();
  }

  isValid() {

    return this.child && this.child.isValid();
  }

  next() {
    this.toSubmit = this.toSubmit.concat(this.selectedData);
    this.selectedData = [];
    this.step = 2;
  }

  update(version: string, scope: Scope) {
    this.data$ = this.resourceService.importResource({ type: Type.EVENTS, scope, version}).pipe(map((x) =>  x.data));
  }
}

export interface IMessagePickerData {
  existing?: IDisplayElement[];
  versionChange?: (version: string) => void;
  versionAndScopeChange?: (version: string, scope: Scope) => void;
  hl7Versions: string[];
  data?: Observable<any[]>;
  version?: string;
  scope: Scope;
  context: IMessagePickerContext;

}

export enum IMessagePickerContext {
  CREATE = 'CREATE',
  ADD = 'ADD',
}
