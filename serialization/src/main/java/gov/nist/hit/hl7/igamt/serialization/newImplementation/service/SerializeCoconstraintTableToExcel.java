package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingContained;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintHeaders;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CodeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.coconstraints.model.DataElementHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.DatatypeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.NarrativeHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueSetCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.VariesCell;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import nu.xom.Attribute;
import nu.xom.Element;


@Service
public class SerializeCoconstraintTableToExcel {
	
	@Autowired
	private ConformanceProfileService conformanceProfileService;
	
	@Autowired
	DatatypeService datatypeService;
	
	@Autowired
	CoConstraintService coConstraintService;
	
	@Autowired
	ValuesetService valuesetService;

	public ByteArrayOutputStream exportToExcel(CoConstraintTable coConstraintTableNotMerged) {
//		final String FILE_NAME = "/Users/ynb4/Desktop/MyFirstExcelTryout.xlsx";
		final int HEADER_FONT_SIZE = 20;
//		if (coConstraintService.getCoConstraintForSegment(id) != null) {
//			CoConstraintTable coConstraintTable = coConstraintService.getCoConstraintForSegment(id);
		
//		ConformanceProfile conformanceProfile = conformanceProfileService.findById("5e2874487ca5c06e4a2283af");
//		CoConstraintTable coConstraintTable = conformanceProfile.getCoConstraintsBindings().get(0).getBindings().get(0).getTables().get(0).getValue();

		CoConstraintTable coConstraintTable = coConstraintService.resolveRefAndMerge(coConstraintTableNotMerged);

			XSSFWorkbook workbook = new XSSFWorkbook();
			XSSFSheet sheet = workbook.createSheet("Coconstaints Export");
			

			CoConstraintHeaders headers = coConstraintTable.getHeaders();
//			CoConstraintTableContent content = coConstraintTable.getContent();
			
			//Defining styles for headers   
			 XSSFFont ifHeaderFont = workbook.createFont();
			 ifHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
			 ifHeaderFont.setBold(true);
//			 ifHeaderFont.setColor(HSSFColor.WHITE.index);
			 
			 XSSFFont thenHeaderFont = workbook.createFont();
			 thenHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
			 thenHeaderFont.setBold(true);
		      
            CellStyle ifHeaderStyle = workbook.createCellStyle();
            XSSFColor myColor = new XSSFColor(Color.BLUE);
            ifHeaderStyle.setFillForegroundColor(HSSFColor.PALE_BLUE.index);
//            ifHeaderStyle.setFillBackgroundColor(HSSFColor.BLUE_GREY.index);
            ifHeaderStyle.setAlignment(CellStyle.ALIGN_CENTER);
            ifHeaderStyle.setFont(ifHeaderFont);
            ifHeaderStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
            ifHeaderStyle.setBorderBottom((short) 0x2);
            ifHeaderStyle.setBorderTop((short) 0x2);
            ifHeaderStyle.setBorderRight((short) 0x2);
            ifHeaderStyle.setBorderLeft((short) 0x2);

            
            CellStyle thenHeaderStyle = workbook.createCellStyle();
            thenHeaderStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            thenHeaderStyle.setAlignment(CellStyle.ALIGN_CENTER);
            thenHeaderStyle.setFont(thenHeaderFont);
            thenHeaderStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
            thenHeaderStyle.setBorderBottom((short) 0x2);
            thenHeaderStyle.setBorderTop((short) 0x2);
            thenHeaderStyle.setBorderRight((short) 0x2);
            thenHeaderStyle.setBorderLeft((short) 0x2);


            CellStyle userHeaderStyle = workbook.createCellStyle();
            userHeaderStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
            userHeaderStyle.setAlignment(CellStyle.ALIGN_CENTER);
            userHeaderStyle.setFont(thenHeaderFont);
            userHeaderStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
            userHeaderStyle.setBorderBottom((short) 0x2);
            userHeaderStyle.setBorderTop((short) 0x2);
            userHeaderStyle.setBorderRight((short) 0x2);
            userHeaderStyle.setBorderLeft((short) 0x2);
            
            CellStyle usageAndCardinalityStyle = workbook.createCellStyle();
            usageAndCardinalityStyle.setAlignment(CellStyle.ALIGN_CENTER);
            usageAndCardinalityStyle.setBorderBottom((short) 0x2);
            usageAndCardinalityStyle.setBorderTop((short) 0x2);
            usageAndCardinalityStyle.setBorderRight((short) 0x2);
            usageAndCardinalityStyle.setBorderLeft((short) 0x2);
            
			//Counting headers
			int headerCount = headers.getSelectors().size() + headers.getConstraints().size() +headers.getNarratives().size();
//			System.out.println("hERE " +headers..size());
			// Builing headerRows
			int rowNumber = 0;
			int headerCellNumber = 0;
			Row headerRow = sheet.createRow(rowNumber++);
			Row headerRow2 = sheet.createRow(rowNumber++);
			Cell usageHeaderCell = headerRow.createCell(headerCellNumber++);
			usageHeaderCell.setCellValue("Usage");
			usageHeaderCell.setCellStyle(usageAndCardinalityStyle);
			Cell usageHeaderCell2 = headerRow2.createCell(headerCellNumber);
			usageHeaderCell2.setCellValue("Usage");
			usageHeaderCell2.setCellStyle(usageAndCardinalityStyle);
			sheet.addMergedRegion(new CellRangeAddress(0,1,0,0));
			
			Cell cardinalityHeaderCell = headerRow.createCell(headerCellNumber++);
			cardinalityHeaderCell.setCellStyle(usageAndCardinalityStyle);
			sheet.addMergedRegion(new CellRangeAddress(0,1,1,2));
			cardinalityHeaderCell.setCellValue("Cardinality");
			headerCellNumber++;
			
			Cell ifCell = headerRow.createCell(headerCellNumber);
			headerCellNumber=headerCellNumber+headers.getSelectors().size();
			ifCell.setCellValue("IF");
		    ifCell.setCellStyle(ifHeaderStyle);
		    
			Cell thenCell = headerRow.createCell(headers.getSelectors().size()+3);
			headerCellNumber=headerCellNumber+headers.getConstraints().size();
			thenCell.setCellValue("THEN");
			thenCell.setCellStyle(thenHeaderStyle);
			
			Cell userCell = headerRow.createCell(headers.getSelectors().size()+headers.getConstraints().size()+3);
			headerCellNumber=headerCellNumber+headers.getSelectors().size();
			userCell.setCellValue("NARRATIVES");
			userCell.setCellStyle(userHeaderStyle);
			
			headerCellNumber=3;
			for (CoConstraintHeader coConstraintTableHeader : headers.getSelectors()) {
//				if(((DataElementHeader) coConstraintTableHeader).getColumnType().equals(ColumnType.CODE)) {
//					Cell cell = headerRow2.createCell(headerCellNumber++);
//					String headerLabel = ((DataElementHeader) coConstraintTableHeader).getColumnType().name()  + " " + ((DataElementHeader) coConstraintTableHeader).getName();
//					cell.setCellValue(headerLabel);
//					Cell cell2 = headerRow2.createCell(headerCellNumber++);
//					cell2.setCellValue("coConstraintTableHeader");
//					cell.setCellStyle(ifHeaderStyle);
//					cell2.setCellStyle(ifHeaderStyle);
//					sheet.addMergedRegion(new CellRangeAddress(1,1,cell.getColumnIndex(),cell.getColumnIndex()+1));
////					cell.setCellStyle(ifHeaderStyle);
////					headerCellNumber++;
//				}else
				{
					String headerLabel = ((DataElementHeader) coConstraintTableHeader).getColumnType().name()  + " " + ((DataElementHeader) coConstraintTableHeader).getName();
					Cell cell = headerRow2.createCell(headerCellNumber++);
					cell.setCellValue(headerLabel);
					cell.setCellStyle(ifHeaderStyle);
				}
			}
			for (CoConstraintHeader coConstraintTableHeader : headers.getConstraints()) {
//				if(((DataElementHeader) coConstraintTableHeader).getColumnType().equals(ColumnType.VARIES)) {
//					String headerLabel = ((DataElementHeader) coConstraintTableHeader).getColumnType().name()  + " " + ((DataElementHeader) coConstraintTableHeader).getName();
//					Cell cell1 = headerRow2.createCell(headerCellNumber++);
//					cell1.setCellValue(headerLabel);
//					cell1.setCellStyle(thenHeaderStyle);
//					Cell cell2 = headerRow2.createCell(headerCellNumber++);
//					cell2.setCellValue("coConstraintTableHeader");
//					cell2.setCellStyle(thenHeaderStyle);
//					sheet.addMergedRegion(new CellRangeAddress(1,1,cell1.getColumnIndex(),cell2.getColumnIndex()));
////					headerCellNumber++;
//				}else
				{
					String headerLabel = ((DataElementHeader) coConstraintTableHeader).getColumnType().name()  + " " + ((DataElementHeader) coConstraintTableHeader).getName();
					Cell cell = headerRow2.createCell(headerCellNumber++);
					cell.setCellValue(headerLabel);
					cell.setCellStyle(thenHeaderStyle);

				}
			}
			for (CoConstraintHeader coConstraintTableHeader : headers.getNarratives()) {
				String headerLabel =  "TEXT " + ((NarrativeHeader) coConstraintTableHeader).getTitle();
				Cell cell = headerRow2.createCell(headerCellNumber++);
				cell.setCellValue(headerLabel);
				cell.setCellStyle(userHeaderStyle);
			}

			if(thenCell.getColumnIndex() - ifCell.getColumnIndex() != 1){
						sheet.addMergedRegion(new CellRangeAddress(0,0,ifCell.getColumnIndex(),thenCell.getColumnIndex()-1));
			}
			if(userCell.getColumnIndex() - thenCell.getColumnIndex() != 1){
						sheet.addMergedRegion(new CellRangeAddress(0,0,thenCell.getColumnIndex(),userCell.getColumnIndex()-1));
			}
						if(headers.getNarratives().size() >= 1 ) {
						sheet.addMergedRegion(new CellRangeAddress(0,0,userCell.getColumnIndex(),userCell.getColumnIndex()+headers.getNarratives().size()-1));
						}
						System.out.println("Here6 :" + userCell.getColumnIndex());


			for (CoConstraint coConstraintTableRow : coConstraintTable.getCoConstraints()) {
				serializeRowToExcel(workbook, coConstraintTable, coConstraintTableRow, sheet, rowNumber++);
			}

			for (CoConstraintGroupBinding coConstraintTableGroup : coConstraintTable.getGroups()) {
				//Defining styles qnd fonts for groups headers
//				 XSSFFont groupHeader = workbook.createFont();
//				 ifHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
//				 ifHeaderFont.setBold(true);
//				 ifHeaderFont.setColor(HSSFColor.WHITE.index);
//				 
//				 XSSFFont groupHeaderStyle = workbook.createFont();
//				 thenHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
//				 thenHeaderFont.setBold(true);
				
				XSSFFont groupHeaderFont = workbook.createFont();
				groupHeaderFont.setFontHeightInPoints((short) 19);
				groupHeaderFont.setBold(true);
//				groupHeaderFont.setColor(HSSFColor.WHITE.index);

			      
	            CellStyle headerGroupStyle = workbook.createCellStyle();
	            headerGroupStyle.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
	            headerGroupStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
	            headerGroupStyle.setBorderBottom((short) 5);
	            headerGroupStyle.setBorderTop((short) 5);
	            headerGroupStyle.setBorderRight((short) 5);
	            headerGroupStyle.setBorderLeft((short) 5);
	            headerGroupStyle.setFont(groupHeaderFont);
	            headerGroupStyle.setAlignment(CellStyle.ALIGN_CENTER);


	            
				Row headerGroupRow = sheet.createRow(rowNumber++);
				int cellNumber = 0;
				Cell usageGroupCell = headerGroupRow.createCell(cellNumber++);
				usageGroupCell
				.setCellValue("   " + coConstraintTableGroup.getRequirement().getUsage().name()+"   ");
				usageGroupCell.setCellStyle(headerGroupStyle);
				Cell cardinalityCell1 = headerGroupRow.createCell(cellNumber++);
				cardinalityCell1
				.setCellValue("  "+coConstraintTableGroup.getRequirement().getCardinality().getMin()+"  ");
				cardinalityCell1.setCellStyle(headerGroupStyle);
				Cell cardinalityCell2 = headerGroupRow.createCell(cellNumber++);
				cardinalityCell2
				.setCellValue("  "+coConstraintTableGroup.getRequirement().getCardinality().getMax()+"  ");
				cardinalityCell2.setCellStyle(headerGroupStyle);
				Cell groupNameCell = headerGroupRow.createCell(cellNumber++);
				groupNameCell.setCellValue("Group name : " + ((CoConstraintGroupBindingContained) coConstraintTableGroup).getName());
				groupNameCell.setCellStyle(headerGroupStyle);
				sheet.addMergedRegion(new CellRangeAddress(rowNumber-1,rowNumber-1,cellNumber-1,cellNumber+headerCount-2));
				for (CoConstraint coConstraintTableRow : ((CoConstraintGroupBindingContained) coConstraintTableGroup).getCoConstraints()) {
					serializeRowToExcel(workbook,coConstraintTable, coConstraintTableRow, sheet, rowNumber++);
				}
				sheet.setDisplayGridlines(true);
				sheet.setPrintGridlines(true);
			
				System.out.println("look1 :" + sheet.isDisplayGridlines());
				System.out.println("look2 :" + sheet.isPrintGridlines());

			}
			
			for(int i = 0; i <= headerCount+22; i++) {
				sheet.autoSizeColumn(i);
			}

			System.out.println("Creating excel");
			try {
				ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				workbook.write(outputStream);
//				workbook.close();
				return outputStream;
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}

			System.out.println("Done");
		return null;
	}

