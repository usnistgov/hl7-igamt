package gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser;

import com.google.common.base.Strings;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;

import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;

import java.util.*;

public class CoConstraintSpreadSheetParser {
	private int if_start = 3;
	private int if_end = 3;
	private int then_start = 0;
	private int then_end = 0;
	private int groupBy = -1;
	private int narratives_start = 0;
	private int narratives_end = 0;
	private int cc_end = 0;
	private final int HEADER_ROW = 1;
	private final int CC_ROW_START = 2;
	private final int USAGE = 0;
	private final int MIN_CARD = 1;
	private final int MAX_CARD = 2;
	private List<Integer> groupHeader = new ArrayList<>();
	
	private List<IgamtObjectError> errors = new ArrayList<IgamtObjectError>();


	public boolean wrongHeaderStructure = false;
	public boolean emptyCellInRow = false;

	public CoConstraintSpreadSheetParser(Sheet sheet) {
		boolean foundNarrative = false;
		boolean foundIf = false;
		boolean foundThen = false;
		boolean groupBy = false;

		int numberMergedCells = sheet.getNumMergedRegions();
		if(numberMergedCells == 0) {
			this.wrongHeaderStructure = true;
		}
//		for(int i = 0; i < sheet.getNumMergedRegions(); i++) {
//			CellRangeAddress region = sheet.getMergedRegion(i);
//			Cell value = sheet.getRow(region.getFirstRow()).getCell(region.getFirstColumn());
//			if(value.getCellType() != Cell.CELL_TYPE_STRING || (!((value.getStringCellValue().equals("IF") || value.getStringCellValue().equals("THEN") || value.getStringCellValue().equals("NARRATIVES"))))) {
//				this.wrongHeaderStructure = true;
//			}
//		}
		for(int i = 0; i < sheet.getNumMergedRegions(); i++) {
			CellRangeAddress region = sheet.getMergedRegion(i);
			Cell value = sheet.getRow(region.getFirstRow()).getCell(region.getFirstColumn());
			if(value.getCellType() == Cell.CELL_TYPE_STRING) {
				switch (value.getStringCellValue()) {
				case "IF" :
					this.if_start = region.getFirstColumn();
					this.if_end = region.getLastColumn();
					foundIf = true;
					break;
				case "THEN" :
					foundThen = true;
					this.then_start = region.getFirstColumn();
					this.then_end = region.getLastColumn();
					break;
				case "NARRATIVES" :
					foundNarrative = true;
					this.narratives_start = region.getFirstColumn();
					this.narratives_end = region.getLastColumn();
					break;
				default:
					checkAndAddGroup(region.getFirstRow());
				}
			}
		}
		int position = -1;
		
		position = this.find(sheet, "Group By");
		if(position == -1) {
			 groupBy = false;
			// HANDLE ERROR
		} else {
			this.groupBy = position;
		}

		if(!foundIf) {
			position = this.find(sheet, "IF");
			if(position == -1) {
				// HANDLE ERROR
			} else {
				this.if_start = position;
				this.if_end = position;
			}
		}
		
		if(!foundThen) {
			position = this.find(sheet, "THEN");
			if(position == -1) {
				// HANDLE ERROR
			} else {
				this.then_start = position;
				this.then_end = position;
			}
		}
		
		if(!foundNarrative) {
			position = this.find(sheet, "NARRATIVES");
			if(position == -1) {
				// HANDLE ERROR
			} else {
				this.narratives_start = position;
				this.narratives_end = position;
			}
		}
		
		if(this.groupHeader.size() > 0) {
			this.cc_end = this.groupHeader.stream().reduce(Integer.MAX_VALUE, Math::min) - 1;
		} else {
			this.cc_end = sheet.getLastRowNum();
		}

//		if(this.then_end == 0) {
//			this.then_start = this.if_end+1;
//			this.then_end = this.if_end+1;
//		}
//		if(this.narratives_end == 0 && this.then_end+1 < sheet.getRow(1).getPhysicalNumberOfCells() ) {
//			if(row1.getCell(this.then_end+1).getStringCellValue().equals("Group By")) {
//				this.narratives_start = this.then_end+2;
//				this.narratives_end = this.then_end+2;
//			} else if(row1.getCell(this.then_end+1).getStringCellValue().equals("Narratives")){
//				this.narratives_start = this.then_end+1;
//				this.narratives_end = this.then_end+1;
//			}
//		
//		}

//		System.out.println("D");
	}

	public int find(Sheet sheet, String columnType) {
		Row firstRow = sheet.getRow(0);
		Iterator<Cell> iterator = firstRow.cellIterator();
		while (iterator.hasNext()) {
			Cell value = iterator.next();
			if(value != null && value.getCellType() == Cell.CELL_TYPE_STRING && !Strings.isNullOrEmpty(value.getStringCellValue()) && value.getStringCellValue().equals(columnType)) {
				return value.getColumnIndex();
			}
		}
		return -1;
	}

