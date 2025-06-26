package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import gov.nist.hit.hl7.igamt.coconstraints.model.*;
import gov.nist.hit.hl7.igamt.ig.model.ResourceSkeletonBone;
import gov.nist.hit.hl7.igamt.ig.service.CoConstraintSerializationHelper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetStrength;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.display.service.DisplayInfoService;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.CoConstraintSpreadSheetParser;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.ParsedCoConstraint;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.ParsedGroup;
import gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser.ParsedTable;

@Service
public class ExcelImportServiceImpl implements ExcelImportService {

    @Autowired
    DisplayInfoService displayInfoService;

    @Autowired
    IgService igService;

    @Autowired
    SegmentService segmentService;

    @Autowired
    DatatypeService datatypeService;

    @Autowired
    CoConstraintSerializationHelper coConstraintSerializationHelper;

    static String newLine = System.getProperty("line.separator");


    @Override
    public CoConstraintTable readFromExcel(InputStream excelStream, String igID, String conformanceProfileID, String contextId, String segmentRef) throws Exception {
        //Create Workbook instance holding reference to .xlsx file
        XSSFWorkbook workbook = new XSSFWorkbook(excelStream);

        //Get first/desired sheet from the workbook
        XSSFSheet sheet = workbook.getSheetAt(0);

        ResourceSkeletonBone targetSegment = this.coConstraintSerializationHelper.getSegmentRef(
                this.coConstraintSerializationHelper.getConformanceProfileSkeleton(conformanceProfileID),
                new StructureElementRef(contextId),
                new StructureElementRef(segmentRef)
        );

        Segment segment = segmentService.findById(targetSegment.getResource().getId());

//		//Iterate through each rows one by one
        CoConstraintSpreadSheetParser parser = new CoConstraintSpreadSheetParser(sheet);
        return processCoConstraintTable(parser.parseTable(sheet), segment, igID, parser.wrongHeaderStructure, parser.emptyCellInRow);
    }


    //NEW
    public CoConstraintHeaders processHeaders(ParsedTable table, Map<Integer, CoConstraintHeader> headerMap, Segment segment) throws Exception {
        CoConstraintHeaders coConstraintHeaders = new CoConstraintHeaders();
        List<CoConstraintHeader> selectors = createHeaders(table.getIfHeaders(), headerMap, segment, false);
        List<CoConstraintHeader> constraints = createHeaders(table.getThenHeaders(), headerMap, segment, false);
        List<CoConstraintHeader> narratives = createHeaders(table.getNarrativeHeaders(), headerMap, segment, true);
        coConstraintHeaders.setSelectors(selectors);
        coConstraintHeaders.setConstraints(constraints);
        coConstraintHeaders.setNarratives(narratives);
        if (table.isHasGrouper()) {
            coConstraintHeaders.setGrouper(processGrouper(table.getGrouperValue()));
        }

        return coConstraintHeaders;
    }

    public CoConstraintGrouper processGrouper(String grouperValue) {
        CoConstraintGrouper grouper = new CoConstraintGrouper();
        String[] value = grouperValue.split(":");
        String pathId = value[1].split("-")[1].replace(".", "-");
        grouper.setPathId(pathId);
        return grouper;
    }

    private boolean checkCardinalityColumns(List<CoConstraintHeader> constraints) {
        for (int i = 0; i < constraints.size(); i++) {
            if (((DataElementHeader) constraints.get(i)).getColumnType().equals("VARIES")) {

            }
        }
        return false;
    }


//	 //NEW
//	 void checkAndAddGroup(int i) {
//	        if(i > 1) {
//	            groupHeader.add(i);
//	        }
//	    }

