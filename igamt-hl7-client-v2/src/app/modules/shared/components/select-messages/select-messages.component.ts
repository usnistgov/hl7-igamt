import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Guid} from 'guid-typescript';
import {Table} from 'primeng/table';
import {Type} from '../../constants/type.enum';
import {IAddingInfo} from '../../models/adding-info';

@Component({
  selector: 'app-select-messages',
  templateUrl: './select-messages.component.html',
  styleUrls: ['./select-messages.component.scss'],
})
export class SelectMessagesComponent implements OnInit {

  @Input()
  table: any;
  @ViewChild('dt1') tableRef: Table;
  selectedData: IAddingInfo[] = [];
  @Output() selected = new EventEmitter<string>();
  @Output() messages = new EventEmitter<IAddingInfo[]>();
  selectedVersion: string;
  @Input()
  hl7Versions: string[] = [];

  constructor() {
  }
  ngOnInit() {
  }
  filterTable(value) {
    this.tableRef.filteredValue = [];
    for (const row of this.tableRef.value) {
      const nameFilter = row.data.name.includes(value);
      const descriptionFilter = row.data.description.includes(value);
      const eventsFilter = row.children.filter((node: any) => {
        return node.data.name.includes(value);
      }).length > 0;
      if (nameFilter || descriptionFilter || eventsFilter) {
        this.tableRef.filteredValue.push(row);
      }
    }
  }
  selectMessageEvent(obj: any) {
      const element = {
        originalId: obj.id,
        id: Guid.create().toString(),
        type: Type.EVENT,
        name: obj.name,
        structId: obj.parentStructId,
        ext: '',
        description: obj.description,
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
}
