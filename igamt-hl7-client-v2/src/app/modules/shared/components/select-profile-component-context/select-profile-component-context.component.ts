import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Type } from '../../constants/type.enum';
import { IDisplayElement } from '../../models/display-element.interface';

@Component({
  selector: 'app-select-profile-component-context',
  templateUrl: './select-profile-component-context.component.html',
  styleUrls: ['./select-profile-component-context.component.css'],
})
export class SelectProfileComponentContextComponent implements OnInit {

  @Input()
  selectedType = Type.CONFORMANCEPROFILE;
  availableContexts_: IDisplayElement[] = [];
  table: IDisplayElement[] = [];
  @Input()
  selectedMap = {};

  @Input()
  set availableContexts($event) {
    this.availableContexts_ = $event;
    this.table = $event.filter((x) => x.type === this.selectedType);
  }
  @Input()
  children: IDisplayElement[] = [];
  @Output() selected = new EventEmitter<IDisplayElement[]>();
  constructor() {
  }

  ngOnInit() {
  }

  selectType($event) {
    this.selectedType = $event;
    this.table = this.availableContexts_.filter((x) => x.type === this.selectedType);
  }

  selectElement(elm: IDisplayElement) {
    this.children.push(elm);
    this.selected.emit(this.children);
  }

  removeElement(elm: IDisplayElement) {
    const index = this.children.indexOf(elm, 0);
    if (index > -1) {
      this.children.splice(index, 1);
      this.selectedMap[elm.id] = false;
    }
  }
}
