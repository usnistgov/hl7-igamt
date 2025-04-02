import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { SelectItem } from 'primeng/api';
import { CodeUsage } from 'src/app/modules/shared/constants/usage.enum';
import { IChange, PropertyType } from 'src/app/modules/shared/models/save-change';
import { ICodes } from 'src/app/modules/shared/models/value-set.interface';
import { ICodeSetVersionContent } from '../../models/code-set.models';
import { MatDialog } from '@angular/material';
import { ImportCodeCSVComponent } from 'src/app/modules/shared/components/import-code-csv/import-code-csv.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-code-set-table',
  templateUrl: './code-set-table.component.html',
  styleUrls: ['./code-set-table.component.css'],
})
export class CodeSetTableComponent implements OnInit {

  _codeSetVersion: ICodeSetVersionContent;

  codeSystems: string[] = [];

  @ViewChild('form') form!: NgForm;

  valid: boolean = true;

  @Input()
  set codeSetVersion(codeSetVersion: ICodeSetVersionContent) {
    this._codeSetVersion = codeSetVersion;
    this.codeSystems = this.getUniqueCodeSystems(this._codeSetVersion.codes ? this._codeSetVersion.codes : []);
    this._codeSetVersion.codeSystems = this.codeSystems;
    this.codeSystemOptions = this.getCodeSystemOptions();
    this.selectedCodes = [];
  }

  get codeSetVersion() {
    return this._codeSetVersion;
  }

  constructor(
    private dialog: MatDialog, private cdr: ChangeDetectorRef
  ){

  }

  selectedCodes: ICodes[] = [];

  edit = {};

  temp: string = null;

  filteredCodeSystems: string[] = [];
  @Output()
  changes: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  exportCSVEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  importCSVEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  existingChangeReason: any[];
  @Input()
  viewOnly: boolean;

  codeSystemOptions: any[] = [];
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
  }

  toggleEdit(id: string) {
    this.temp = null;
    const tempMap = this.editMap;
    this.editMap = {};
    this.editMap[id] = !tempMap[id];
  }

  addCodeSystem(targetId: string) {
    if (!this.codeSetVersion.codeSystems) {

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

  setHasPattern(code: ICodes) {
    code.hasPattern = true;
    code.pattern = '';
    // add pattern control to the form to make form validation work correctly
    //this.form.control.addControl('pattern' + code.id, new FormControl('', { validators: Validators.required, updateOn: 'blur' }));
    this.changeCodes();
  }

  removeHasPattern(code: ICodes) {
    code.hasPattern = false;
    code.pattern = '';
    // remove pattern control to the form to make form validation work correctly
    //this.form.control.removeControl('pattern' + code.id);
    this.changeCodes();
  }

  getCodeSystemOptions(): SelectItem[] {
    return this.codeSystems.map((codeSystem: string) => {
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
    if (!this.codeSetVersion.codes) {
      this.codeSetVersion.codes = [];
    }
    this.codeSetVersion.codes.unshift({
      id: Guid.create().toString(),
      value: null,
      description: null,
      codeSystem: null,
      usage: null,
      comments: null,
      pattern: '',
      hasPattern: false,
    });
      this.changeCodes();
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
    console.log(this.valid);
    this.changes.emit({ codes: this.codeSetVersion.codes, valid: this.valid });
  }

  addCodeSystemFormCode(code: ICodes) {
    code.codeSystem = this.temp;
    this.addCodeSystem(code.id);
    this.changeCodes();
  }

  deleteCodes() {
    this.codeSetVersion.codes = this.codeSetVersion.codes.filter((x) => this.selectedCodes.indexOf(x) < 0);
    this.selectedCodes = [];
    this.changeCodes();

  }

  updateAttribute(propertyType: PropertyType, value: any) {
    // change if we add other attributes
    this.changeCodes();
  }
  updateURl(value) {
    this.updateAttribute(PropertyType.URL, value);
  }

  importCSV($event) {

    this.dialog.open(ImportCodeCSVComponent).afterClosed().subscribe((codes: ICodes[]) => {
      if (codes) {
        this.codeSetVersion.codes = codes;
        this.cdr.detectChanges();
        this.changeCodes();
      }
    });
  }

  isValid(){
   return this.valid;
  }
  exportCSV() {
    this.exportCSVEvent.emit(this.codeSetVersion);
  }
  getUniqueCodeSystems(codes: ICodes[]): string[] {
    const codeSystems = codes.map((code) => code.codeSystem);
    const uniqueCodeSystems = new Set(codeSystems);
    return Array.from(uniqueCodeSystems);
  }

  downloadExample() {
    // in service
    const exampleCSV = 'data:text/csv;charset=utf-8,value,pattern,description,codeSystem,usage,comments\nvalue1,pattern1,description1,codeSystem1,P,comments1';
    const encodedUri = encodeURI(exampleCSV);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'example.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  ngAfterViewInit() {
    this.form.statusChanges.subscribe((status) => {
       console.log(this.valid);
      // this.changeCodes();
    });
  }


}
