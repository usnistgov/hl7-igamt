import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Guid} from 'guid-typescript';
import {Table} from 'primeng/table';
import {Scope} from '../../constants/scope.enum';
import {Type} from '../../constants/type.enum';
import {IAddingInfo} from '../../models/adding-info';
import {IDisplayElement} from '../../models/display-element.interface';
@Component({
  selector: 'app-select-messages',
  templateUrl: './select-messages.component.html',
  styleUrls: ['./select-messages.component.scss'],
})
export class SelectMessagesComponent implements OnInit {

  @Input()
  table: any;
  @ViewChild(NgForm) form;
  @ViewChild('dt1')
  tableRef: Table;
  selectedData: IAddingInfo[] = [];
  @Output()
  selected = new EventEmitter<string>();
  @Output()
  messages = new EventEmitter<IAddingInfo[]>();
  @Input()
  selectedVersion: string;
  @Input()
  hl7Versions: string[] = [];
  @Input()
  @Input()
  existing: IDisplayElement[] = [];

  constructor() {
  }
  ngOnInit() {
  }
  filterTable(value) {
    this.tableRef.filteredValue = [];
    for (const row of this.tableRef.value) {
      let nameFilter = false;
      let descriptionFilter = false;
      if (row.data.name) {
        nameFilter  = this.includeFilter(value, row.data.name);
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
  selectMessageEvent(obj: any) {
      const element: IAddingInfo = {
        originalId: obj.id,
        id: Guid.create().toString(),
        type: Type.EVENT,
        name: obj.name,
        structId: obj.parentStructId,
        ext: '',
        description: obj.description,
        domainInfo: { version: obj.hl7Version , scope: Scope.USER},
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
  select($event: any) {
    this.selectedVersion = $event;
    this.selected.emit($event);
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
