//package gov.nist.hit.hl7.igamt.segment.service.impl;
//
//import java.io.ByteArrayOutputStream;
//import java.io.FileNotFoundException;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.io.OutputStream;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//import org.apache.poi.hssf.usermodel.HSSFCellStyle;
//import org.apache.poi.hssf.util.HSSFColor;
//import org.apache.poi.ss.usermodel.BorderStyle;
//import org.apache.poi.ss.usermodel.Cell;
//import org.apache.poi.ss.usermodel.CellStyle;
//import org.apache.poi.ss.usermodel.FillPatternType;
//import org.apache.poi.ss.usermodel.IndexedColors;
//import org.apache.poi.ss.usermodel.Row;
//import org.apache.poi.ss.util.CellRangeAddress;
//import org.apache.poi.xssf.usermodel.XSSFCellStyle;
//import org.apache.poi.xssf.usermodel.XSSFFont;
//import org.apache.poi.xssf.usermodel.XSSFSheet;
//import org.apache.poi.xssf.usermodel.XSSFWorkbook;
//import org.bson.types.ObjectId;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Sort;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.mongodb.core.query.Query;
//import org.springframework.stereotype.Service;
//
//import com.google.common.collect.ImmutableMap;
//import com.google.common.collect.Maps;
//
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CellTemplateType;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CellType;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableContent;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableGroup;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableHeader;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableHeaders;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableRow;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CodeCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.DataCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.IgnoreCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.TextAreaCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.VSCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.VSValue;
//import gov.nist.hit.hl7.igamt.coconstraints.repository.CoConstraintRepository;
//import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
//import gov.nist.hit.hl7.igamt.segment.domain.Segment;
//import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
//import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
//import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
//import gov.nist.hit.hl7.igamt.segment.verification.CoConstraintVerifyService;
//import nu.xom.Attribute;
//import nu.xom.Element;
//
//@Service
//public class CoConstraintServiceImpl implements CoConstraintService {
//
//	@Autowired
//	private MongoTemplate mongoTemplate;
//
//	@Autowired
//	private CoConstraintRepository repo;
//	@Autowired
//	private SegmentService segmentService;
//	@Autowired
//	private CoConstraintVerifyService verifyService;
//	@Autowired
//	CoConstraintService coConstraintService;
//	@Autowired
//	DatatypeService datatypeService;
//
//	  private Map<String, Datatype> datatypesMap = new HashMap<>();
//
//	@Override
//	public CoConstraintTable getCoConstraintForSegment(String id) {
//		return repo.findById(id).orElse(null);
//	}
//
//	@Override
//	public Map<String, String> references(CoConstraintTable cc) {
//		// TODO Auto-generated method stub
//		return null;
//	}
//
//	@Override
//	public CoConstraintTable saveCoConstraintForSegment(String id, CoConstraintTable cc, String user)
//			throws CoConstraintSaveException {
//		Segment segment = segmentService.findById(id);
//		if (segment == null) {
//			throw new CoConstraintSaveException(Maps.newHashMap(ImmutableMap.<String, String>builder()
//					.put("Segment", "Segment " + id + " does not exists").build()));
//		} else if (segment.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
//			throw new CoConstraintSaveException(Maps.newHashMap(ImmutableMap.<String, String>builder()
//					.put("Segment", "Segment " + id + " scope is HL7 Standard").build()));
//		} else if (!segment.getUsername().equals(user)) {
//			throw new CoConstraintSaveException(Maps.newHashMap(ImmutableMap.<String, String>builder()
//					.put("Segment", "Segment " + id + " does not belong to authenticated user : " + user).build()));
//		} else {
//			Map<String, String> verify = this.verifyService.verify(cc, segment);
//			if (verify.keySet().size() > 0) {
//				throw new CoConstraintSaveException(verify);
//			} else {
//				cc.setId(segment.getId());
//				this.repo.save(cc);
//				return cc;
//			}
//		}
//	}
//
//	@Override
//	public CoConstraintTable clone(Map<String, String> valueSets,Map<String, String> datatypes, String segmentId,
//			CoConstraintTable cc) {
//		CoConstraintTable clone = cc.clone();
//		clone.setId(segmentId);
//		this.replaceId(clone.getContent(), datatypes);
//		return clone;
//	}
//
//	private void replaceId(CoConstraintTableContent content, Map<String, String> datatypes) {
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
//
//	public ByteArrayOutputStream exportToExcel(String id) {
////		final String FILE_NAME = "/Users/ynb4/Desktop/MyFirstExcelTryout.xlsx";
//		final int HEADER_FONT_SIZE = 20;
//		if (coConstraintService.getCoConstraintForSegment(id) != null) {
//			CoConstraintTable coConstraintTable = coConstraintService.getCoConstraintForSegment(id);
//
//			XSSFWorkbook workbook = new XSSFWorkbook();
//			XSSFSheet sheet = workbook.createSheet("Coconstaints Export");
//
//
//			CoConstraintTableHeaders headers = coConstraintTable.getHeaders();
//			CoConstraintTableContent content = coConstraintTable.getContent();
//
//			//Defining styles for headers
//			 XSSFFont ifHeaderFont = workbook.createFont();
//			 ifHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
//			 ifHeaderFont.setBold(true);
//			 ifHeaderFont.setColor(HSSFColor.WHITE.index);
//
//			 XSSFFont thenHeaderFont = workbook.createFont();
//			 thenHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
//			 thenHeaderFont.setBold(true);
//
//            CellStyle ifHeaderStyle = workbook.createCellStyle();
//            ifHeaderStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
//            ifHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//            ifHeaderStyle.setAlignment(CellStyle.ALIGN_CENTER);
//            ifHeaderStyle.setFont(ifHeaderFont);
//            ifHeaderStyle.setBorderBottom(BorderStyle.MEDIUM);
//            ifHeaderStyle.setBorderTop(BorderStyle.MEDIUM);
//            ifHeaderStyle.setBorderRight(BorderStyle.MEDIUM);
//            ifHeaderStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//
//            CellStyle thenHeaderStyle = workbook.createCellStyle();
//            thenHeaderStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
//            thenHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//            thenHeaderStyle.setAlignment(CellStyle.ALIGN_CENTER);
//            thenHeaderStyle.setFont(thenHeaderFont);
//            thenHeaderStyle.setBorderBottom(BorderStyle.MEDIUM);
//            thenHeaderStyle.setBorderTop(BorderStyle.MEDIUM);
//            thenHeaderStyle.setBorderRight(BorderStyle.MEDIUM);
//            thenHeaderStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//
//            CellStyle userHeaderStyle = workbook.createCellStyle();
//            userHeaderStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
//            userHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//            userHeaderStyle.setAlignment(CellStyle.ALIGN_CENTER);
//            userHeaderStyle.setFont(thenHeaderFont);
//            userHeaderStyle.setBorderBottom(BorderStyle.MEDIUM);
//            userHeaderStyle.setBorderTop(BorderStyle.MEDIUM);
//            userHeaderStyle.setBorderRight(BorderStyle.MEDIUM);
//            userHeaderStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//            CellStyle usageAndCardinalityStyle = workbook.createCellStyle();
//            usageAndCardinalityStyle.setAlignment(CellStyle.ALIGN_CENTER);
//            usageAndCardinalityStyle.setBorderBottom(BorderStyle.MEDIUM);
//            usageAndCardinalityStyle.setBorderTop(BorderStyle.MEDIUM);
//            usageAndCardinalityStyle.setBorderRight(BorderStyle.MEDIUM);
//            usageAndCardinalityStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//			//Counting headers
//			int headerCount = countNumberOfColumnInSelector(headers.getSelectors())+ countNumberOfColumnInData(headers.getData())+headers.getUser().size();
//			System.out.println("hERE " +headers.getUser().size());
//			// Builing headerRows
//			int rowNumber = 0;
//			int headerCellNumber = 0;
//			Row headerRow = sheet.createRow(rowNumber++);
//			Row headerRow2 = sheet.createRow(rowNumber++);
//			Cell usageHeaderCell = headerRow.createCell(headerCellNumber++);
//			usageHeaderCell.setCellValue("Usage");
//			usageHeaderCell.setCellStyle(usageAndCardinalityStyle);
//			Cell usageHeaderCell2 = headerRow2.createCell(headerCellNumber);
//			usageHeaderCell2.setCellValue("Usage");
//			usageHeaderCell2.setCellStyle(usageAndCardinalityStyle);
//			sheet.addMergedRegion(new CellRangeAddress(0,1,0,0));
//
//			Cell cardinalityHeaderCell = headerRow.createCell(headerCellNumber++);
//			cardinalityHeaderCell.setCellStyle(usageAndCardinalityStyle);
//			sheet.addMergedRegion(new CellRangeAddress(0,1,1,2));
//			cardinalityHeaderCell.setCellValue("Cardinality");
//			headerCellNumber++;
//
//			Cell ifCell = headerRow.createCell(headerCellNumber);
//			headerCellNumber=headerCellNumber+headers.getSelectors().size();
//			ifCell.setCellValue("IF");
//		    ifCell.setCellStyle(ifHeaderStyle);
//
//			Cell thenCell = headerRow.createCell(countNumberOfColumnInSelector(headers.getSelectors())+3);
//			headerCellNumber=headerCellNumber+headers.getData().size();
//			thenCell.setCellValue("THEN");
//			thenCell.setCellStyle(thenHeaderStyle);
//
//			Cell userCell = headerRow.createCell(countNumberOfColumnInSelector(headers.getSelectors())+countNumberOfColumnInData(headers.getData())+3);
//			headerCellNumber=headerCellNumber+headers.getSelectors().size();
//			userCell.setCellValue("USER");
//			userCell.setCellStyle(userHeaderStyle);
//
//			headerCellNumber=3;
//			for (CoConstraintTableHeader coConstraintTableHeader : headers.getSelectors()) {
//				if(coConstraintTableHeader.getContent().getType().equals(CellType.Code)) {
//					Cell cell = headerRow2.createCell(headerCellNumber++);
//					cell.setCellValue(coConstraintTableHeader.getLabel());
//					Cell cell2 = headerRow2.createCell(headerCellNumber++);
//					cell2.setCellValue(coConstraintTableHeader.getLabel());
//					cell.setCellStyle(ifHeaderStyle);
//					cell2.setCellStyle(ifHeaderStyle);
//					sheet.addMergedRegion(new CellRangeAddress(1,1,cell.getColumnIndex(),cell.getColumnIndex()+1));
////					cell.setCellStyle(ifHeaderStyle);
////					headerCellNumber++;
//				}else {
//					Cell cell = headerRow2.createCell(headerCellNumber++);
//					cell.setCellValue(coConstraintTableHeader.getLabel());
//					cell.setCellStyle(ifHeaderStyle);
//				}
//			}
//			for (CoConstraintTableHeader coConstraintTableHeader : headers.getData()) {
//				if(coConstraintTableHeader.getTemplate() != null && coConstraintTableHeader.getTemplate().equals(CellTemplateType.Varies)) {
//					Cell cell1 = headerRow2.createCell(headerCellNumber++);
//					cell1.setCellValue(coConstraintTableHeader.getLabel());
//					cell1.setCellStyle(thenHeaderStyle);
//					Cell cell2 = headerRow2.createCell(headerCellNumber++);
//					cell2.setCellValue(coConstraintTableHeader.getLabel());
//					cell2.setCellStyle(thenHeaderStyle);
//					sheet.addMergedRegion(new CellRangeAddress(1,1,cell1.getColumnIndex(),cell2.getColumnIndex()));
////					headerCellNumber++;
//				}else {
//					Cell cell = headerRow2.createCell(headerCellNumber++);
//					cell.setCellValue(coConstraintTableHeader.getLabel());
//					cell.setCellStyle(thenHeaderStyle);
//
//				}
//			}
//			for (CoConstraintTableHeader coConstraintTableHeader : headers.getUser()) {
//				Cell cell = headerRow2.createCell(headerCellNumber++);
//				cell.setCellValue(coConstraintTableHeader.getLabel());
//				cell.setCellStyle(userHeaderStyle);
//			}
//
//						sheet.addMergedRegion(new CellRangeAddress(0,0,ifCell.getColumnIndex(),thenCell.getColumnIndex()-1));
//						sheet.addMergedRegion(new CellRangeAddress(0,0,thenCell.getColumnIndex(),userCell.getColumnIndex()-1));
//						if(headers.getUser().size() != 1) {
//						sheet.addMergedRegion(new CellRangeAddress(0,0,userCell.getColumnIndex(),userCell.getColumnIndex()+headers.getUser().size()-1));
//						}
//						System.out.println("Here6 :" + userCell.getColumnIndex());
//
//
//			for (CoConstraintTableRow coConstraintTableRow : coConstraintTable.getContent().getFree()) {
//				serializeRowToExcel(workbook, coConstraintTable, coConstraintTableRow, sheet, rowNumber++);
//			}
//
//			for (CoConstraintTableGroup coConstraintTableGroup : content.getGroups()) {
//				//Defining styles qnd fonts for groups headers
////				 XSSFFont groupHeader = workbook.createFont();
////				 ifHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
////				 ifHeaderFont.setBold(true);
////				 ifHeaderFont.setColor(HSSFColor.WHITE.index);
////
////				 XSSFFont groupHeaderStyle = workbook.createFont();
////				 thenHeaderFont.setFontHeightInPoints((short) HEADER_FONT_SIZE);
////				 thenHeaderFont.setBold(true);
//
//				XSSFFont groupHeaderFont = workbook.createFont();
//				groupHeaderFont.setFontHeightInPoints((short) 19);
//				groupHeaderFont.setBold(true);
////				groupHeaderFont.setColor(HSSFColor.WHITE.index);
//
//
//	            CellStyle headerGroupStyle = workbook.createCellStyle();
//	            headerGroupStyle.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
//	            headerGroupStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//	            headerGroupStyle.setBorderBottom(BorderStyle.THICK);
//	            headerGroupStyle.setBorderTop(BorderStyle.THICK);
//	            headerGroupStyle.setBorderRight(BorderStyle.THICK);
//	            headerGroupStyle.setBorderLeft(BorderStyle.THICK);
//	            headerGroupStyle.setFont(groupHeaderFont);
//	            headerGroupStyle.setAlignment(CellStyle.ALIGN_CENTER);
//
//
//
//				Row headerGroupRow = sheet.createRow(rowNumber++);
//				int cellNumber = 0;
//				Cell usageGroupCell = headerGroupRow.createCell(cellNumber++);
//				usageGroupCell
//				.setCellValue("   " + coConstraintTableGroup.getData().getRequirements().getUsage().name()+"   ");
//				usageGroupCell.setCellStyle(headerGroupStyle);
//				Cell cardinalityCell1 = headerGroupRow.createCell(cellNumber++);
//				cardinalityCell1
//				.setCellValue("  "+coConstraintTableGroup.getData().getRequirements().getCardinality().getMin()+"  ");
//				cardinalityCell1.setCellStyle(headerGroupStyle);
//				Cell cardinalityCell2 = headerGroupRow.createCell(cellNumber++);
//				cardinalityCell2
//				.setCellValue("  "+coConstraintTableGroup.getData().getRequirements().getCardinality().getMax()+"  ");
//				cardinalityCell2.setCellStyle(headerGroupStyle);
//				Cell groupNameCell = headerGroupRow.createCell(cellNumber++);
//				groupNameCell.setCellValue(coConstraintTableGroup.getData().getName());
//				groupNameCell.setCellStyle(headerGroupStyle);
//				sheet.addMergedRegion(new CellRangeAddress(rowNumber-1,rowNumber-1,cellNumber-1,cellNumber+headerCount-2));
//				for (CoConstraintTableRow coConstraintTableRow : coConstraintTableGroup.getContent().getFree()) {
//					serializeRowToExcel(workbook,coConstraintTable, coConstraintTableRow, sheet, rowNumber++);
//				}
//				sheet.setDisplayGridlines(true);
//				sheet.setPrintGridlines(true);
//
//				System.out.println("look1 :" + sheet.isDisplayGridlines());
//				System.out.println("look2 :" + sheet.isPrintGridlines());
//
//			}
//
//			System.out.println("Creating excel");
//			try {
//				ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//				workbook.write(outputStream);
//				workbook.close();
//				return outputStream;
//			} catch (FileNotFoundException e) {
//				e.printStackTrace();
//			} catch (IOException e) {
//				e.printStackTrace();
//			}
//
//			System.out.println("Done");
//
//			for(int i = 0; i <= headerCount+22; i++) {
//				sheet.autoSizeColumn(i);
//			}
//
//
//
//		}
//
//		return null;
//	}
//
//	private void serializeRowToExcel(XSSFWorkbook workbook,CoConstraintTable coConstraintTable, CoConstraintTableRow coConstraintTableRow,
//			XSSFSheet sheet, int rowNumber) {
//		// Defining row Styles
//		final int ROW_FONT_SIZE = 15;
//
//
//		 XSSFFont tableRowFont = workbook.createFont();
//		 tableRowFont.setFontHeightInPoints((short) ROW_FONT_SIZE);
//
//		   CellStyle ifRowStyle = workbook.createCellStyle();
//           ifRowStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
//           ifRowStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//           ifRowStyle.setAlignment(CellStyle.ALIGN_CENTER);
//           ifRowStyle.setFont(tableRowFont);
//           ifRowStyle.setBorderBottom(BorderStyle.MEDIUM);
//           ifRowStyle.setBorderTop(BorderStyle.MEDIUM);
//           ifRowStyle.setBorderRight(BorderStyle.MEDIUM);
//           ifRowStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//           CellStyle thenRowStyle = workbook.createCellStyle();
//           thenRowStyle.setAlignment(CellStyle.ALIGN_CENTER);
//           thenRowStyle.setFont(tableRowFont);
//           thenRowStyle.setBorderBottom(BorderStyle.MEDIUM);
//           thenRowStyle.setBorderTop(BorderStyle.MEDIUM);
//           thenRowStyle.setBorderRight(BorderStyle.MEDIUM);
//           thenRowStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//           CellStyle userRowStyle = workbook.createCellStyle();
//           userRowStyle.setAlignment(CellStyle.ALIGN_CENTER);
//           userRowStyle.setFont(tableRowFont);
//           userRowStyle.setBorderBottom(BorderStyle.MEDIUM);
//           userRowStyle.setBorderTop(BorderStyle.MEDIUM);
//           userRowStyle.setBorderRight(BorderStyle.MEDIUM);
//           userRowStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//           CellStyle usageAndCardinalityStyle = workbook.createCellStyle();
//           usageAndCardinalityStyle.setAlignment(CellStyle.ALIGN_CENTER);
//           usageAndCardinalityStyle.setBorderBottom(BorderStyle.MEDIUM);
//           usageAndCardinalityStyle.setBorderTop(BorderStyle.MEDIUM);
//           usageAndCardinalityStyle.setBorderRight(BorderStyle.MEDIUM);
//           usageAndCardinalityStyle.setBorderLeft(BorderStyle.MEDIUM);
//
//
//		Row row = sheet.createRow(rowNumber);
//		int cellNumber = 0;
//		Cell usageCell = row.createCell(cellNumber++);
//		usageCell.setCellValue(coConstraintTableRow.getRequirements().getUsage().name());
//		usageCell.setCellStyle(usageAndCardinalityStyle);
//		Cell cardinalityCell1 = row.createCell(cellNumber++);
//		cardinalityCell1.setCellValue(coConstraintTableRow.getRequirements().getCardinality().getMin());
//		cardinalityCell1.setCellStyle(usageAndCardinalityStyle);
//		Cell cardinalityCell2 = row.createCell(cellNumber++);
//		cardinalityCell2.setCellValue(coConstraintTableRow.getRequirements().getCardinality().getMax());
//		cardinalityCell2.setCellStyle(usageAndCardinalityStyle);
//
//
//		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getSelectors()) {
//			for (String cellId : coConstraintTableRow.getCells().keySet()) {
//				if (cellId.equals(coConstraintTableHeader.getId())) {
//					if(coConstraintTableRow.getCells().get(cellId).getType().equals(CellType.Code)) {
//						Cell location = row.createCell(cellNumber++);
//						Cell value = row.createCell(cellNumber++);
//						location.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)).split("\\|")[0]);
//						value.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)).split("\\|")[1]);
//						location.setCellStyle(ifRowStyle);
//						value.setCellStyle(ifRowStyle);
//
//					}else {
//						Cell cell = row.createCell(cellNumber++);
//						cell.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)));
//						cell.setCellStyle(ifRowStyle);
//
//					}
//
//				}
//			}
//		}
//		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getData()) {
//			for (String cellId : coConstraintTableRow.getCells().keySet()) {
//				if (cellId.equals(coConstraintTableHeader.getId())) {
//					if(coConstraintTableHeader.getTemplate() != null && coConstraintTableHeader.getTemplate().equals(CellTemplateType.Varies)) {
//						if(coConstraintTableRow.getCells().get(cellId).getType().equals(CellType.Code)) {
//							Cell location = row.createCell(cellNumber++);
//							Cell value = row.createCell(cellNumber++);
//							location.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)).split("\\|")[0]);
//							value.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)).split("\\|")[1]);
//							location.setCellStyle(thenRowStyle);
//							value.setCellStyle(thenRowStyle);
//							location.setCellStyle(thenRowStyle);
//						}else {
//							Cell cell1 = row.createCell(cellNumber++);
//							cell1.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)));
//							cell1.setCellStyle(thenRowStyle);
//							Cell cell2 = row.createCell(cellNumber++);
//							cell2.setCellStyle(thenRowStyle);
//							sheet.addMergedRegion(new CellRangeAddress(rowNumber,rowNumber,cell1.getColumnIndex(),cell2.getColumnIndex()));
////							cellNumber++;
//						}
//					}else {
//						Cell cell = row.createCell(cellNumber++);
//						cell.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)));
//						cell.setCellStyle(thenRowStyle);
//					}
//				}
//			}
//		}
//		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getUser()) {
//			for (String cellId : coConstraintTableRow.getCells().keySet()) {
//				if (cellId.equals(coConstraintTableHeader.getId())) {
//					Cell cell = row.createCell(cellNumber++);
//					cell.setCellValue(writeValueToCell(coConstraintTableRow.getCells().get(cellId)));
//					cell.setCellStyle(userRowStyle);
//				}
//			}
//		}
//
//		cellNumber = 0;
//		for(int i = 0; i <= 922; i++) {
//			sheet.autoSizeColumn(i);
//		}
//
//	}
//
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
//	public int countNumberOfColumnInSelector(List<CoConstraintTableHeader> list) {
//		int doubleColumnCount=0;
//		for(CoConstraintTableHeader coConstraintTableHeader : list) {
//			if(coConstraintTableHeader.getContent().getType().equals(CellType.Code)) {
//				doubleColumnCount++;
//			}
//		}
//		return doubleColumnCount+list.size();
//	}
//
//	public int countNumberOfColumnInData(List<CoConstraintTableHeader> list) {
//		int doubleColumnCount=0;
//		for(CoConstraintTableHeader coConstraintTableHeader : list) {
//			if(coConstraintTableHeader.getTemplate() != null && coConstraintTableHeader.getTemplate().equals(CellTemplateType.Varies)) {
//				doubleColumnCount++;
//			}
//		}
//		return doubleColumnCount+list.size();
//	}
//
//}