	public ParsedTable parseTable(Sheet sheet) {
		ParsedTable table = new ParsedTable();
		table.setGrouperPosition(this.groupBy);
		table.setHasGrouper(this.groupBy != -1);
		// Parse Headers
		Row headers = sheet.getRow(HEADER_ROW);
		if(headers != null) {
			table.setIfHeaders(this.parseHeader(headers, if_start, if_end));
			table.setThenHeaders(this.parseHeader(headers, then_start, then_end));
			if(table.isHasGrouper()) {
				table.setGrouperValue(headers.getCell(this.groupBy).getStringCellValue());
			}
			table.setNarrativeHeaders(this.parseHeader(headers, narratives_start, narratives_end));
		}

		// Parse Table
		if(this.emptyCellInRow == false) {
		for (int i = CC_ROW_START; i <= sheet.getLastRowNum(); i++) {

			//Parse Group
			if(this.groupHeader.contains(i)) {
				ParsedGroup group = this.parseGroup(i, sheet);
				table.getParsedGroups().add(group);
			}
			// Parse Co-Constraint
			else if(i <= this.cc_end) {
				Row cc = sheet.getRow(i);
				ParsedCoConstraint coConstraint = this.parseCoConstraint(cc);
				table.getParsedCoConstraints().add(coConstraint);
			}
		}
		}
		return table;
	}

	public Map<Integer, String> parseHeader(Row row, int start, int end) {
		Map<Integer, String> header = new HashMap<>();
		for(int i = start; i <= end; i++) {
			if(row.getCell(i) != null) {
				header.put(i, row.getCell(i).getStringCellValue());
			} else {
//				this.emptyCellInRow = true;
			}
		}
		return header;
	}


	public ParsedGroup parseGroup(int start, Sheet sheet) {
		ParsedGroup parsedGroup = new ParsedGroup();

		// Parse Group Header
		Row header = sheet.getRow(start);
		for(int j = 0; j <= header.getLastCellNum(); j++) {
			Cell cell = header.getCell(j);
			if(j == USAGE) {
				parsedGroup.usage = cell.getStringCellValue();
			} else if(j == MIN_CARD) {
				parsedGroup.minCardinality = Integer.parseInt(cell.getStringCellValue().trim());
			} else if(j == MAX_CARD) {
				parsedGroup.maxCardinality = cell.getStringCellValue();
			} else if(cell.getCellType() == Cell.CELL_TYPE_STRING) {
				parsedGroup.name = cell.getStringCellValue();
				break;
			}
		}

		// Parse Group Co-Constraints
		for (int i = start + 1; i <= sheet.getLastRowNum(); i++) {
			Row cc = sheet.getRow(i);
			if(this.groupHeader.contains(i)) {
				return  parsedGroup;
			} else {
				ParsedCoConstraint coConstraint = this.parseCoConstraint(cc);
				parsedGroup.getParsedCoConstraints().add(coConstraint);
			}
		}
		return parsedGroup;
	}

	public ParsedCoConstraint parseCoConstraint(Row row) {
		ParsedCoConstraint coConstraint = new ParsedCoConstraint();

		// Parse Co-Constraint Cells
		for(int j = 0; j <= row.getLastCellNum(); j++) {
			Cell cell = row.getCell(j);
			if(j == USAGE) {
				coConstraint.usage = cell.getStringCellValue();
			} else if(j == MIN_CARD) {
				coConstraint.minCardinality = (int) cell.getNumericCellValue();
			} else if(j == MAX_CARD) {
				coConstraint.maxCardinality = cell.getStringCellValue();
			} else if(j >= this.if_start && j <= this.if_end) {
				coConstraint.ifs.put(j, cell.getStringCellValue());
			} else if(j >= this.then_start && j <= this.then_end) {
				coConstraint.then.put(j, cell.getStringCellValue());
			} else if(j >= this.narratives_start && j <= this.narratives_end) {
				coConstraint.narratives.put(j, cell.getStringCellValue());
			}
		}
		return coConstraint;
	}

	void checkAndAddGroup(int i) {
		if(i > 1) {
			groupHeader.add(i);
		}
	}

	@Override
	public String toString() {
		return "ExcelExplorer{" +
				"if_start=" + if_start +
				", if_end=" + if_end +
				", then_start=" + then_start +
				", then_end=" + then_end +
				", narratives_start=" + narratives_start +
				", narratives_end=" + narratives_end +
				", groupHeader=" + groupHeader +
				'}';
	}
}
