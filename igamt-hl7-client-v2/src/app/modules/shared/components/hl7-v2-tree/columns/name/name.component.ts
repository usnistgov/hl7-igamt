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
  @Input()
  delete: boolean;
  @Output()
  add: EventEmitter<boolean>;
  @Output()
  remove: EventEmitter<boolean>;
  @Input()
  extendable: boolean;
  editMode: boolean;
  tmp: string;

  constructor(protected dialog: MatDialog) {
    super([PropertyType.NAME], dialog);
    this.value$.subscribe(
      (value) => {
        this.nname = { ...value };
      },
    );
    this.add = new EventEmitter();
    this.remove = new EventEmitter();
    this.editMode = false;
  }

  ctxAdd() {
    this.add.emit(true);
  }

  btnRemove() {
    this.remove.emit(true);
  }

  toggleEdit() {
    if (this.editMode) {
      this.tmp = '';
    } else {
      this.tmp = this.nname.name;
    }

    this.editMode = !this.editMode;
  }

  setValue() {
    this.nname.name = this.tmp;
    this.onChange(this.value$.getValue().name, this.nname.name, PropertyType.NAME, ChangeType.UPDATE);
    this.toggleEdit();
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  ngOnInit() {
  }

}