    public CoConstraintTable processCoConstraintTable(ParsedTable parsedTable, Segment segment, String igID, boolean wrongHeaderStructure, boolean emptyCellInRow) throws Exception {
        CoConstraintTable coConstraintTable = new CoConstraintTable();
        Map<Integer, CoConstraintHeader> headerMap = new HashMap<Integer, CoConstraintHeader>();
        if (!wrongHeaderStructure) {
            CoConstraintHeaders coConstraintHeaders = this.processHeaders(parsedTable, headerMap, segment);
            if (!emptyCellInRow)  {
                List<CoConstraint> coConstraintsFree = new ArrayList<>();
                List<CoConstraintGroupBinding> groups;

                for (ParsedCoConstraint parsedCoConstraint : parsedTable.getParsedCoConstraints()) {
                    CoConstraint coConstraint = processCoConstraintRow(parsedCoConstraint, headerMap, igID);
                    coConstraintsFree.add(coConstraint);
                }
                groups = processGroupList(parsedTable.getParsedGroups(), headerMap, igID);
                coConstraintTable.setCoConstraints(coConstraintsFree);
                coConstraintTable.setGroups(groups);
                coConstraintTable.setHeaders(coConstraintHeaders);
                coConstraintTable.setId(UUID.randomUUID().toString());
                coConstraintTable.setTableType(CollectionType.TABLE);
                return coConstraintTable;
            }
        }
        throw new Exception("Invalid file format.");
    }


    private CoConstraint processCoConstraintRow(ParsedCoConstraint parsedCoConstraint, Map<Integer, CoConstraintHeader> headerMap, String igID) throws Exception {
        CoConstraint coConstraint = new CoConstraint();
        coConstraint.setCloned(false);
        CoConstraintRequirement requirement = new CoConstraintRequirement();
        CoConstraintCardinality cardinality = new CoConstraintCardinality();
        requirement.setCardinality(cardinality);
        Map<String, CoConstraintCell> cells = new HashMap<>();
        coConstraint.setCells(cells);
        coConstraint.setRequirement(requirement);

        // New after integration of interface model
        List<Map.Entry<Integer, String>> entries = Stream.concat(
                Stream.concat(
                        parsedCoConstraint.ifs.entrySet().stream(),
                        parsedCoConstraint.then.entrySet().stream()),
                parsedCoConstraint.narratives.entrySet().stream())
                .collect(Collectors.toList());

        CoConstraintUsage coConstraintUsage = CoConstraintUsage.valueOf(parsedCoConstraint.getUsage());
        requirement.setUsage(coConstraintUsage);
        cardinality.setMin(parsedCoConstraint.getMinCardinality());
        cardinality.setMax(parsedCoConstraint.getMaxCardinality());
        int i = 0;
        for (Map.Entry<Integer, String> entry : entries) {
            CoConstraintHeader coConstraintHeader = headerMap.get(entry.getKey());
            int j = entries.size();
            if (i < entries.size() - 1) {
                CoConstraintCell coConstraintCell = processConstraintCell(entry.getKey(), entry.getValue(), entries.get(i + 1).getValue(), headerMap, igID);
                if (coConstraintHeader != null) {
                    cells.put(coConstraintHeader.getKey(), coConstraintCell);
                }
            } else {
                CoConstraintCell coConstraintCell = processConstraintCell(entry.getKey(), entry.getValue(), null, headerMap, igID);
                if (coConstraintHeader != null) {
                    cells.put(coConstraintHeader.getKey(), coConstraintCell);
                }
            }

            i++;
        }

        return coConstraint;

    }

    private List<CoConstraintGroupBinding> processGroupList(
            List<ParsedGroup> parsedGroups,
            Map<Integer, CoConstraintHeader> headerMap,
            String igID
    ) throws Exception {
        List<CoConstraintGroupBinding> groups = new ArrayList<>();

        for (ParsedGroup parsedGroup : parsedGroups) {
            CoConstraintGroupBindingContained group = new CoConstraintGroupBindingContained();
            CoConstraintGroupBindingContained coConstraintGroupBindingHeaderInfo = processHeaderGroup(parsedGroup);
            group.setId(coConstraintGroupBindingHeaderInfo.getId());
            group.setType(GroupBindingType.CONTAINED);
            group.setRequirement(coConstraintGroupBindingHeaderInfo.getRequirement());
            group.setName(coConstraintGroupBindingHeaderInfo.getName());

            List<CoConstraint> coConstraintsListGroup = new ArrayList<>();
            group.setCoConstraints(coConstraintsListGroup);

            for (ParsedCoConstraint parsedCoConstraint : parsedGroup.getParsedCoConstraints()) {
                CoConstraint coConstraint = processCoConstraintRow(parsedCoConstraint, headerMap, igID);
                coConstraintsListGroup.add(coConstraint);
            }
            groups.add(group);
        }
        return groups;
    }

