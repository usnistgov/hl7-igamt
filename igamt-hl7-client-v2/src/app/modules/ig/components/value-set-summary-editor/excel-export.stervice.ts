import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { getLabel } from 'src/app/modules/shared/components/display-section/display-section.component';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import * as XLSX from 'xlsx';
import { Extensibility } from './../../../shared/constants/extensibility.enum';
import { Stability } from './../../../shared/constants/stability.enum';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {

  constructor() {}
// tslint:disable-next-line: cognitive-complexity
  exportToExcel(data: any[], fileName: string, profiles: Record<string, IDisplayElement>): void {
    if (!data || data.length === 0) {
      console.warn('No data available to export.');
      return;
    }

    const formattedData = data.map((row) => ({
      'Value Set': row.display.variableName,
      'Context': row.context ? getLabel(row.context.fixedName, row.context.variableName) : '',
      'Profile': row.message ? getLabel(profiles[row.message].fixedName, profiles[row.message].variableName) : '',

      'Location': row.fullPath ? row.fullPath  : '',
      'Usage': row.usage ? row.usage : '',
      'Data Type': row.datatype ?  getLabel(row.datatype.fixedName, row.datatype.variableName) : '',
      'Strength': row.strength ? row.strength : '',
      'Binding Location': row.bindingLocation ? String(row.bindingLocation).trim() : 'N/A',
      'Extensibility': row.extensibility ? String(row.extensibility).trim() : 'N/A',
      'Stability':  row.stability ? String(row.stability).trim() : 'N/A',

    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelFile = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelFile, `${fileName}.xlsx`);
  }

// tslint:disable-next-line: cognitive-complexity
   exportGroupedWithMerge(processedData: any[], fileName: string, profiles: Record<string, IDisplayElement> ): void {
    if (!processedData || processedData.length === 0) {
      console.log('No grouped data available to export.');
      return;
    }

    const headers = ['Value Set', 'Context', 'Profile', 'Location', 'Usage', 'Data Type', 'Strength', 'Binding Location', 'Extensibility', 'Stability'];
    const exportData: any[][] = [];
    const merges: XLSX.Range[] = [];
    let rowIndex = 0;

    processedData.forEach((group) => {
      group.children.forEach((child: any, i: number) => {
        if (i === 0) {
          exportData.push([
            `${child.display.variableName} (${group.children.length})`,
            child.context ? getLabel(child.context.fixedName, child.context.variableName) : '',
            child.message ? getLabel(profiles[child.message].fixedName, profiles[child.message].variableName) : '',
            child.fullPath  ? child.fullPath  : '',
            child.usage ? child.usage : '',
            child.datatype ? getLabel(child.datatype.fixedName, child.datatype.variableName) : '',
            child.strength ? child.strength : '',
            child.bindingLocation ? String(child.bindingLocation).trim() : 'N/A',
            child.extensibility ? String(child.extensibility).trim() : 'N/A',

            child.stability ? String(child.stability).trim() : 'N/A',

          ]);
          if (group.children.length > 1) {
            merges.push({
              s: { r: rowIndex, c: 0 },
              e: { r: rowIndex + group.children.length - 1, c: 0 },
            });
          }
        } else {
          exportData.push([
            '',
            child.context ? getLabel(child.context.fixedName, child.context.variableName) : '',
            child.message ? getLabel(profiles[child.message].fixedName, profiles[child.message].variableName) : '',
            child.fullPath  ? child.fullPath  : '',
            child.usage ? child.usage : '',
            child.datatype ? getLabel(child.datatype.fixedName, child.datatype.variableName)  : '',
            child.strength ? child.strength : '',
            child.bindingLocation ? String(child.bindingLocation).trim() : 'N/A',
            child.extensibility ? String(child.extensibility).trim() : 'N/A',
            child.stability ? String(child.stability).trim() : 'N/A',

          ]);
        }
        rowIndex++;
      });
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...exportData]);
    const adjustedMerges = merges.map((m) => ({
      s: { r: m.s.r + 1, c: m.s.c },
      e: { r: m.e.r + 1, c: m.e.c },
    }));
    worksheet['!merges'] = adjustedMerges;

    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelFile = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelFile, `${fileName}.xlsx`);
  }

}
