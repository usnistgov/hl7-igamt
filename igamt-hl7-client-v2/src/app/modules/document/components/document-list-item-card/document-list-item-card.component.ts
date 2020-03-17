import { Component, Input, OnInit } from '@angular/core';
import { IgListItem } from '../../models/ig/ig-list-item.class';

@Component({
  selector: 'app-document-list-item-card',
  templateUrl: './document-list-item-card.component.html',
  styleUrls: ['./document-list-item-card.component.scss'],
})
export class DocumentListItemCardComponent implements OnInit {

  @Input() igListItem: IgListItem;
  @Input() controls: IDocumentListItemControl[];
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

export interface IDocumentListItemControl {
  label: string;
  class: string;
  icon: string;
  default?: boolean;
  action: (item: IgListItem) => void;
  disabled: (item: IgListItem) => boolean;
  hide?: (item: IgListItem ) => boolean;
}
