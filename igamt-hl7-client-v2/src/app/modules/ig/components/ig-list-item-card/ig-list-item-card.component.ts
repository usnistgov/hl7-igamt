import { Component, Input, OnInit } from '@angular/core';
import { IgListItem } from '../../../document/models/document/ig-list-item.class';
import { Status } from './../../../shared/models/abstract-domain.interface';
import { IgDocumentStatusInfo } from './../../models/ig/ig-document.class';

@Component({
  selector: 'app-ig-list-item-card',
  templateUrl: './ig-list-item-card.component.html',
  styleUrls: ['./ig-list-item-card.component.scss'],
})

export class IgListItemCardComponent implements OnInit {

  @Input()
  set igListItem(item: IgListItem) {
    this._item = item;
    this.statusInfo = {
      derived: item.derived,
      deprecated: item.deprecated,
      draft: item.draft,
      published: item.status === Status.PUBLISHED,
      locked: item.status === Status.LOCKED,
    };
  }

  get igListItem() {
    return this._item;
  }

  @Input() controls: IgListItemControl[];
  moreInfo: boolean;
  statusInfo: IgDocumentStatusInfo;
  _item: IgListItem;

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
  disabled?: (item: IgListItem) => boolean;
  hide?: (item: IgListItem) => boolean;
}
