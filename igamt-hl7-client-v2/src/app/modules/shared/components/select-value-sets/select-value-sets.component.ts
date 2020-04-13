import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Guid} from 'guid-typescript';
import {Table} from 'primeng/table';
import {Scope} from '../../constants/scope.enum';
import {Type} from '../../constants/type.enum';
import {IAddingInfo, SourceType} from '../../models/adding-info';
import {IDisplayElement} from '../../models/display-element.interface';
import {IValueSet} from '../../models/value-set.interface';

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
  @Input() scope: Scope;

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
      oid: obj.oid,
      type: Type.VALUESET,
      name: obj.bindingIdentifier,
      ext: '',
      description: obj.name,
      domainInfo: obj.domainInfo.scope === Scope.PHINVADS ? {...obj.domainInfo , scope: Scope.PHINVADS} : obj.domainInfo,
      sourceType: obj.domainInfo.scope === Scope.PHINVADS ? SourceType.EXTERNAL : obj.sourceType,
      numberOfChildren: obj.numberOfCodes,
      includeChildren: obj.domainInfo.scope === Scope.PHINVADS ? false : obj.numberOfCodes < 500,
      flavor: false,
      url: obj.url,

    };
    this.selectedData.push(element);
    this.emitData();
  }
  addAsFlavor(obj: IValueSet) {
    const element: IAddingInfo = {
      originalId: obj.id,
      id: Guid.create().toString(),
      oid: obj.oid,
      type: Type.VALUESET,
      name: obj.bindingIdentifier,
      description: obj.name,
      flavor: true,
      sourceType: obj.sourceType,
      numberOfChildren: obj.numberOfCodes,
      includeChildren: obj.numberOfCodes < 500,
      domainInfo: {...obj.domainInfo , scope: obj.domainInfo.scope === Scope.PHINVADS ? Scope.PHINVADS : Scope.USER},
      url: obj.url,
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

  switchType(obj: IAddingInfo) {
    if (!obj.includeChildren) {
      obj.sourceType = SourceType.EXTERNAL;
    } else {
      obj.sourceType = SourceType.INTERNAL;
    }
  }
}
