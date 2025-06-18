import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Table } from 'primeng/table';
import { Scope } from '../../constants/scope.enum';
import { Type } from '../../constants/type.enum';
import { IAddingInfo } from '../../models/adding-info';
import { IDisplayElement } from '../../models/display-element.interface';
import {IResource} from '../../models/resource.interface';

@Component({
  selector: 'app-select-segments',
  templateUrl: './select-segments.component.html',
  styleUrls: ['./select-segments.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,

})
export class SelectSegmentsComponent implements OnInit {
  @Input()
  table: any;
  @Input()
  existing: IDisplayElement[];
  @Input()
  documentType: Type;
  @Input()
  master: boolean;
  @ViewChild('dt1')
  tableRef: Table;
  selectedData: IAddingInfo[] = [];
  @Output()
  selected = new EventEmitter<{ version: string, scope: Scope }>();
  @Output()
  added = new EventEmitter<IAddingInfo[]>();
  @Output()
  valid = new EventEmitter<boolean>();
  @Input()
  selectedVersion: string;
  @Input()
  selectedScope: Scope;
  @Input()
  hl7Versions: string[] = [];
  @ViewChild(NgForm) form: NgForm ;

  constructor() {
  }
  ngOnInit() {
  }
  addAsIs(obj: any) {
    const element: IAddingInfo = {
      originalId: obj.id,
      id: obj.id,
      type: Type.SEGMENT,
      name: obj.name,
      ext: '',
      description: obj.description,
      domainInfo: obj.domainInfo,
      flavor: false,
    };
    this.selectedData.push(element);
    this.emitData();
  }
  addAsFlavor(obj: IResource) {
    const element: IAddingInfo = {
      originalId: obj.id,
      id: Guid.create().toString(),
      type: Type.SEGMENT,
      name: obj.name,
      fixedExt: obj.fixedExtension,
      description: obj.description,
      domainInfo: { ...obj.domainInfo, scope: Scope.USER },
      flavor: true,
    };
    this.selectedData.push(element);
    this.emitData();

  }
  unselect(selected: any) {
    const index = this.selectedData.indexOf(selected);
    if (index > -1) {
      this.selectedData.splice(index, 1);
    }
    this.emitData();
  }
  selectVersion($event: any) {
    this.selectedVersion = $event;
    this.selected.emit({
      version: $event,
      scope: this.selectedScope,
    });
  }
  selectScope($event: any) {
    this.selectedScope = $event;
    this.selected.emit({
      version: this.selectedVersion,
      scope: $event,
    });
  }
  emitData() {
    this.form.form.updateValueAndValidity();

    this.added.emit(this.selectedData);
  }
  isValid() {
    if (this.form) {
      return this.form.valid && this.selectedData.length > 0;
    } else {
      return this.selectedData.length > 0;
    }
  }
}
