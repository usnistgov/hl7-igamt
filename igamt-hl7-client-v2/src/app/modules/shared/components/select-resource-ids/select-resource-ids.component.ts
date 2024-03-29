import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-select-resource-ids',
  templateUrl: './select-resource-ids.component.html',
  styleUrls: ['./select-resource-ids.component.css'],
})
export class SelectResourceIdsComponent implements OnInit {

  @Input()
  resources: IDisplayElement[];
  @Output()
  selected: EventEmitter<string[]> = new EventEmitter<string[]>();
  ids: string[] = [];
  constructor() { }

  ngOnInit() {
  }

  emit() {
    this.selected.emit(this.ids);
  }
}

export interface ISelectedIds {
  conformanceProfilesId?: string[];
  compositeProfilesId?: string[];
  datatypes?: string[];
}
