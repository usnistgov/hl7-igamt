import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IHL7v2TreeNodeData } from '../../../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../../../shared/constants/type.enum';
import { ChangeType, PropertyType } from '../../../../../shared/models/save-change';
import { IStructureElement } from '../../../../../shared/models/structure-element.interface';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-name-simplified',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
})
export class NameComponent extends HL7v2TreeColumnComponent<IHL7v2TreeNodeData> implements OnInit {

  node: IHL7v2TreeNodeData;
  @Output()
  add: EventEmitter<Type>;
  @Output()
  remove: EventEmitter<boolean>;
  @Input()
  extendable: boolean;
  @Input()
  required: boolean;
  editMode: boolean;
  tmp: string;

  constructor(protected dialog: MatDialog) {
    super([PropertyType.NAME], dialog);
    this.value$.subscribe(
      (value) => {
        this.node = value;
      },
    );
    this.add = new EventEmitter();
    this.remove = new EventEmitter();
    this.editMode = false;
  }

  ctxAddSegment() {
    this.add.emit(Type.SEGMENTREF);
  }

  ctxAddGroup() {
    this.add.emit(Type.GROUP);
  }

  btnRemove() {
    this.remove.emit(true);
  }

  toggleEdit() {
    if (this.editMode) {
      this.tmp = '';
    } else {
      this.tmp = this.node.name;
    }

    this.editMode = !this.editMode;
  }

  setValue() {
    this.onChange(this.value$.getValue().name, this.tmp, PropertyType.NAME, ChangeType.UPDATE);
    this.node.name = this.tmp;
    this.applyToTarget<IStructureElement>((elm) => {
      elm.name = this.tmp;
    });
    this.toggleEdit();
  }

  ngOnInit() {
  }

}
