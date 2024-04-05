import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Guid } from 'guid-typescript';
import { SelectItem } from 'primeng/api';
import { map } from 'rxjs/operators';
import { CodeSetServiceService } from 'src/app/modules/code-set-editor/services/CodeSetService.service';
import { Type } from '../../constants/type.enum';
import { ChangeType, IChange, PropertyType } from '../../models/save-change';
import { ICodes, IValueSet } from '../../models/value-set.interface';
import { ICodeSetQueryResult } from '../../services/external-codeset.service';
import { BrowseType, CodeSetBrowseDialogComponent, IBrowserTreeNode } from '../codeset-browse-dialog/codeset-browse-dialog.component';
import { FetchCodesDialogComponent } from '../fetch-codes-dialog/fetch-codes-dialog.component';
import { ImportCodeCSVComponent } from '../import-code-csv/import-code-csv.component';

@Component({
  selector: 'app-value-set-structure',
  templateUrl: './value-set-structure.component.html',
  styleUrls: ['./value-set-structure.component.css'],
})
export class ValueSetStructureComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private codeSetService: CodeSetServiceService,
  ) {
  }
  @Input()
  valueSet: IValueSet;
  selectedCodes: ICodes[] = [];
  notDefinedOption = { label: 'Not defined', value: 'Undefined' };
  edit = {};
  temp: string = null;
  filteredCodeSystems: string[] = [];
  @Output()
  changes: EventEmitter<IChange> = new EventEmitter<IChange>();
  @Output()
  exportCSVEvent: EventEmitter<string> = new EventEmitter<string>();
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

  stabilityOptionsOptions = [
    this.notDefinedOption, { label: 'Dynamic', value: 'Dynamic' }, { label: 'Static', value: 'Static' },
  ];
  extensibilityOptions = [
    this.notDefinedOption, { label: 'Open', value: 'Open' }, { label: 'Closed', value: 'Closed' },
  ];
  contentDefinitionOptions = [
    this.notDefinedOption, { label: 'Extensional', value: 'Extensional' }, { label: 'Intensional', value: 'Intensional' },
  ];

  codeUsageOptions = [
    { label: 'R', value: 'R' }, { label: 'P', value: 'P' }, { label: 'E', value: 'E' },
  ];
  editMap = {};

  importMenuItems = [
    {
      label: 'CSV',
      items: [{
        label: 'Import From CSV',
        command: (event) => {
          this.importCSV();
        },
      },
      { separator: true },
      {
        label: 'Example CSV Format',
        command: (event) => {
          this.downloadExample();
        },
      }],
    },
    { separator: true },
    {
      label: 'CodeSet',
      items: [
        {
          label: 'From IGAMT', command: () => {
            this.importFromCodeSet();
          },
        },
        { separator: true },
        {
          label: 'From URL', command: () => {
            this.importFromURL();
          },
        },
      ],
    },
  ];

  ngOnInit() {
    this.editMap[this.valueSet.id] = false;
  }
  toggleEdit(id: string) {
    this.temp = null;
    const tempMap = this.editMap;
    this.editMap = {};
    this.editMap[id] = !tempMap[id];
  }

  addCodeSystem(targetId: string) {
    if (this.valueSet.codeSystems.indexOf(this.temp) < 0) {
      this.valueSet.codeSystems.push(this.temp);
      this.codeSystemOptions.push({ value: this.temp, label: this.temp });
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
      return { label: codeSystem, value: codeSystem };
    });
  }

  deleteCodeSystem(codeSystem: string) {
    this.valueSet.codeSystems = this.valueSet.codeSystems.filter((codeSys: string) => {
      return codeSys != null && codeSystem.toLowerCase() !== codeSys.toLowerCase();
    });
    for (const code of this.valueSet.codes) {
      if (code.codeSystem && code.codeSystem.toLowerCase() === codeSystem.toLowerCase()) {
        code.codeSystem = null;
      }
    }
    this.codeSystemOptions = this.getCodeSystemOptions();
    this.updateAttribute(PropertyType.CODES, this.valueSet.codes);
    this.updateAttribute(PropertyType.CODESYSTEM, this.valueSet.codeSystems);
  }

  addCode() {
    this.valueSet.codes.unshift({
      id: Guid.create().toString(),
      value: null,
      description: null,
      codeSystem: null,
      usage: null,
      comments: null,
      pattern: null,
      hasPattern: false,
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
    this.updateAttribute(PropertyType.CODES, this.valueSet.codes);
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
    this.valueSet.codes = this.valueSet.codes.filter((x) => this.selectedCodes.indexOf(x) < 0);
    this.selectedCodes = [];
    this.updateAttribute(PropertyType.CODES, this.valueSet.codes);
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
  updateURl(value) {
    this.updateAttribute(PropertyType.URL, value);
  }
  updateExtensibility($event) {
    this.updateAttribute(PropertyType.EXTENSIBILITY, $event);
  }

  updateStability($event) {
    this.updateAttribute(PropertyType.STABILITY, $event);
  }

  updateContentDefinition($event) {
    this.updateAttribute(PropertyType.CONTENTDEFINITION, $event);
  }

  importFromCodeSet() {
    return this.dialog.open(CodeSetBrowseDialogComponent, {
      data: {
        browserType: BrowseType.ENTITY,
        scope: {
          private: true,
          public: true,
        },
        types: [Type.CODESET, Type.CODESETVERSION],
        exclude: [],
        selectionMode: 'single',
        includeVersions: true,
      },
    }).afterClosed().pipe(
      map((browserResult: IBrowserTreeNode) => {
        let codeSetId: string;
        let codeSetVersionId: string;

        if (browserResult.data.type === Type.CODESET) {
          codeSetId = browserResult.data.id;
          codeSetVersionId = browserResult.data.latestId;
        } else if (browserResult.data.type === Type.CODESETVERSION) {
          codeSetVersionId = browserResult.data.id;
          codeSetId = browserResult.parent ? browserResult.parent.data.id : undefined;
        }

        if (codeSetId && codeSetVersionId) {
          this.codeSetService.getCodeSetVersionContent(codeSetId, codeSetVersionId).pipe(
            map((content) => {
              this.valueSet.codes = content.codes;
              this.updateAttribute(PropertyType.CODES, content.codes);
            }),
          ).subscribe();
        }
      }),
    ).subscribe();
  }

  linkToCodeSet() {
    return this.dialog.open(CodeSetBrowseDialogComponent, {
      data: {
        browserType: BrowseType.ENTITY,
        scope: {
          private: true,
          public: true,
        },
        types: [Type.CODESET],
        exclude: [],
        selectionMode: 'single',
        includeVersions: false,
      },
    }).afterClosed().pipe(
      map((browserResult: IBrowserTreeNode) => {
        // TODO
      }),
    ).subscribe();
  }

  importFromURL() {
    return this.dialog.open(FetchCodesDialogComponent, {}).afterClosed().pipe(
      map((result: ICodeSetQueryResult) => {
        if (result) {
          this.valueSet.codes = result.codes.map((code) => ({
            value: code.value,
            id: Guid.create().toString(),
            description: code.displayText,
            codeSystem: code.codeSystem,
            hasPattern: code.isPattern,
            usage: code.usage,
            pattern: code.regularExpression,
            comments: '',
          }));
          this.updateAttribute(PropertyType.CODES, this.valueSet.codes);
        }
      }),
    ).subscribe();
  }

  importCSV() {

    this.dialog.open(ImportCodeCSVComponent, {
    }).afterClosed().subscribe({
      next: (codes: ICodes[]) => {
        console.log(codes);
        if (codes) {
          this.valueSet.codes = codes;
          this.updateAttribute(PropertyType.CODES, this.valueSet.codes);
        }
      },
    });
  }
  exportCSV() {
    this.exportCSVEvent.emit(this.valueSet.id);

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

}