	private void serializeRowToExcel(XSSFWorkbook workbook,CoConstraintTable coConstraintTable, CoConstraint coConstraintTableRow,
			XSSFSheet sheet, int rowNumber) {
		// Defining row Styles	
		final int ROW_FONT_SIZE = 15;

		
		 XSSFFont tableRowFont = workbook.createFont();
		 tableRowFont.setFontHeightInPoints((short) ROW_FONT_SIZE);
		 
		   CellStyle ifRowStyle = workbook.createCellStyle();
//           ifRowStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
           ifRowStyle.setAlignment(CellStyle.ALIGN_CENTER);
           ifRowStyle.setFont(tableRowFont);
           ifRowStyle.setWrapText(true);
//           ifRowStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
           ifRowStyle.setBorderBottom((short) 2);
           ifRowStyle.setBorderTop((short) 2);
           ifRowStyle.setBorderRight((short) 2);
           ifRowStyle.setBorderLeft((short) 2);
           
           CellStyle thenRowStyle = workbook.createCellStyle();
           thenRowStyle.setAlignment(CellStyle.ALIGN_CENTER);
           thenRowStyle.setFont(tableRowFont);
           ifRowStyle.setWrapText(true);

           thenRowStyle.setBorderBottom((short) 2);
           thenRowStyle.setBorderTop((short) 2);
           thenRowStyle.setBorderRight((short) 2);
           thenRowStyle.setBorderLeft((short) 2);

           CellStyle userRowStyle = workbook.createCellStyle();
           userRowStyle.setAlignment(CellStyle.ALIGN_CENTER);
           userRowStyle.setFont(tableRowFont);
           userRowStyle.setBorderBottom((short) 2);
           userRowStyle.setBorderTop((short) 2);
           userRowStyle.setBorderRight((short) 2);
           userRowStyle.setBorderLeft((short) 2);
           
           CellStyle usageAndCardinalityStyle = workbook.createCellStyle();
           usageAndCardinalityStyle.setAlignment(CellStyle.ALIGN_CENTER);
           usageAndCardinalityStyle.setBorderBottom((short) 2);
           usageAndCardinalityStyle.setBorderTop((short) 2);
           usageAndCardinalityStyle.setBorderRight((short) 2);
           usageAndCardinalityStyle.setBorderLeft((short) 2);

           
		Row row = sheet.createRow(rowNumber);
		int cellNumber = 0;
		Cell usageCell = row.createCell(cellNumber++);
		usageCell.setCellValue(coConstraintTableRow.getRequirement().getUsage().name());
		usageCell.setCellStyle(usageAndCardinalityStyle);
		Cell cardinalityCell1 = row.createCell(cellNumber++);
		cardinalityCell1.setCellValue(coConstraintTableRow.getRequirement().getCardinality().getMin());
		cardinalityCell1.setCellStyle(usageAndCardinalityStyle);
		Cell cardinalityCell2 = row.createCell(cellNumber++);
		cardinalityCell2.setCellValue(coConstraintTableRow.getRequirement().getCardinality().getMax());
		cardinalityCell2.setCellStyle(usageAndCardinalityStyle);


		for (CoConstraintHeader coConstraintTableHeader : coConstraintTable.getHeaders().getSelectors()) {
			for (String cellId : coConstraintTableRow.getCells().keySet()) {
				if (cellId.equals(coConstraintTableHeader.getKey())) {
//					if(((DataElementHeader) coConstraintTableHeader).getColumnType().equals(ColumnType.CODE)) {
//						Cell location = row.createCell(cellNumber++);
//						Cell value = row.createCell(cellNumber++);
//						location.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),((DataElementHeader) coConstraintTableHeader).getColumnType()).split(", ")[0]);
//						value.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),((DataElementHeader) coConstraintTableHeader).getColumnType()).split(", ")[1]);
//						location.setCellStyle(ifRowStyle);
//						value.setCellStyle(ifRowStyle);
//
//					}else 
					{
						Cell cell = row.createCell(cellNumber++);
						cell.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),((DataElementHeader) coConstraintTableHeader).getColumnType()));
						cell.setCellStyle(ifRowStyle);

					}

				}
			}
		}
		for (CoConstraintHeader coConstraintTableHeader : coConstraintTable.getHeaders().getConstraints()) {
			for (String cellId : coConstraintTableRow.getCells().keySet()) {
				if (cellId.equals(coConstraintTableHeader.getKey())) {
//					if(((DataElementHeader) coConstraintTableHeader).getColumnType().equals(ColumnType.VARIES)) {
//						if(coConstraintTableRow.getCells().get(cellId).getType().equals(ColumnType.CODE)) {
//							Cell location = row.createCell(cellNumber++);
//							Cell value = row.createCell(cellNumber++);
//							location.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),((DataElementHeader) coConstraintTableHeader).getColumnType()).split("\\r?\\n")[0]);
//							value.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),((DataElementHeader) coConstraintTableHeader).getColumnType()).split("\\r?\\n")[1]);
//							location.setCellStyle(thenRowStyle);
//							value.setCellStyle(thenRowStyle);
//							location.setCellStyle(thenRowStyle);
//						}else {
//							Cell cell1 = row.createCell(cellNumber++);
//							cell1.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),((DataElementHeader) coConstraintTableHeader).getColumnType()));
//							cell1.setCellStyle(thenRowStyle);
//							Cell cell2 = row.createCell(cellNumber++);
//							cell2.setCellStyle(thenRowStyle);
//							sheet.addMergedRegion(new CellRangeAddress(rowNumber,rowNumber,cell1.getColumnIndex(),cell2.getColumnIndex()));
////							cellNumber++;
//						}
//					}
//					else
					{
						Cell cell = row.createCell(cellNumber++);
						cell.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),((DataElementHeader) coConstraintTableHeader).getColumnType()));
						cell.setCellStyle(thenRowStyle);
					}
				}
			}
		}
		for (CoConstraintHeader coConstraintTableHeader : coConstraintTable.getHeaders().getNarratives()) {
			for (String cellId : coConstraintTableRow.getCells().keySet()) {
				if (cellId.equals(coConstraintTableHeader.getKey())) {
					Cell cell = row.createCell(cellNumber++);
					cell.setCellValue(WriteValueToCellExcel(coConstraintTableRow.getCells().get(cellId),ColumnType.VALUE));
					cell.setCellStyle(userRowStyle);
				}
			}
		}

		cellNumber = 0;
		for(int i = 0; i <= 922; i++) {
			sheet.autoSizeColumn(i);
		}

	}

