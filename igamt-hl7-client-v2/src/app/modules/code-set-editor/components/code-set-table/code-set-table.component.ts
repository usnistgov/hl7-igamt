import { SelectItem } from 'primeng/api';
import { Guid } from 'guid-typescript';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICodeSetVersionContent } from '../../models/code-set.models';
import { ICodes } from 'src/app/modules/shared/models/value-set.interface';
import { IChange, PropertyType } from 'src/app/modules/shared/models/save-change';
import { CodeUsage } from 'src/app/modules/shared/constants/usage.enum';

@Component({
  selector: 'app-code-set-table',
  templateUrl: './code-set-table.component.html',
  styleUrls: ['./code-set-table.component.css']
})
export class CodeSetTableComponent implements OnInit {

  @Input()
  codeSetVersion: ICodeSetVersionContent;
  selectedCodes: ICodes[] = [];
  edit = {};
  temp: string = null;
  filteredCodeSystems: string[] = [];
  @Output()
  changes: EventEmitter<ICodes[]> = new EventEmitter<ICodes[]>();

  @Output()
  exportCSVEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  importCSVEvent: EventEmitter<any> = new EventEmitter<any>();


  @Input()
  existingChangeReason: any[];
  @Input()
  viewOnly: boolean;
  @Input()
  codeSystemOptions: any[];
  @Input()
  cols: any[];
  @Input()
  selectedColumns: any[];
  editMap = {};



  codeUsageOptions = [
    { label: 'R', value: 'R' }, { label: 'P', value: 'P' }, { label: 'E', value: 'E' },
  ];

  ngOnInit() {
   this.editMap[this.codeSetVersion.id] = false;
   this.cols = this.selectedColumns;
   this.codeSystemOptions = [];
  }
  toggleEdit(id: string) {
    this.temp = null;
    const tempMap = this.editMap;
    this.editMap = {};
    this.editMap[id] = !tempMap[id];
  }

  addCodeSystem(targetId: string) {
    if(!this.codeSetVersion.codeSystems){

      this.codeSetVersion.codeSystems = [];
      this.codeSystemOptions = [];
    }
    if (this.codeSetVersion.codeSystems.indexOf(this.temp) < 0) {
      this.codeSetVersion.codeSystems.push(this.temp);
      this.codeSystemOptions.push({ value: this.temp, label: this.temp });
    }
    this.toggleEdit(targetId);
  }

  filterCodeSystems(event: any) {
    this.filteredCodeSystems = this.codeSetVersion.codeSystems.filter((codeSystem: string) => {
      return codeSystem.toLowerCase().indexOf(event.query.toLowerCase()) === 0;
    });
  }

  getCodeSystemOptions(): SelectItem[] {
    return this.codeSetVersion.codeSystems.map((codeSystem: string) => {
      return { label: codeSystem, value: codeSystem };
    });
  }

  deleteCodeSystem(codeSystem: string) {
    this.codeSetVersion.codeSystems = this.codeSetVersion.codeSystems.filter((codeSys: string) => {
      return codeSys != null && codeSystem.toLowerCase() !== codeSys.toLowerCase();
    });
    for (const code of this.codeSetVersion.codes) {
      if (code.codeSystem && code.codeSystem.toLowerCase() === codeSystem.toLowerCase()) {
        code.codeSystem = null;
      }
    }
    this.codeSystemOptions = this.getCodeSystemOptions();
    this.updateAttribute(PropertyType.CODES, this.codeSetVersion.codes);
    this.updateAttribute(PropertyType.CODESYSTEM, this.codeSetVersion.codeSystems);
  }

  addCode() {
    if(!this.codeSetVersion.codes){
      this.codeSetVersion.codes = [];
    }
    this.codeSetVersion.codes.unshift({
      id: Guid.create().toString(),
      value: null,
      description: null,
      codeSystem: null,
      usage: CodeUsage.P,
      comments: null,
      pattern: null,
      hasPattern: false,
    });
    console.log(" adding codes ");
    this.changes.emit(this.codeSetVersion.codes);
  }

  applyUsage(usage) {
    for (const code of this.selectedCodes) {
      code.usage = usage;
    }
    this.updateAttribute(PropertyType.CODES, this.codeSetVersion.codes);
  }

  applyCodeSystem($event) {
    for (const code of this.selectedCodes) {
      code.codeSystem = $event.value;
    }
  }

  changeCodes() {
    this.changes.emit(this.codeSetVersion.codes)
  }

  addCodeSystemFormCode(code: ICodes) {
    code.codeSystem = this.temp;
    this.addCodeSystem(code.id);
    this.changeCodes();
  }

  deleteCodes() {
    this.codeSetVersion.codes = this.codeSetVersion.codes.filter((x) => this.selectedCodes.indexOf(x) < 0);
    this.selectedCodes = [];
    this.changes.emit(this.codeSetVersion.codes);

  }

  updateAttribute(propertyType: PropertyType, value: any) {
    // change if we add other attributes
    this.changes.emit(this.codeSetVersion.codes);

  }
  updateURl(value) {
    this.updateAttribute(PropertyType.URL, value);
  }

  importCSV(){
    this.importCSVEvent.emit(this.codeSetVersion);
  }
  exportCSV(){
    this.exportCSVEvent.emit(this.codeSetVersion);

  }

}
