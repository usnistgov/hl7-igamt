import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Table } from 'primeng/table';
import { Scope } from '../../constants/scope.enum';
import { Type } from '../../constants/type.enum';
import { IAddingInfo } from '../../models/adding-info';
import { ProfileType, Role } from '../../models/conformance-profile.interface';
import { IDisplayElement } from '../../models/display-element.interface';
@Component({
  selector: 'app-select-messages',
  templateUrl: './select-messages.component.html',
  styleUrls: ['./select-messages.component.scss'],
})
export class SelectMessagesComponent implements OnInit {
  table_: any[];
  @Input()
  set table($event) {
    this.table_ = $event;
    if ( this.filterValue ) {
      this.filterTable('');
    }
  }
  @ViewChild(NgForm) form;
  @ViewChild('dt1')
  tableRef: Table;
  selectedData: IAddingInfo[] = [];
  @Output()
  selected = new EventEmitter<{ version: string, scope: Scope }>();
  @Output()
  messages = new EventEmitter<IAddingInfo[]>();
  @Input()
  selectedVersion: string;
  @Input()
  selectedScope: Scope = Scope.HL7STANDARD;
  @Input()
  existing: IDisplayElement[] = [];
  @Input()
  hl7Versions: string[];
  filterValue: string;

  constructor() {
  }
  ngOnInit() {
  }
  filterTable(value: string) {
    this.filterValue = value;
    this.tableRef.filteredValue = [];
    for (const row of this.tableRef.value) {
      let nameFilter = false;
      let descriptionFilter = false;
      if (row.data.name) {
        nameFilter = this.includeFilter(value, row.data.name);
      }
      if (row.data.description) {
        descriptionFilter = this.includeFilter(value, row.data.description);
      }
      const eventsFilter = row.children.filter((node: any) => {
        return this.includeFilter(value, node.data.name);
      }).length > 0;
      if (nameFilter || descriptionFilter || eventsFilter) {
        this.tableRef.filteredValue.push(row);
      }
    }
  }
  includeFilter(input: string, value: string) {
    if (input == null || input.length === 0) {
      return true;
    } else {
      return value.toUpperCase().includes(input.toUpperCase());
    }
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
  selectMessageEvent(obj: any) {
    const element: IAddingInfo = {
      originalId: obj.id,
      id: Guid.create().toString(),
      type: Type.EVENT,
      name: obj.name,
      structId: obj.parentStructId,
      ext: '',
      description: obj.description,
      role: Role.SenderAndReceiver,
      profileType: ProfileType.Constrainable,
      domainInfo: { version: obj.hl7Version, scope: Scope.USER },
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
  emitData() {
    this.messages.emit(this.selectedData);
  }
  getFixedName(structId: string, name: string) {
    return structId + name;
  }
  isValid() {
    if (this.form) {
      return this.form.valid && this.selectedData.length > 0;
    } else {
      return this.selectedData.length > 0;
    }
  }
}