    private CoConstraintGroupBindingContained processHeaderGroup(ParsedGroup parsedGroup) {
        CoConstraintGroupBindingContained coConstraintGroupBinding = new CoConstraintGroupBindingContained();
        CoConstraintRequirement requirement = new CoConstraintRequirement();
        coConstraintGroupBinding.setRequirement(requirement);
        CoConstraintCardinality coConstraintCardinality = new CoConstraintCardinality();
        requirement.setCardinality(coConstraintCardinality);
        CoConstraintUsage coConstraintUsage = CoConstraintUsage.valueOf(parsedGroup.getUsage().replaceAll("\\s", ""));
        requirement.setUsage(coConstraintUsage);
        coConstraintCardinality.setMin(parsedGroup.getMinCardinality());
        coConstraintCardinality.setMax(parsedGroup.getMaxCardinality().replaceAll("\\s", ""));
        coConstraintGroupBinding.setName(parsedGroup.getName().replaceAll("\\s", ""));
        return coConstraintGroupBinding;
    }

    private boolean isGroupHeader(Row r) {
        return r.getPhysicalNumberOfCells() == 4 && r.getCell(3).getStringCellValue().startsWith("Group name");
    }

    public Map<Integer, String> parseHeader(Row row, int start, int end) {
        Map<Integer, String> header = new HashMap<>();
        for (int i = start; i <= end; i++) {
            header.put(i, this.getCellValue(row.getCell(i)));
        }
        return header;
    }

    public List<CoConstraintHeader> createHeaders(Map<Integer, String> values, Map<Integer, CoConstraintHeader> headerMap, Segment segment, boolean narrative) throws Exception {
        List<CoConstraintHeader> headers = new ArrayList<CoConstraintHeader>();
        for (Integer location : values.keySet()) {
            if (!narrative) {
                CoConstraintHeader coConstraintHeader = processIfHeaderCell(values.get(location), segment);
                if (coConstraintHeader != null) {
                    headers.add(coConstraintHeader);
                }
                headerMap.put(location, coConstraintHeader);
            } else {
                CoConstraintHeader coConstraintHeader = processNarrativeHeaderCell(values.get(location));
                headers.add(coConstraintHeader);
                headerMap.put(location, coConstraintHeader);
            }
        }
        return headers;
    }


    public String getCellValue(Cell cell) {
        String result = "";
        switch (cell.getCellType()) {
            case Cell.CELL_TYPE_NUMERIC:
                result = String.valueOf(Math.round(cell.getNumericCellValue()));
                break;
            case Cell.CELL_TYPE_STRING:
                result = cell.getStringCellValue();
                break;
        }
        return result;
    }

