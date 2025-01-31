// import { User } from 'src/app/modules/dam-framework/models/authentication/user.class';
// import { IgService } from 'src/app/modules/ig/services/ig.service';
// import { SelectItem } from 'primeng/api';
// import { Component, OnInit,Input, ViewChild, Output, EventEmitter } from "@angular/core";
// import { IDisplayElement } from "src/app/modules/shared/models/display-element.interface";
// import { ExcelExportService } from '../excel-export.stervice';
// import { IValuesetStrength } from 'src/app/modules/shared/models/binding.interface';
// import { Usage } from 'src/app/modules/shared/constants/usage.enum';
// import { Table } from 'primeng/table';
// import { IUsageOption } from 'src/app/modules/shared/components/hl7-v2-tree/columns/usage/usage.component';
// import { Hl7Config } from 'src/app/modules/shared/models/config.class';
// import { Type } from 'src/app/modules/shared/constants/type.enum';

// import * as _ from 'lodash';
// import { catchError, take, tap } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { Scope } from 'src/app/modules/shared/constants/scope.enum';

// @Component({
//   selector: 'app-binding-summary-list',
//   templateUrl: './binding-summary-list.component.html',
//   styleUrls: ['./binding-summary-list.component.scss'],
// })
// export class BindingSummaryListComponent  implements OnInit {

//     //@Input()
//     vsbList: any;
//     @Input()
//     allVs: Map<string, IDisplayElement>;

//     loading  = false;
//     error: any;

//     showFilters: boolean = true;


//     @Input()
//     igId: string;
//     filtersCollapsed: boolean = false;


//     @Input()
//     activeFilter: ISummaryFilter;
//     @Output()
//     update: EventEmitter<ISummaryFilter>;
//     @Input()
//     active: boolean;
//     @Input()
//     set config(c: Hl7Config) {
//       this.usages = Hl7Config.getUsageOptions(c.usages, true, true, true);
//     }
//     usages: IUsageOption[];
//     conformanceProfilesMap: Record<string, IDisplayElement>;
//     conformanceProfileOptions: SelectItem[];
//     scopeOptions = [
//       {
//       label: 'HL7',
//       value: Scope.HL7STANDARD
//     },
//     {
//       label: 'USER',
//       value: Scope.USER
//     },
//     {
//       label: 'PHINVADS',
//       value: Scope.PHINVADS
//     },

//   ];

//     typeOptions = [{
//       value: Type.PROFILECOMPONENTREGISTRY,
//       label: 'Profile Components',
//     }, {
//       value: Type.COMPOSITEPROFILEREGISTRY,
//       label: 'Composite Profiles',
//     }, {
//       value: Type.CONFORMANCEPROFILEREGISTRY,
//       label: 'Conformance Profiles',
//     }, {
//       value: Type.SEGMENTREGISTRY,
//       label: 'Segments',
//     }, {
//       value: Type.DATATYPEREGISTRY,
//       label: 'Datatypes',
//     }, {
//       value: Type.VALUESETREGISTRY,
//       label: 'ValueSets',
//     }, {
//       value: Type.COCONSTRAINTGROUPREGISTRY,
//       label: 'Co-Constraint Group',
//     }];

//     emptyFilter: ISummaryFilter = {

//       scopes:[ ],
//       conformanceProfiles : [],
//       usages : [Usage.R, Usage.RE,Usage.C, Usage.CAB  ],
//       bindingStrengths :[ IValuesetStrength.R ],

//     };


//   @ViewChild('dt') dt: Table;

//   filters: any = {
//     usage: [],
//     strength: []
//   };

//   usageOptions = [

//     { label: 'R', value: Usage.R },
//     { label: 'RE', value: Usage.RE },
//     { label: 'O', value: Usage.O },
//     { label: 'X', value: Usage.X },
//     { label: 'CAB', value: Usage.CAB },
//     { label: 'C', value: Usage.C },
//     { label: 'IX', value: Usage.IX },

//   ];



//     bindingStrengthOptions = [
//       { label: 'Required', value: IValuesetStrength.R },
//       { label: 'Suggested', value: IValuesetStrength.S },
//       { label: 'Unspecified', value: IValuesetStrength.U },
//     ];

//     @Input()
//     set conformanceProfiles(items: IDisplayElement[]) {
//       this.conformanceProfilesMap = {};
//       this.conformanceProfileOptions = [];
//       for (const item of items) {
//         this.conformanceProfilesMap[item.id] = item;
//         this.conformanceProfileOptions.push({
//           label: item.id,
//           value: item.id,
//         });
//         this.activeFilter.conformanceProfiles.push(item.id);
//       }
//     }



//   fetch() {
//     this.loading = true;
//     this.error = undefined;
//     setTimeout(() => {
//         this.igService.getValueSetsSummary(this.igId, this.activeFilter).pipe(
//             tap((result) => {
//                 this.vsbList = result;
//                 this.filtersCollapsed = true;
//                 this.groupRowsByValueSet();
//                 this.loading = false;
//             }),
//             catchError((error) => {


//                 this.error = error;
//                 this.loading = false;
//                 return of();
//             }),
//             take(1),
//         ).subscribe();
//     }, 500);
//   }


//   constructor(private excelService: ExcelExportService, private igService: IgService) {
//     this.update = new EventEmitter();
//     this.activeFilter = _.cloneDeep(this.emptyFilter);
//   }
//   onDeactivate(): void {
//   }

//   ngOnInit() {
//     this.fetch();

//   }

//   print(obj){

//     console.log(obj);

//   }


//   exportExcel() {
//     this.excelService.exportToExcel(this.vsbList, 'ResourceBindings');
//   }


//   applyFilter(value, field, matchMode) {
//     this.dt.filter(value, field, matchMode);
//   }

//   clearFilter(){
//     console.log(this.activeFilter);
//   }

//   isGrouped: boolean = false;
//   processedData: any[] = [];

//   toggleGrouping() {
//     this.isGrouped = !this.isGrouped;
//     this.groupRowsByValueSet();
//     console.log(this.processedData);
//   }

//   processTableData() {
//     if (this.isGrouped) {
//       let lastValueSet = null;
//       this.processedData = this.vsbList.map((row, index) => {
//         let showValueSet = row.valueSet !== lastValueSet;
//         lastValueSet = row.valueSet;
//         return { ...row, showValueSet, rowSpan: showValueSet ? this.getRowSpan(row.valueSet) : 0 };
//       });
//     } else {
//       this.processedData = [...this.vsbList];
//     }
//   }

//   getRowSpan(valueSet: string): number {
//     return this.vsbList.filter(row => row.valueSet === valueSet).length;
//   }


//   toggleFilters() {
//     this.showFilters = !this.showFilters;
//     }

//   groupRowsByValueSet(): any[] {
//       const groupedData: any[] = [];
//       const groupMap = new Map();
//       this.isGrouped =true;

//       // Group rows by valueSet
//       this.vsbList.forEach(row => {
//         if (!groupMap.has(row.valueSet)) {
//           groupMap.set(row.valueSet, { valueSet: row.valueSet, children: [] });
//         }
//         groupMap.get(row.valueSet).children.push(row);
//       });

//       // Convert the map to an array
//       groupMap.forEach(value => groupedData.push(value));
//       this.processedData = groupedData;
//       console.log(this.processedData)
//       return groupedData;
//     }

// }




// export interface ISummaryFilter{
//   scopes?: Scope[],
//   conformanceProfiles?: string[]
//   usages?: Usage[]
//   bindingStrengths?: IValuesetStrength[],

// }
