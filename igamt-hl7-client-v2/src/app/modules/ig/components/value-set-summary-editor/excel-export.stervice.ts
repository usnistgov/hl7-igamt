import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() {}

  exportToExcel(data: any[], fileName: string): void {
    if (!data || data.length === 0) {
      console.warn('No data available to export.');
      return;
    }

    // Map data to match table headers safely
    const formattedData = data.map(row => ({
      'Value Set': row.valueSet,
      'Context': row.context ? row.context.description : '',
      'Location': row.locationInfo ? `${row.locationInfo.positionalPath}.${row.locationInfo.name}` : '',
      'Usage': row.usage ? row.usage : '',
      'Data Type': row.datataype ? row.datataype.description : '',
      'Strength': row.strength ? row.strength : '',
      'Binding Location': row.bindingLocation ? String(row.bindingLocation).trim() : 'N/A',

    }));

    // Create worksheet and workbook
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    // Write and save file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelFile = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelFile, `${fileName}.xlsx`);
  }
}