    public CoConstraintCell processConstraintCell(Integer columnIndex, String cellValue, String cardValue, Map<Integer, CoConstraintHeader> headerMap, String igID) throws Exception {
        CoConstraintHeader coConstraintHeader = headerMap.get(columnIndex);
        if (coConstraintHeader != null && coConstraintHeader.getType().equals(HeaderType.DATAELEMENT)) {
            switch (((DataElementHeader) coConstraintHeader).getColumnType()) {
                case CODE:
                    CodeCell codeCell = processCodeCell(cellValue);
                    return codeCell;

                case VALUE:
                    ValueCell valueCell = new ValueCell();
                    valueCell.setValue(cellValue);
                    return valueCell;


                case DATATYPE:
                    DatatypeCell datatypeCell = new DatatypeCell();
                    String datatypeRegularExpression = "\\s*Value\\s*:(\\s*\\w)*\\s*,\\s*Flavor\\s*:(\\s*\\w)*\\s*";
                    if (cellValue != null && cellValue != "") {
                        if (cellValue.matches(datatypeRegularExpression)) {
                            String datatypeName = cellValue.split(",")[0].split(":")[1].replaceAll("\\s+", "");
                            String flavor = cellValue.split(",")[1].split(":")[1].replaceAll("\\s+", "");
                            String fixedName = datatypeName;
                            String variableName = flavor.contains("_") ? flavor.split("_")[1] : null;

                            // condition ? value_if_true : value_if_false;
                            datatypeCell.setValue(datatypeName);
                            Ig igDocument = igService.findById(igID);
                            String datatypeId = "NOT FOUND";
                            Set<DisplayElement> datatypes = displayInfoService.convertDatatypeRegistry(igDocument.getDatatypeRegistry());
                            Optional<DisplayElement> match = datatypes.stream().filter((displayElement) -> {
                                if (displayElement.getVariableName() != null) {
                                    return displayElement.getFixedName().equals(fixedName) && displayElement.getVariableName().equals(variableName);
                                } else {
                                    return displayElement.getFixedName().equals(fixedName) && variableName == null;
                                }
                            }).findFirst();

                            if (match.isPresent()) {
                                DisplayElement displayElement = match.get();
                                datatypeCell.setDatatypeId(displayElement.getId());
                                datatypeCell.setType(ColumnType.DATATYPE);
                            }
                        }
                    }
                    return datatypeCell;
                case VALUESET:
                    ValueSetCell valueSetCell = processValueSetCell(cellValue, igID);
                    return valueSetCell;

                case VARIES:
                    VariesCell variesCell = new VariesCell();
//                    variesCell.setCardinalityMax(cardValue);
                    if (cellValue.startsWith("Code:")) {
                        CodeCell codeCellVaries = processCodeCell(cellValue);
                        variesCell.setCellValue(codeCellVaries);
                        variesCell.setCellType(ColumnType.CODE);
                        return variesCell;

                    } else if (cellValue.startsWith("Strength:")) {
                        ValueSetCell valueSetCellVaries = processValueSetCell(cellValue, igID);
                        variesCell.setCellValue(valueSetCellVaries);
                        variesCell.setCellType(ColumnType.VALUESET);
                        return variesCell;
                    } else {
                        return variesCell;
                    }
                case ANY:
                    AnyCell anyCell = new AnyCell();
//                    anyCell.setCardinalityMax(cardValue);
                    if (cellValue.startsWith("Code:")) {
                        CodeCell codeCellAny = processCodeCell(cellValue);
                        anyCell.setCellValue(codeCellAny);
                        anyCell.setCellType(ColumnType.CODE);
                        return anyCell;
                    } else if (cellValue.startsWith("Strength:")) {
                        ValueSetCell valueSetCellAny = processValueSetCell(cellValue, igID);
                        anyCell.setCellValue(valueSetCellAny);
                        anyCell.setCellType(ColumnType.VALUESET);
                        return anyCell;
                    } else {
                        return anyCell;
                    }
            }
            return null;
        } else if (coConstraintHeader != null && coConstraintHeader.getType().equals(HeaderType.NARRATIVE)) {
            ValueCell valueCell = new ValueCell();
            valueCell.setValue(cellValue);
            return valueCell;
        }

        return null;
    }

    public CoConstraintHeader processIfHeaderCell(String cellValue, Segment segment) {
        DataElementHeader dataElementHeader = new DataElementHeader();
        if (cellValue != null) {
            String[] splitCellValue = cellValue.split("\\s+");
            String columnType = splitCellValue[0];
            if (!(columnType.equals("VALUE") || columnType.equals("VARIES") || columnType.equals("DATATYPE") || columnType.equals("VALUESET") || columnType.equals("CODE") || columnType.equals("Cardinality"))) {

            } else {
                if (!columnType.equals("Cardinality")) {
                    String name = splitCellValue[1];
                    String stringKey = name.split("-")[1].replace(".", "-");
                    String datatype = name.split("-")[0];
                    dataElementHeader.setColumnType(ColumnType.valueOf(columnType));
                    dataElementHeader.setKey(stringKey);
                    return dataElementHeader;
                }
            }
        }
        return null;

    }

