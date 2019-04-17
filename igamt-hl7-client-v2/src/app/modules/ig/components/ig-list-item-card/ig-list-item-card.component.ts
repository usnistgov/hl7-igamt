import { Component, Input, OnInit } from '@angular/core';
import { IgListItem } from '../../models/ig/ig-list-item.class';

@Component({
  selector: 'app-ig-list-item-card',
  templateUrl: './ig-list-item-card.component.html',
  styleUrls: ['./ig-list-item-card.component.scss'],
})
export class IgListItemCardComponent implements OnInit {

  @Input() igListItem: IgListItem;
  @Input() controls: IgListItemControl[];
  moreInfo: boolean;

  constructor() { }

  ngOnInit() {
    this.moreInfo = false;
  }
}

export interface IgListItemControl {
  label: string;
  class: string;
  icon: string;
  action: (item: IgListItem) => void;
  disabled: (item: IgListItem) => boolean;
}
