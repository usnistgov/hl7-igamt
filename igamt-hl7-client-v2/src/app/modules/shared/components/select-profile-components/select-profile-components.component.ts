import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-select-profile-components',
  templateUrl: './select-profile-components.component.html',
  styleUrls: ['./select-profile-components.component.css'],
})
export class SelectProfileComponentsComponent implements OnInit {

  availablePcs_:  IDisplayElement[] = [];
  table: IDisplayElement[] = [];
  @Input()
  selectedMap = {};

  @Input()
  set availablePcs($event) {
    this.availablePcs_ = $event;
  }
  @Input()
  children: IDisplayElement[] = [];
  @Output() selected = new EventEmitter<IDisplayElement[]>();
  constructor() {
  }

  ngOnInit() {
  }
  selectElement(elm: IDisplayElement) {
    this.children.push(elm);
    this.selectedMap[elm.id] = true;
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
