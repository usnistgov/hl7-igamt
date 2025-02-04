import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import { IUsageOption } from 'src/app/modules/shared/components/hl7-v2-tree/columns/usage/usage.component';
import { Scope } from 'src/app/modules/shared/constants/scope.enum';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { Usage } from 'src/app/modules/shared/constants/usage.enum';
import { IValuesetStrength } from 'src/app/modules/shared/models/binding.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { ExcelExportService } from '../excel-export.stervice';

@Component({
  selector: 'app-binding-summary-list',
  templateUrl: './binding-summary-list.component.html',
  styleUrls: ['./binding-summary-list.component.scss'],
})
export class BindingSummaryListComponent implements OnInit {
  vsbList: any;
  @Input() allVs: Map<string, IDisplayElement>;
  loading = false;
  error: any;
  showFilters = true;
  @Input() igId: string;
  filtersCollapsed = false;
  activeFilter: ISummaryFilter;
  @Output() update: EventEmitter<ISummaryFilter>;
  @Input() active: boolean;
  @ViewChild('dtFlat') dtFlat: Table;
  @ViewChild('dtGrouped') dtGrouped: Table;

  usages: IUsageOption[];
  isGrouped = true;
  processedData: any[] = [];
  globalSearchTerm = '';
  conformanceProfilesMap: Record<string, IDisplayElement>;
  conformanceProfileOptions: SelectItem[];
  scopeOptions = [
    { label: 'HL7', value: Scope.HL7STANDARD },
    { label: 'USER', value: Scope.USER },
    { label: 'PHINVADS', value: Scope.PHINVADS },
  ];
  typeOptions = [
    { value: Type.PROFILECOMPONENTREGISTRY, label: 'Profile Components' },
    { value: Type.COMPOSITEPROFILEREGISTRY, label: 'Composite Profiles' },
    { value: Type.CONFORMANCEPROFILEREGISTRY, label: 'Conformance Profiles' },
    { value: Type.SEGMENTREGISTRY, label: 'Segments' },
    { value: Type.DATATYPEREGISTRY, label: 'Datatypes' },
    { value: Type.VALUESETREGISTRY, label: 'ValueSets' },
    { value: Type.COCONSTRAINTGROUPREGISTRY, label: 'Co-Constraint Group' },
  ];
  emptyFilter: ISummaryFilter = {
    scopes: [Scope.USER, Scope.PHINVADS, Scope.HL7STANDARD ],
    conformanceProfiles: [],
    usages: [Usage.R, Usage.RE, Usage.C, Usage.CAB],
    bindingStrengths: [IValuesetStrength.R, IValuesetStrength.U, IValuesetStrength.S],
  };

  filters: any = { usage: [], strength: [] };
  usageOptions = [
    { label: 'R', value: Usage.R },
    { label: 'RE', value: Usage.RE },
    { label: 'CAB', value: Usage.CAB },
    { label: 'C', value: Usage.C },
    { label: 'O', value: Usage.O },
    { label: 'X', value: Usage.X },
    { label: 'IX', value: Usage.IX },
  ];
  bindingStrengthOptions = [
    { label: 'Required', value: IValuesetStrength.R },
    { label: 'Suggested', value: IValuesetStrength.S },
    { label: 'Unspecified', value: IValuesetStrength.U },
  ];
  @Input() set conformanceProfiles(items: IDisplayElement[]) {
    this.conformanceProfilesMap = {};
    this.conformanceProfileOptions = [];
    for (const item of items) {
      this.conformanceProfilesMap[item.id] = item;
      this.conformanceProfileOptions.push({
        label: item.id,
        value: item.id,
      });
      this.activeFilter.conformanceProfiles.push(item.id);
    }
  }

  fetch() {
    this.loading = true;
    this.error = undefined;
    setTimeout(() => {
      this.igService.getValueSetsSummary(this.igId, this.activeFilter).pipe(
        tap((result) => {
          this.vsbList = result;
          this.filtersCollapsed = true;
          this.updateGrouping();
          console.log(this.processedData);
          this.loading = false;
        }),
        catchError((error) => {
          this.error = error;
          this.loading = false;
          return of();
        }),
        take(1),
      ).subscribe();
    }, 500);
  }
  constructor(private excelService: ExcelExportService, private igService: IgService) {
    this.update = new EventEmitter();
    this.activeFilter = _.cloneDeep(this.emptyFilter);
  }
  ngOnInit() {
   this.fetch();

  }
  exportExcel() {
    if (this.isGrouped) {
      console.log(this.processedData);
      this.excelService.exportGroupedWithMerge(this.processedData, 'Grouped');
    } else {
      this.excelService.exportToExcel(this.vsbList, 'ResourceBindings');
    }
  }
  onSearchChange(event) {
    this.globalSearchTerm = event.target.value.toLowerCase();
    if (this.isGrouped) {
      this.updateGrouping();
    } else if (this.dtFlat) {
      this.dtFlat.filterGlobal(this.globalSearchTerm, 'contains');
    }
  }
  updateGrouping() {

    let listToGroup = this.vsbList;
    if (this.globalSearchTerm) {
      listToGroup = this.vsbList.filter((row) => this.rowMatchesSearch(row, this.globalSearchTerm));
    }
    const groupedData: any[] = [];
    const groupMap = new Map();

    listToGroup.forEach((row) => {
      if (!groupMap.has(row.valueSet)) {
        groupMap.set(row.valueSet, { valueSet: row.display.variableName+row.valueSet, children: [] });
      }
      groupMap.get(row.valueSet).children.push(row);
    });
    groupMap.forEach((value) => groupedData.push(value));
    groupedData.sort((a, b) => a.valueSet.localeCompare(b.valueSet));
    this.processedData = groupedData;
  }

  rowMatchesSearch(row, term: string): boolean {
    return (row.display && row.display.variableName && row.display.variableName.toLowerCase().includes(term));
  }
  clearFilter() {

  }
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  onGroupingChange() {
    this.updateGrouping();
  }
}

export interface ISummaryFilter {
  scopes?: Scope[];
  conformanceProfiles?: string[];
  usages?: Usage[];
  bindingStrengths?: IValuesetStrength[];
}
