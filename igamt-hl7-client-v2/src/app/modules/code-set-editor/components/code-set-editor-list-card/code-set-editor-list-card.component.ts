import { Component, Input, OnInit } from '@angular/core';
import { ICodeSetListItem } from '../../models/code-set.models';

@Component({
  selector: 'app-code-set-editor-list-card',
  templateUrl: './code-set-editor-list-card.component.html',
  styleUrls: ['./code-set-editor-list-card.component.css']
})
export class CodeSetEditorListCardComponent implements OnInit {


  @Input() item: ICodeSetListItem;
  @Input() controls: ICodeSetListItemControl[];
  moreInfo: boolean;


  constructor() { }


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


export interface ICodeSetListItemControl {
  label: string;
  class: string;
  icon: string;
  default?: boolean;
  action: (item: ICodeSetListItem) => void;
  disabled: (item: ICodeSetListItem) => boolean;
  hide?: (item: ICodeSetListItem) => boolean;
}
