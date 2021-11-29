import { Component, Input, OnInit } from '@angular/core';
import {IgListItem} from '../../../document/models/document/ig-list-item.class';
@Component({
  selector: 'app-library-list-item-card',
  templateUrl: './library-list-item-card.component.html',
  styleUrls: ['./library-list-item-card.component.scss'],
})
export class LibraryListItemCardComponent implements OnInit {

  @Input() igListItem: IgListItem;
  @Input() controls: IgListItemControl[];
  moreInfo: boolean;

  constructor() {
  }

  doDefault() {
    const ctrls = this.controls.filter((control) => control.default);
    if (ctrls.length > 0) {
      ctrls[0].action(this.igListItem);
    }
  }

  ngOnInit() {
    this.moreInfo = false;
  }
}

export interface IgListItemControl {
  label: string;
  class: string;
  icon: string;
  default?: boolean;
  action: (item: IgListItem) => void;
  disabled: (item: IgListItem) => boolean;
  hide?: (item: IgListItem ) => boolean;
}
