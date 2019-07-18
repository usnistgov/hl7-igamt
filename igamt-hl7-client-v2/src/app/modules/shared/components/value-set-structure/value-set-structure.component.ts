import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Guid} from 'guid-typescript';
import {SelectItem} from 'primeng/api';
import {ChangeType, IChange, PropertyType} from '../../models/save-change';
import {ICodes, IValueSet} from '../../models/value-set.interface';

@Component({
  selector: 'app-value-set-structure',
  templateUrl: './value-set-structure.component.html',
  styleUrls: ['./value-set-structure.component.css'],
})
export class ValueSetStructureComponent implements OnInit {

  constructor() {
  }

  @Input()
  valueSet: IValueSet;
  selectedCodes: ICodes[];
  notDefinedOption = {label: 'Not defined', value: 'Undefined'};
  edit = {};
  temp: string = null;
  filteredCodeSystems: string[] = [];
  selectedColumns: any[];
  @Output()
  changes: EventEmitter<IChange> = new EventEmitter<IChange>();

  @Input()
  viewOnly: boolean;
  codeSystemOptions: any[];
  cols = [
    {field: 'value', header: 'Value'},
    {field: 'description', header: 'Description'},

    {field: 'codeSystem', header: 'Code System'},

    {field: 'usage', header: 'Usage'},
    {field: 'comments', header: 'Comments'},
  ];
  stabilityOptionsOptions = [
    this.notDefinedOption, {label: 'Dynamic', value: 'Dynamic'}, {label: 'Static', value: 'Static'},
  ];
  extensibilityOptions = [
    this.notDefinedOption, {label: 'Open', value: 'Open'}, {label: 'Closed', value: 'Closed'},
  ];
  contentDefinitionOptions = [
    this.notDefinedOption, {label: 'Extensional', value: 'Extensional'}, {label: 'Intentional', value: 'Intentional'},
  ];

  codeUsageOptions = [
    {label: 'R', value: 'R'}, {label: 'P', value: 'P'}, {label: 'E', value: 'E'},
  ];
  editMap = {};

  ngOnInit() {
    this.selectedColumns = this.cols;
    this.editMap[this.valueSet.id] = false;
    this.codeSystemOptions = this.getCodeSystemOptions();
  }

  filterByCodeSystem(value: any) {

  }

  filterByUsages(value: any) {
  }

  toggleEdit(id: string) {
    this.temp = null;
    const tempMap = this.editMap;
    this.editMap = {};
    this.editMap[id] = !tempMap[id];
    console.log(this.editMap);
  }

  addCodeSystem(targetId: string) {
    if (this.valueSet.codeSystems.indexOf(this.temp) < 0) {
      this.valueSet.codeSystems.push(this.temp);
      this.codeSystemOptions.push({value: this.temp, label: this.temp});
      this.changes.emit({
        location: 'ROOT',
        propertyType: PropertyType.CODESYSTEM,
        propertyValue: this.valueSet.codeSystems,
        oldPropertyValue: null,
        position: 0,
        changeType: ChangeType.ADD,
      });
    }
    this.toggleEdit(targetId);
  }

  filterCodeSystems(event: any) {
    this.filteredCodeSystems = this.valueSet.codeSystems.filter((codeSystem: string) => {
      return codeSystem.toLowerCase().indexOf(event.query.toLowerCase()) === 0;
    });
  }

  getCodeSystemOptions(): SelectItem[] {
    return this.valueSet.codeSystems.map((codeSystem: string) => {
      return {label: codeSystem, value: codeSystem};
    });
  }

  deleteCodeSystem(codeSystem: string) {
    console.log(codeSystem);
    this.valueSet.codeSystems = this.valueSet.codeSystems.filter((codeSys: string) => {
      return codeSystem.toLowerCase() !== codeSys.toLowerCase();
    });
    for (const code of this.valueSet.codes) {
      if (code.codeSystem.toLowerCase() === codeSystem.toLowerCase()) {
        code.codeSystem = null;
      }
    }
  }

  addCode() {
    this.valueSet.codes.unshift({
      id: Guid.create().toString(),
      value: null,
      description: null,
      codeSystem: null,
      usage: null,
      comments: null,
    });
    this.changes.emit({
      location: 'ROOT',
      propertyType: PropertyType.CODES,
      propertyValue: this.valueSet.codes,
      oldPropertyValue: null,
      position: 0,
      changeType: ChangeType.ADD,
    });
  }

  applyUsage(usage) {
    for (const code of this.selectedCodes) {
      code.usage = usage;
    }
  }

  applyCodeSystem($event) {
    for (const code of this.selectedCodes) {
      code.codeSystem = $event.value;
    }
  }

  changeCodes() {
    this.changes.emit({
      location: 'ROOT',
      propertyType: PropertyType.CODES,
      propertyValue: this.valueSet.codes,
      oldPropertyValue: null,
      position: 0,
      changeType: ChangeType.UPDATE,
    });
  }

  addCodeSystemFormCode(code: ICodes) {
    code.codeSystem = this.temp;
    this.addCodeSystem(code.id);
    this.changeCodes();
  }

  deleteCodes() {
  }

  updateAttribute(propertyType: PropertyType, value: any) {

    this.changes.emit({
      location: 'ROOT',
      propertyType,
      propertyValue: value,
      oldPropertyValue: null,
      position: 0,
      changeType: ChangeType.UPDATE,
    });
  }

  updateExtensibility() {
    this.updateAttribute(PropertyType.EXTENSIBILITY, this.valueSet.extensibility);
  }

  updateStability() {
    this.updateAttribute(PropertyType.STABILITY, this.valueSet.stability);
  }

  updateContentDefinition() {
    this.updateAttribute(PropertyType.CONTENTDEFINITION, this.valueSet.contentDefinition);
  }
}