    public DataElementHeaderInfo processPath(Segment segment, String headerName) throws Exception {
        String[] path = headerName.split("\\.");
        DataElementHeaderInfo dataElementHeaderInfo = new DataElementHeaderInfo();
        if (path.length == 1) {
            Field field = fetchDatatypeFromSegment(segment, path[0]);
            if (field != null && field.getRef() != null) {
                Datatype datatype = datatypeService.findById(field.getRef().getId());
                if (datatype != null) {
                    CoConstraintCardinality coConstraintCardinality = new CoConstraintCardinality();
                    coConstraintCardinality.setMax(field.getMax());
                    coConstraintCardinality.setMin(field.getMin());
                    dataElementHeaderInfo.setCardinality(coConstraintCardinality);
                    dataElementHeaderInfo.setDatatype(datatype.getName()); //name not ID
                    dataElementHeaderInfo.setLocation(Integer.parseInt(path[0]));
                    dataElementHeaderInfo.setType(Type.FIELD);
                    dataElementHeaderInfo.setVersion(datatype.getDomainInfo().getVersion());
                    dataElementHeaderInfo.setParent(segment.getName());
                } else {
                    throw new Exception("Cannot find datatype related to path : " + segment.getName() + "-" + headerName);
                }
            } else {
                throw new Exception("Invalid path : " + segment.getName() + "-" + headerName);
            }
        } else if (path.length == 2) {
            Field field = fetchDatatypeFromSegment(segment, path[0]);
            Datatype datatype1 = datatypeService.findById(field.getRef().getId());
            if (datatype1 instanceof ComplexDatatype) {
                Component component = fetchDatatypeFromComplexDatatype((ComplexDatatype) datatype1, path[1]);
                Datatype datatype2 = datatypeService.findById(field.getRef().getId());
                dataElementHeaderInfo.setDatatype(datatype2.getName());
                dataElementHeaderInfo.setLocation(Integer.parseInt(path[1]));
                dataElementHeaderInfo.setType(Type.COMPONENT);
                dataElementHeaderInfo.setVersion(datatype2.getDomainInfo().getVersion());
                dataElementHeaderInfo.setParent(datatype1.getName());
            } else {
                throw new Exception("Invalid path : " + segment.getName() + "-" + headerName);
            }
        } else if (path.length == 3) {
            Field field = fetchDatatypeFromSegment(segment, path[0]);
            Datatype datatype1 = datatypeService.findById(field.getRef().getId());
            if (datatype1 instanceof ComplexDatatype) {
                Component component1 = fetchDatatypeFromComplexDatatype((ComplexDatatype) datatype1, path[1]);
                Datatype datatype2 = datatypeService.findById(component1.getRef().getId());
                if (datatype2 instanceof ComplexDatatype) {
                    Component component2 = fetchDatatypeFromComplexDatatype((ComplexDatatype) datatype2, path[2]);
                    Datatype datatype3 = datatypeService.findById(component2.getRef().getId());
                    dataElementHeaderInfo.setDatatype(datatype3.getName());
                    dataElementHeaderInfo.setLocation(Integer.parseInt(path[2]));
                    dataElementHeaderInfo.setType(Type.SUBCOMPONENT);
                    dataElementHeaderInfo.setVersion(datatype3.getDomainInfo().getVersion());
                    dataElementHeaderInfo.setParent(datatype2.getName());

                } else {
                    throw new Exception("Invalid path : " + segment.getName() + "-" + headerName);
                }
            } else {
                throw new Exception("Invalid path : " + segment.getName() + "-" + headerName);

            }
        } else if (path.length > 3) {
            throw new Exception("Invalid path : " + segment.getName() + "-" + headerName);
        }

        return dataElementHeaderInfo;
    }


    private Component fetchDatatypeFromComplexDatatype(ComplexDatatype datatype, String path) {
        Component component = new Component();
        for (Component c : datatype.getComponents()) {
            if (c.getPosition() == Integer.parseInt(path)) {
                component = c;
            }
        }
        //TODO check datatype instance of
        return component;
    }

    private Field fetchDatatypeFromSegment(Segment segment, String path) {
        Field field = new Field();
        for (Field f : segment.getChildren()) {
            if (f.getPosition() == Integer.parseInt(path)) {
                field = f;
            }
        }
        //TODO check datatype instance of
//		Datatype datatype = datatypeService.findById(field.getRef().getId());
        return field;
    }

