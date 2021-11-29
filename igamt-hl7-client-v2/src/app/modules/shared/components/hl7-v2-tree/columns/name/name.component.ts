import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

export interface INodeName {
  name: string;
  custom: boolean;
}

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
})
export class NameComponent extends HL7v2TreeColumnComponent<INodeName> implements OnInit {

  nname: INodeName;

  constructor(protected dialog: MatDialog) {
    super([PropertyType.NAME], dialog);
    this.value$.subscribe(
      (value) => {
        this.nname = { ...value };
      },
    );
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return false;
  }

  ngOnInit() {
  }

}
