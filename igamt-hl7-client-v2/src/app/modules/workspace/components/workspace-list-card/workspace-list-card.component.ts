import { Component, Input, OnInit } from '@angular/core';
import { IWorkspaceListItem } from './../../../shared/models/workspace-list-item.interface';

@Component({
  selector: 'app-workspace-list-card',
  templateUrl: './workspace-list-card.component.html',
  styleUrls: ['./workspace-list-card.component.scss'],
})
export class WorkspaceListCardComponent implements OnInit {

  @Input() item: IWorkspaceListItem;
  @Input() controls: IWorkspaceListItemControl[];
  moreInfo: boolean;

  constructor() {
  }

  doDefault() {
    const ctrls = this.controls.filter((control) => control.default);
    if (ctrls.length > 0) {
      ctrls[0].action(this.item);
    }
  }

  ngOnInit() {
    this.moreInfo = false;
  }
}

export interface IWorkspaceListItemControl {
  label: string;
  class: string;
  icon: string;
  default?: boolean;
  action: (item: IWorkspaceListItem) => void;
  disabled: (item: IWorkspaceListItem) => boolean;
  hide?: (item: IWorkspaceListItem) => boolean;
}