    public CodeCell processCodeCell(String cellValue) {
        String codeRegularExpression = "\\s*Code\\s*:(.)*\\s*,\\s*Code System\\s*:(\\s*\\w)*\\s*,\\s*Location\\s*:\\s*([0-9](?:\\s*or\\s*[0-9])*)\\s*";
        if (cellValue != null && !cellValue.isEmpty()) {
            if (cellValue.matches(codeRegularExpression)) {
                CodeCell codeCell = new CodeCell();
                String[] splitCodeCellValue = cellValue.split(",");
                String codeValue = splitCodeCellValue[0].split(":")[1];
                String codeSystemValue = splitCodeCellValue[1].split(":")[1];
                List<Integer> locations = new ArrayList<Integer>();
                String[] LocationsString = splitCodeCellValue[2].split(":")[1].split("or");
                for (String s : LocationsString) {
                    locations.add(Integer.parseInt(s.replaceAll("\\s", "")));
                }
                codeCell.setCode(codeValue);
                codeCell.setCodeSystem(codeSystemValue);
                codeCell.setLocations(locations);
                return codeCell;
            }
        }
        return null;
    }


    public ValueSetCell processValueSetCell(String cellValue, String igID) {
        String valueSetRegularExpression = "\\s*Strength\\s*:(\\s*[A-Z])\\s*,\\s*Location\\s*:\\s*(\\[\\s*[0-9\\s*]\\s*(?:,\\s*[0-9]\\s*)*\\s*\\])\\s*,\\s*Valuesets\\s*:\\s*(\\[\\s*[a-zA-Z0-9_]*(?:\\s*,\\s*[a-zA-Z0-9_]*)*\\s*\\])\\s*";
        ValueSetCell valueSetCell = new ValueSetCell();
        List<ValuesetBinding> list = new ArrayList<ValuesetBinding>();
        if (cellValue != null && !cellValue.isEmpty()) {
            if (cellValue.matches(valueSetRegularExpression)) {
                ValuesetBinding valueSetBinding = new ValuesetBinding();
                List<String> valueSets = new ArrayList<String>();
                Pattern pattern = Pattern.compile(valueSetRegularExpression);
                Matcher matcher = pattern.matcher(cellValue);
                String usage = "";
                String locations = "";
                String allValueSets = "";
                if (matcher.find()) {
                    usage = matcher.group(1);
                    locations = matcher.group(2);
                    allValueSets = matcher.group(3);
                }

                valueSetBinding.setStrength(ValuesetStrength.valueOf(usage.replaceAll("\\s", "")));
                Set<Integer> locations2 = new HashSet<Integer>();
                for (String s : locations.replace("]", "").replace("[", "").split(",")) {
                    locations2.add(Integer.parseInt(s.replaceAll("\\s", "")));
                }
                valueSetBinding.setValuesetLocations(locations2);
                Ig igDocument = igService.findById(igID);

                for (String valueSet : allValueSets.replace("]", "").replace("[", "").replaceAll("\\s", "").split(",")) {
                    Set<DisplayElement> valuesetsdisplay = displayInfoService.convertValueSetRegistry(igDocument.getValueSetRegistry());
                    Optional<DisplayElement> match = valuesetsdisplay.stream().filter((displayElement) -> displayElement.getVariableName().equals(valueSet)).findFirst();

                    if (match.isPresent()) {
                        DisplayElement displayElement = match.get();
                        valueSets.add(displayElement.getId());
                    }
                }
                valueSetBinding.setValueSets(valueSets);
                list.add(valueSetBinding);
                valueSetCell.setBindings(list);
            }
            valueSetCell.setBindings(list);
            return valueSetCell;
        } else {
            valueSetCell.setBindings(list);

            return valueSetCell;
        }
    }

    public CoConstraintHeader processNarrativeHeaderCell(String value) {
        NarrativeHeader narrativeHeader = new NarrativeHeader();
        narrativeHeader.setTitle(value);
        narrativeHeader.setType(HeaderType.NARRATIVE);
        narrativeHeader.setKey(UUID.randomUUID().toString());
        return narrativeHeader;
    }

}
