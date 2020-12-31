package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import gov.nist.diff.annotation.DeltaField;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraint;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintCardinality;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupBindingContained;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintHeaders;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintRequirement;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintUsage;
import gov.nist.hit.hl7.igamt.coconstraints.model.CodeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.coconstraints.model.DataElementHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.DataElementHeaderInfo;
import gov.nist.hit.hl7.igamt.coconstraints.model.DatatypeCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.GroupBindingType;
import gov.nist.hit.hl7.igamt.coconstraints.model.HeaderType;
import gov.nist.hit.hl7.igamt.coconstraints.model.NarrativeHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.ValueSetCell;
import gov.nist.hit.hl7.igamt.coconstraints.model.WithDelta;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;


public class ReadFromExcel {
	
	static String newLine = System.getProperty("line.separator");


	public static void main(String[] args) {
		try
		{
			//	            FileInputStream file = new FileInputStream(new File("howtodoinjava_demo.xlsx"));
			InputStream file = ReadFromExcel.class.getResourceAsStream("/CoConstraintsExcelFile - 2020-11-23T125206.198.xlsx");  


			//Create Workbook instance holding reference to .xlsx file
			XSSFWorkbook workbook = new XSSFWorkbook(file);

			//Get first/desired sheet from the workbook
			XSSFSheet sheet = workbook.getSheetAt(0);
			
//			//Iterate through each rows one by one
			Iterator<Row> rowIterator = sheet.iterator();
			
//			CoConstraintTable coConstraintTable = processCoConstraintTable(rowIterator);
			file.close();
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}
	

	
	public static CoConstraintTable processCoConstraintTable(Iterator<Row> rowIterator, String segmentId, String conformanceProfileID, String igID, String pathID){
		CoConstraintTable coConstraintTable = new CoConstraintTable();
	     Map<Integer, CoConstraintHeader> headerMap = new HashMap<Integer, CoConstraintHeader>();

		Row row1 = rowIterator.next();
		Row row2 = rowIterator.next();
		
		CoConstraintHeaders coConstraintHeaders = processHeaders(row1,row2,headerMap);
		List<CoConstraint> coConstraintsFree = new ArrayList<CoConstraint>();
		List<CoConstraintGroupBinding> groups = new ArrayList<CoConstraintGroupBinding>();
		
		while(rowIterator.hasNext()) {
			Row r = rowIterator.next();
			if(isGroupHeader(r)) {
				System.out.println("YEP");
				groups = processGroupList(r, rowIterator, headerMap);
			} else {
				CoConstraint coConstraint = processCoConstraintRow(r, headerMap);
				coConstraintsFree.add(coConstraint);
			}
		}
//		coConstraintTable.setBaseSegment(baseSegment); seg ID
		coConstraintTable.setCoConstraints(coConstraintsFree);
		coConstraintTable.setGroups(groups);
		coConstraintTable.setHeaders(coConstraintHeaders);
//		coConstraintTable.setId(id); How to generate random ID
//		coConstraintTable.setTableType(tableType); Table
		
		System.out.println("Groups result : " + groups.size());
		return coConstraintTable;		
	}
	
	private static CoConstraint processCoConstraintRow(Row r, Map<Integer, CoConstraintHeader> headerMap) {
		CoConstraint coConstraint = new CoConstraint();
		 String id;
//	     boolean cloned; false
	     CoConstraintRequirement requirement = new CoConstraintRequirement();
	 	 CoConstraintCardinality cardinality = new CoConstraintCardinality();
	     requirement.setCardinality(cardinality);
	     Map<String, CoConstraintCell> cells = null;
	     coConstraint.setCells(cells);
	     coConstraint.setRequirement(requirement);
	     
	     Iterator<Cell> cellIterator = r.cellIterator();
			int iterator = 0;
			while (cellIterator.hasNext()) 
			{
				Cell cell = cellIterator.next();
		if(iterator == 1) {
			CoConstraintUsage coConstraintUsage = CoConstraintUsage.valueOf(getCellValue(cell));
			requirement.setUsage(coConstraintUsage);
			System.out.println(newLine +" USAGE : " + requirement.getUsage().name());
		}
		if(iterator == 2) {
			System.out.println("cell value ite @ : " +getCellValue(cell) );
			cardinality.setMin(Integer.parseInt(getCellValue(cell)));
			System.out.println(newLine + " MIN : " + cardinality.getMin());

		}
		if(iterator == 3) {
			cardinality.setMax(getCellValue(cell));
			System.out.println(newLine +" MAX : " + cardinality.getMax());
		}
		if(iterator > 3) {
			CoConstraintHeader coConstraintHeader = headerMap.get(cell.getColumnIndex());
			CoConstraintCell coConstraintCell = processConstraintCell(cell,headerMap);
			cells.put(coConstraintHeader.getKey(), coConstraintCell);
		}
			}
		return coConstraint;
}

	private static List<CoConstraintGroupBinding> processGroupList(Row rx, Iterator<Row> rowIterator,
		Map<Integer, CoConstraintHeader> headerMap) {
		List<CoConstraintGroupBinding> groups = new ArrayList<CoConstraintGroupBinding>();
		List<CoConstraint> coConstraintsListGroup = new ArrayList<CoConstraint>();
		CoConstraintGroupBindingContained group = new CoConstraintGroupBindingContained();
		while(rowIterator.hasNext()) {
			Row r = rowIterator.next();
			
				if(!isGroupHeader(r)) {
					CoConstraint coConstraint = processCoConstraintRow(r, headerMap);
					coConstraintsListGroup.add(coConstraint);					
				} else {
					CoConstraintGroupBindingContained coConstraintGroupBindingHeaderInfo = processHeaderGroup(rx);
					group.setId(coConstraintGroupBindingHeaderInfo.getId());
//					group.setType(type); contained
					group.setRequirement(coConstraintGroupBindingHeaderInfo.getRequirement());
					group.setName(coConstraintGroupBindingHeaderInfo.getName());
					group.setCoConstraints(coConstraintsListGroup);
					groups.add(group);
				    coConstraintsListGroup = new ArrayList<CoConstraint>();
				    group = new CoConstraintGroupBindingContained();
				    rx = r;
				}
		}
		CoConstraintGroupBindingContained coConstraintGroupBindingHeaderInfo = processHeaderGroup(rx);
		group.setId(coConstraintGroupBindingHeaderInfo.getId());
//		group.setType(type); contained
		group.setRequirement(coConstraintGroupBindingHeaderInfo.getRequirement());
		group.setName(coConstraintGroupBindingHeaderInfo.getName());
		group.setCoConstraints(coConstraintsListGroup);
		groups.add(group);
		
	return groups;
}

	private static CoConstraintGroupBindingContained processHeaderGroup(Row rx) {
		CoConstraintGroupBindingContained coConstraintGroupBinding = new CoConstraintGroupBindingContained();
		String id;
		CoConstraintRequirement requirement = new CoConstraintRequirement();
		CoConstraintCardinality coConstraintCardinality = new CoConstraintCardinality();
		requirement.setCardinality(coConstraintCardinality);
		GroupBindingType type;
		String name;
		List<CoConstraint> groupCoConstraints = new ArrayList<CoConstraint>();
		
		Iterator<Cell> cellIterator = rx.cellIterator();
		int iterator = 0;
		while (cellIterator.hasNext()) 
		{
			iterator ++;
			Cell cell = cellIterator.next();
			if(iterator == 1) {
				CoConstraintUsage coConstraintUsage = CoConstraintUsage.valueOf(getCellValue(cell).replaceAll("\\s", ""));
				requirement.setUsage(coConstraintUsage);
				System.out.println(newLine +" USAGE GROUP : " + requirement.getUsage().name());
			}
			if(iterator == 2) {
				coConstraintCardinality.setMin(Integer.parseInt(getCellValue(cell).replaceAll("\\s", "")));
				System.out.println(newLine + " MIN : " + coConstraintCardinality.getMin());

			}
			if(iterator == 3) {
				coConstraintCardinality.setMax(getCellValue(cell).replaceAll("\\s", ""));
				System.out.println(newLine +" MAX : " + coConstraintCardinality.getMax());
			}
			if(iterator == 4) {
				coConstraintGroupBinding.setName(cell.getStringCellValue().replaceAll("\\s", ""));
				System.out.println(newLine +" Group Name : " + cell.getStringCellValue());
			}
		}	
		return coConstraintGroupBinding;
	}

	private static boolean isGroupHeader(Row r) {
		System.out.println("Number of cells : " + r.getPhysicalNumberOfCells() + " starts with for name : " + r.getCell(3).getStringCellValue());
		return r.getPhysicalNumberOfCells()==4 && r.getCell(3).getStringCellValue().startsWith("Group name");
}

	private static CoConstraintHeaders processHeaders(Row row1, Row row2, Map<Integer, CoConstraintHeader> headerMap) {
		CoConstraintHeaders coConstraintHeaders = new CoConstraintHeaders();
		List<CoConstraintHeader> selectors = new ArrayList<CoConstraintHeader>();
		List<CoConstraintHeader> constraints = new ArrayList<CoConstraintHeader>();
		List<CoConstraintHeader> narratives = new ArrayList<CoConstraintHeader>();
		
		//Parameters of first row
		int ifColomnSize = 0;
		int thenColomnSize = 0;
		int thenColumnPosition = 0;
		int narrativeColomnSize = 0;
		
		
		//Processing first row
		Iterator<Cell> cellIterator = row1.cellIterator();
			while (cellIterator.hasNext()) 
			{
				Cell cell = cellIterator.next();
				if(cell.getStringCellValue().startsWith("THEN")) {
					ifColomnSize = cell.getColumnIndex() - 3;
					thenColumnPosition = cell.getColumnIndex();
					System.out.println(newLine+ "ifColomnSize : " + ifColomnSize);
				}
				if(cell.getStringCellValue().startsWith("NARRATIVES")) {
					thenColomnSize = cell.getColumnIndex() - thenColumnPosition;
					System.out.println(newLine +"thenColomnSize : " + thenColomnSize);


				}
//				System.out.print(newLine +"iterration number : " + columnNumber + "   cell position : " + cell.getColumnIndex() + "  cell value : " +cell.getStringCellValue() + "t");
						}
		
		
		//Processing second row
			cellIterator = row2.cellIterator();
			
			narrativeColomnSize = row2.getLastCellNum() - ifColomnSize - thenColomnSize - 3;
			System.out.println(newLine +"narrativeColomnSize : " + narrativeColomnSize);
			System.out.println(newLine +"rowlast : " + row2.getLastCellNum());

			int iterator = 0;
			while (cellIterator.hasNext()) 
			{
				Cell cell = cellIterator.next();
				System.out.print(newLine +"iterration number : " + iterator + "   cell position : " + cell.getColumnIndex() + "  cell value : " +cell.getStringCellValue() + "t");
				iterator ++;
				//Filling Selectors list
				if(iterator >= 3 && iterator < ifColomnSize+3) {
					CoConstraintHeader coConstraintHeader = processIfHeaderCell(cell);
					selectors.add(coConstraintHeader);
					headerMap.put(cell.getColumnIndex(), coConstraintHeader);
					coConstraintHeaders.setSelectors(selectors);
					System.out.println(newLine +"iterration number : " + iterator + " selector size : " + selectors.size());
			}
				//Filling Constraints list
				if(iterator >= 3 + ifColomnSize  && iterator < ifColomnSize+thenColomnSize+3) {
					CoConstraintHeader coConstraintHeader = processIfHeaderCell(cell);
					constraints.add(coConstraintHeader);
					headerMap.put(cell.getColumnIndex(), coConstraintHeader);
					coConstraintHeaders.setConstraints(constraints);
					System.out.println(newLine +"iterration number : " + iterator + " constraints size : " + constraints.size());
			}
				//Filling Narratives list
				if(iterator >= 3 + ifColomnSize+thenColomnSize  && iterator < ifColomnSize+thenColomnSize+narrativeColomnSize+3) {
					CoConstraintHeader coConstraintHeader = processNarrativeHeaderCell(cell);
					narratives.add(coConstraintHeader);
					headerMap.put(cell.getColumnIndex(), coConstraintHeader);
					coConstraintHeaders.setNarratives(narratives);
					System.out.println(newLine +"iterration number : " + iterator + " narratives size : " + narratives.size());
			}

			}
			return coConstraintHeaders;
		
	}


	public static CoConstraint processCoConstraintRow1(Cell cell, int iterator, Map<Integer, CoConstraintHeader> headerMap) {
		CoConstraint coConstraint = new CoConstraint();
		 String id;
//	     boolean cloned;
	     CoConstraintRequirement requirement = new CoConstraintRequirement();
	 	 CoConstraintCardinality cardinality = new CoConstraintCardinality();
	     requirement.setCardinality(cardinality);
	     Map<String, CoConstraintCell> cells = null;
	     coConstraint.setCells(cells);
	     coConstraint.setRequirement(requirement);
		if(iterator == 1) {
			CoConstraintUsage coConstraintUsage = CoConstraintUsage.valueOf(getCellValue(cell));
			requirement.setUsage(coConstraintUsage);
			System.out.println(newLine +" USAGE : " + requirement.getUsage().name());
		}
		if(iterator == 2) {
			System.out.println("cell value ite @ : " +getCellValue(cell) );
			cardinality.setMin(Integer.parseInt(getCellValue(cell)));
			System.out.println(newLine + " MIN : " + cardinality.getMin());

		}
		if(iterator == 3) {
			cardinality.setMax(getCellValue(cell));
			System.out.println(newLine +" MAX : " + cardinality.getMax());
		}
		if(iterator > 3) {
			CoConstraintHeader coConstraintHeader = headerMap.get(cell.getColumnIndex());
			CoConstraintCell coConstraintCell = processConstraintCell(cell,headerMap);
			cells.put(coConstraintHeader.getKey(), coConstraintCell);
		}
		return coConstraint;
	}
	
	public static String getCellValue(Cell cell) {
		String result = "";
		switch (cell.getCellType()) 
        {
            case Cell.CELL_TYPE_NUMERIC:
            	result = String.valueOf(Math.round(cell.getNumericCellValue()));
                break;
            case Cell.CELL_TYPE_STRING:
            	result = cell.getStringCellValue();
                break;
        }
		return result;
	}
	
	public static CoConstraintCell processConstraintCell(Cell cell, Map<Integer, CoConstraintHeader> headerMap) {
		CoConstraintHeader coConstraintHeader = headerMap.get(cell.getColumnIndex());
		if (coConstraintHeader.getType().equals(HeaderType.DATAELEMENT)) {
			switch (((DataElementHeader) coConstraintHeader).getColumnType()) 
	        {
	            case CODE:
	            	CodeCell codeCell = processCodeCell(cell);
	            	return codeCell;
				
	            case VALUE:
	            	ValueCell valueCell = new ValueCell();
	    			valueCell.setValue(cell.getStringCellValue());
	    			return valueCell;
	    			
	    			
	            case DATATYPE:
	            	DatatypeCell datatypeCell = new DatatypeCell();
	            	String datatypeName = cell.getStringCellValue().split(",")[0].split(":")[1];
	            	datatypeCell.setValue(datatypeName);
//	            	datatypeCell.setDatatypeId(datatypeId); DisplayInfoServiceImpl
//	            	datatypeCell.setType(type); datatype
//	            	datatypeCell.setCardinalityMax(cardinalityMax); varies related
	            	return datatypeCell;
	            	
	            	 	
	            case VALUESET:
	            	ValueSetCell valueSetCell = processValueSetCell(cell);			
	            	return valueSetCell;
	            	
			case VARIES:
	            	if(cell.getStringCellValue().startsWith("Code:")) {
	            		return processCodeCell(cell);
	            	} else if(cell.getStringCellValue().startsWith("Strength:")) {
	            		return processValueSetCell(cell);
	            	} else {
	            		ValueCell valueCell2 = new ValueCell();
		    			valueCell2.setValue(cell.getStringCellValue());
		    			return valueCell2;
	            	}
	            	             
	        }
			return null;
        }
		else if (coConstraintHeader.getType().equals(HeaderType.NARRATIVE)) {
			ValueCell valueCell = new ValueCell();
			valueCell.setValue(cell.getStringCellValue());
			return valueCell;
		}

		return null;
	}
	
	public static CoConstraintHeader processIfHeaderCell(Cell cell) {
		System.out.println(newLine + "we in");
		System.out.println(newLine + "Cell Value : " + cell.getStringCellValue());
			DataElementHeader dataElementHeader = new DataElementHeader();
			String[] splitCellValue = cell.getStringCellValue().split("\\s+");
			String columnType = splitCellValue[0];
			String name = splitCellValue[1];
			int key = Integer.parseInt(name.split("-")[1]);
			String datatype = name.split("-")[0];
			dataElementHeader.setColumnType(ColumnType.valueOf(columnType));
			dataElementHeader.setName(name);
			if(columnType.equals("VARIES")) {
				dataElementHeader.setCardinality(true);
			} else {
				dataElementHeader.setCardinality(false);
			}
			DataElementHeaderInfo dataElementHeaderInfo = new DataElementHeaderInfo();
//			dataElementHeader.setElementInfo(dataElementHeaderInfo); Create function to resolve paths starting from seg
			dataElementHeader.getElementInfo().setDatatype(datatype);
			
			//TODO
//			dataElementHeader.getElementInfo().setCardinality(cardinality);
			
			System.out.println(" type : " + dataElementHeader.getColumnType().name() + " and name : "+ name + " and key : " + key);
		return dataElementHeader;
		
	}
	
	public static CodeCell processCodeCell(Cell cell) {
		CodeCell codeCell = new CodeCell();
		String[] splitCodeCellValue = cell.getStringCellValue().split(",");
		String codeValue = splitCodeCellValue[0].split(":")[1];
	System.out.println(newLine +" CODE VALUE : " + codeValue);
	String codeSystemValue = splitCodeCellValue[1].split(":")[1];
	System.out.println(newLine +" CODESystem VALUE : " + codeSystemValue);
	List<Integer> locations = new ArrayList<Integer>();
	String[] LocationsString = splitCodeCellValue[2].split(":")[1].split("or");
	for(String s : LocationsString) {
		System.out.println(newLine+" the STRING OF LOCATION S : " +s);
		locations.add(Integer.parseInt(s.replaceAll("\\s", "")));
	}
	System.out.println(newLine +" Locations VALUE : " + locations);
	codeCell.setCode(codeValue);
	codeCell.setCodeSystem(codeSystemValue);
	codeCell.setLocations(locations);
	return codeCell;
	}
	
	public static ValueSetCell processValueSetCell(Cell cell) {
		ValueSetCell valueSetCell = processValueSetCell(cell);
    	ValuesetBinding valueSetBinding = new ValuesetBinding();
    	 List<String> valueSets = new ArrayList<String>();
//    	 ValuesetStrength strength = new ValuesetStrength();
    	 System.out.println("LOOK HERE : " + cell.getStringCellValue().split(",")[0].split(":")[1]);
    	 valueSetBinding.setStrength(ValuesetStrength.valueOf(cell.getStringCellValue().split(",")[0].split(":")[1].replaceAll("\\s", "")));
    	 Set<Integer> locations2 = new HashSet<Integer>();
    	 
			String[] splitCodeCellValue2 = cell.getStringCellValue().split(",");
			String[] LocationsString2 = splitCodeCellValue2[1].split(":")[1].replace("]", "").replace("[", "").split(",");
			for(String s : LocationsString2) {
				System.out.println(newLine+" the STRING OF LOCATION S : " +s);
				locations2.add(Integer.parseInt(s.replaceAll("\\s", "")));
			}
			valueSetBinding.setValuesetLocations(locations2);
    	
			String[] valueSetsInString = splitCodeCellValue2[2].split(",");
			for(String valueSet : valueSetsInString) {
				valueSets.add(valueSet);
			}
			valueSetBinding.setValueSets(valueSets);	 
			return valueSetCell;
	}
	
	public static CoConstraintHeader processNarrativeHeaderCell(Cell cell) {
		System.out.println(newLine + "we in");
		System.out.println(newLine + "Cell Value : " + cell.getStringCellValue());
			NarrativeHeader narrativeHeader = new NarrativeHeader();
			narrativeHeader.setTitle(cell.getStringCellValue());
			narrativeHeader.setType(HeaderType.NARRATIVE);

			System.out.println(" narattive title : " + cell.getStringCellValue());
		return narrativeHeader;
		
	}

}