//	public String writeValueToCell(CoConstraintTableCell coConstraintTableCell) {
//		String value = "";
//		switch (coConstraintTableCell.getType()) {
//		case Code:
//			CodeCell codeCell = (CodeCell) coConstraintTableCell;
//			String location = "";
//			for (String s : codeCell.getLocation()) {
//				if (codeCell.getLocation().size() == 1) {
//					location = codeCell.getLocation().get(0);
//				} else if (codeCell.getLocation().size() == 2) {
//					location = codeCell.getLocation().get(0) + " or " + codeCell.getLocation().get(1);
//				} else if (codeCell.getLocation().size() == 3) {
//					location = codeCell.getLocation().get(0) + " or " + codeCell.getLocation().get(1)
//							+ " or " + codeCell.getLocation().get(2);
//				} else {
//					location = location + "or" + s;
//				}
//			}
//			value=location+"|"+codeCell.getValue();
//			break;
//
//		case Value:
//			DataCell dataCell = (DataCell) coConstraintTableCell;
//			value = dataCell.getValue();
//			break;
//
//		case ValueSet:
//			VSCell vSCell = (VSCell) coConstraintTableCell;
//			String tdVsCellContent = "";
//			for (VSValue vSValue : vSCell.getVs()) {
//				if(vSCell.getVs().size()==1) {
//					tdVsCellContent = vSValue.getName();
//				}else {
//					tdVsCellContent = vSValue.getName()+  ", " +tdVsCellContent ;
//				}
//			}
//
//			value = tdVsCellContent;
//			break;
//
//		case textArea:
//			TextAreaCell textAreaCell = (TextAreaCell) coConstraintTableCell;
//			value = textAreaCell.getValue();
//			break;
//
//		case Ignore:
//			IgnoreCell ignoreCell = (IgnoreCell) coConstraintTableCell;
//			value="To do";
//						String datatypeName;
//						if (datatypesMap != null && datatypesMap.containsKey(ignoreCell.getValue())) {
//							Datatype datatype = datatypesMap.get(ignoreCell.getValue());
//							datatypeName = datatype.getName() + "-" + datatype.getDescription();
//							value=datatypeName;
//							} else if(!datatypesMap.containsKey(ignoreCell.getValue()) || datatypesMap==null) {
//							Datatype datatype = datatypeService.findById(ignoreCell.getValue());
//							datatypesMap.put(ignoreCell.getValue(), datatype);
//							datatypeName = datatype.getName() + "-" + datatype.getDescription();
//							value=datatypeName;
//						}
//			break;
//		}
//		return value;
//
//	}
	
	public String WriteValueToCellExcel(CoConstraintCell coConstraintTableCell, ColumnType columnType ) {
		String cellValue ="";		
		switch (columnType) {
		case CODE:
			CodeCell codeCell = (CodeCell) coConstraintTableCell;
			String location = "";
			for (int i : codeCell.getLocations()) {
				if (codeCell.getLocations().size() == 1) {
					location = String.valueOf(codeCell.getLocations().get(0));
				} else if (codeCell.getLocations().size() == 2) {
					location = codeCell.getLocations().get(0) + " or " + codeCell.getLocations().get(1);
				} else if (codeCell.getLocations().size() == 3) {
					location = codeCell.getLocations().get(0) + " or " + codeCell.getLocations().get(1)
							+ " or " + codeCell.getLocations().get(2);
				} else {
					location = location + "or" + i;
				}
			}
			cellValue = "Code: " + codeCell.getCode() + ",  " + "Code System: " + codeCell.getCodeSystem() + ",  " + "location: " + location;
			break;

		case VALUE:
			ValueCell dataCell = (ValueCell) coConstraintTableCell;
			if(dataCell.getValue() != null) {
				cellValue = dataCell.getValue();	
			} else {
				cellValue = "";
			}
			break;

		case VALUESET:
			ValueSetCell vSCell = (ValueSetCell) coConstraintTableCell;

			if(vSCell.getBindings() != null) {
			for(ValuesetBinding valuesetBinding : vSCell.getBindings()) {
				cellValue = "Strength: " + valuesetBinding.getStrength()+ ",  "+ "Location: " + valuesetBinding.getValuesetLocations().toString() + ",  " + "Valuesets: " + generateValuesetNames(valuesetBinding.getValueSets());
						}
			}else {
				cellValue = "";
			}
			break;

		case VARIES:
			VariesCell variesCell = (VariesCell) coConstraintTableCell;
			if(variesCell.getCellType() != null) {
				cellValue = WriteValueToCellExcel( variesCell.getCellValue(), variesCell.getCellType());
			} else {
				cellValue = "";
			}
				
//			if(coConstraintTableCell.getCardinalityMax() != null) {
//				Element tdCard = new Element("td");
//				tdCard.appendChild(coConstraintTableCell.getCardinalityMax());
//				tdCell.appendChild(tdCard);
//			}
			break;

		case DATATYPE:		
			DatatypeCell datatypeCell = (DatatypeCell) coConstraintTableCell;
			Datatype datatype = datatypeService.findById(datatypeCell.getDatatypeId());
			if(datatype != null) {
				cellValue = "Value: " + datatype.getName() + ",  " + "Flavor: " + datatype.getLabel();
			} else {
				cellValue = "";
			}				
			break;
		}
		
	return cellValue;
}
	
	public int countNumberOfColumnInSelector(List<CoConstraintHeader> list) {
		int doubleColumnCount=0;
		for(CoConstraintHeader coConstraintTableHeader : list) {
			if(((DataElementHeader) coConstraintTableHeader).getColumnType().equals(ColumnType.CODE)) {
				doubleColumnCount++;
			}
		}
		return doubleColumnCount+list.size();
	}

	public int countNumberOfColumnInData(List<CoConstraintHeader> list) {
		int doubleColumnCount=0;
		for(CoConstraintHeader coConstraintTableHeader : list) {
			if(((DataElementHeader) coConstraintTableHeader).getColumnType().equals(ColumnType.VARIES)) {
				doubleColumnCount++;
			}
		}
		return doubleColumnCount+list.size();
	}
	
