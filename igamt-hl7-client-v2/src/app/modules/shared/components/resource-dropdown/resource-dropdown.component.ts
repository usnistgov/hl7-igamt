import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  _id: string;

  @Input()
  placeholder: string;
  @Input()
  name: string;
  @Input()
  filter: boolean;

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

  @Output()
  valueChange: EventEmitter<IDisplayElement> = new EventEmitter<IDisplayElement>();

  @Input()
  set resources(list: IDisplayElement[]) {
    this.resourceMap = {};
    this._resources = list;
    list.forEach((elm) => {
      this.resourceMap[elm.id] = elm;
    });
    this.initSelection();
  }
  get resources() {
    return this._resources;
  }

  selectedResource: IDisplayElement;

  change($event: IDisplayElement) {
    this._id = $event.id;
    this.idChange.emit($event.id);
    this.valueChange.emit($event);
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
