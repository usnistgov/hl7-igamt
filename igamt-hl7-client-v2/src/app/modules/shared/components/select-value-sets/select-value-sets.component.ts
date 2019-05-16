import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Guid} from 'guid-typescript';
import {Table} from 'primeng/table';
import {Scope} from '../../constants/scope.enum';
import {Type} from '../../constants/type.enum';
import {IAddingInfo} from '../../models/adding-info';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-select-value-sets',
  templateUrl: './select-value-sets.component.html',
  styleUrls: ['./select-value-sets.component.css'],
})
export class SelectValueSetsComponent implements OnInit {

  @Input()
  table: any;
  @Input()
  existing: IDisplayElement[];
  @ViewChild('dt1') tableRef: Table;
  selectedData: IAddingInfo[] = [];
  @Output() selected = new EventEmitter<string>();
  @Output() added = new EventEmitter<IAddingInfo[]>();
  @Output() valid = new EventEmitter<boolean>();
  @Input()
  selectedVersion: string;
  @Input()
  hl7Versions: string[] = [];

  @ViewChild(NgForm) form;
  constructor() {
  }
  ngOnInit() {
  }
  addAsIs(obj: any) {
    const element: IAddingInfo = {
      originalId: obj.id,
      id: obj.id,
      type: Type.VALUESET,
      name: obj.bindingIdentifier,
      ext: '',
      description: obj.name,
      domainInfo: obj.domainInfo,
      flavor: false,
    };
    this.selectedData.push(element);
    this.emitData();
  }
  addAsFlavor(obj: any) {
    const element: IAddingInfo = {
      originalId: obj.id,
      id: Guid.create().toString(),
      type: Type.VALUESET,
      name: obj.bindingIdentifier,
      description: obj.name,
      flavor: true,
      domainInfo: {...obj.domainInfo , scope: Scope.USER},
    };
    this.selectedData.push(element);
    this.emitData();

  }
  unselect(selected: any) {
    const index = this.selectedData.indexOf(selected);
    if (index > -1) {
      this.selectedData.splice(index, 1);
    }
    this.emitData();
  }
  select($event: any) {
    this.selectedVersion = $event;
    this.selected.emit($event);
  }
  emitData() {
    this.added.emit(this.selectedData);
  }
  isValid() {
    if (this.form) {
      return this.form.valid && this.selectedData.length > 0;
    } else {
      return this.selectedData.length > 0;
    }
  }
}