//	private void replaceId(C content, Map<String, String> datatypes) {
//		if (content.getFree() != null) {
//			List<IgnoreCell> flavorCells = content.getFree().stream().map(row -> {
//				return row.getCells().entrySet().stream().filter(cell -> {
//					return cell.getValue() instanceof IgnoreCell;
//				}).map(ignore -> {
//					return (IgnoreCell) ignore.getValue();
//				}).collect(Collectors.toList());
//			}).reduce(new ArrayList<IgnoreCell>(), (x, y) -> {
//				x.addAll(y);
//				return x;
//			});
//
//			for (IgnoreCell cell : flavorCells) {
//				if (datatypes.containsKey(cell.getValue())) {
//					cell.setValue(datatypes.get(cell.getValue()));
//				}
//			}
//		}
//
//		if (content.getGroups() != null) {
//			for (CoConstraintTableGroup group : content.getGroups()) {
//				this.replaceId(group.getContent(), datatypes);
//			}
//		}
//	}
	public String generateValuesetNames(List<String> ids){
		List<String> valuesetBindings = new ArrayList<String>();
		if(ids != null) {
		for(String id : ids) {
			Valueset vs = valuesetService.findById(id);
			valuesetBindings.add(vs.getBindingIdentifier());
			}
		}
		return valuesetBindings.toString();
	}


}
