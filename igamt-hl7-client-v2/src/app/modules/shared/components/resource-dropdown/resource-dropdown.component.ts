import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Dropdown } from 'primeng/primeng';
import { IDisplayElement } from '../../models/display-element.interface';

@Component({
  selector: 'app-resource-dropdown',
  templateUrl: './resource-dropdown.component.html',
  styleUrls: ['./resource-dropdown.component.scss'],
})
export class ResourceDropdownComponent implements OnInit {

  resourceMap: {
    [id: string]: IDisplayElement;
  } = {};
  _resources: IDisplayElement[];
  filtered: IDisplayElement[];
  _id: string;
  _filterValue: string;
  @Input()
  placeholder: string;
  @Input()
  name: string;
  @Input()
  appendTo: any;
  @Input()
  filter: boolean;
  @Input()
  required: boolean;
  @Input()
  set filterBy(value: string) {
    this._filterValue = value;
    this.filterList();
  }

  get filterBy(): string {
    return this._filterValue;
  }

  @Output()
  idChange: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  set id(i: string) {
    this._id = i;
    this.initSelection();
  }
  get id() {
    return this._id;
  }

  @ViewChild(Dropdown)
  dropdown: Dropdown;

  selectedResource: IDisplayElement;

  @Output()
  valueChange: EventEmitter<IDisplayElement> = new EventEmitter<IDisplayElement>();

  @Input()
  set resources(l: IDisplayElement[]) {
    this.resourceMap = {};
    const list = [...l];
    list.sort((a, b) => {
      return `${a.fixedName}${a.variableName}`.localeCompare(`${b.fixedName}${b.variableName}`);
    });
    this._resources = [...list];
    this.filtered = [...list];
    list.forEach((elm) => {
      this.resourceMap[elm.id] = elm;
    });
    this.initSelection();
    this.filterList();
  }

  get resources() {
    return this._resources;
  }

  filterFn = (value, elms) => {
    value = value.toLowerCase();
    return elms.filter((elm) => (elm.fixedName === value || (elm.fixedName && elm.fixedName.toLowerCase().includes(value))) || (elm.variableName === value || (elm.variableName && elm.variableName.toLowerCase().includes(value))));
  }

  change($event: IDisplayElement) {
    this._id = $event.id;
    this.idChange.emit($event.id);
    this.valueChange.emit($event);
  }

  filterList() {
    if (this.filterBy && this._resources) {
      this.filtered = this._resources.filter((elm) => elm.fixedName === this.filterBy);
    }
  }

  initSelection() {
    if (this.id && this.resourceMap && this.resourceMap[this.id]) {
      this.selectedResource = this.resourceMap[this.id];
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
