package gov.nist.hit.hl7.igamt.coconstraints.serialization;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import gov.nist.hit.hl7.igamt.serialization.domain.SerializableResource;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Attribute;
import nu.xom.Element;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintGroupData;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableCell;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableContent;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableGroup;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableHeader;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableRow;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CodeCell;
import gov.nist.hit.hl7.igamt.coconstraints.domain.DataCell;
import gov.nist.hit.hl7.igamt.coconstraints.domain.IgnoreCell;
import gov.nist.hit.hl7.igamt.coconstraints.domain.TextAreaCell;
import gov.nist.hit.hl7.igamt.coconstraints.domain.VSCell;
import gov.nist.hit.hl7.igamt.coconstraints.domain.VSValue;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.export.configuration.domain.CoConstraintExportMode;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;

public class SerializableCoConstraints {

	private Map<String, Datatype> datatypesMap;
	private CoConstraintTable coConstraintsTable;
	private String segmentName;
	// private Map<String, String> datatypesNamesMap;
	// private Map<String, Table> coConstraintValueTableMap;
	private Map<String, Datatype> coConstraintDatatypeMap;
	private Boolean greyOutOBX2FlavorColumn;
	private ExportConfiguration exportConfiguration;

	private static final int BINDING_IDENTIFIER_MAX_LENGTH = 40;

	public SerializableCoConstraints(CoConstraintTable coConstraintsTable, String segmentName,
			Map<String, Datatype> datatypesMap, ExportConfiguration exportConfiguration) {
		// super(null, segmentName);
		this.coConstraintsTable = coConstraintsTable;
		this.segmentName = segmentName;
		this.datatypesMap = datatypesMap;
		this.exportConfiguration = exportConfiguration;
		// this.coConstraintValueTableMap = coConstraintValueTableMap;
		// this.coConstraintDatatypeMap = coConstraintDatatypeMap;
		// this.coConstraintExportMode = coConstraintExportMode;
		// this.greyOutOBX2FlavorColumn = greyOutOBX2FlavorColumn;
	}

	public Element serialize() throws SerializationException {
		System.out.println("Config mode :" + this.exportConfiguration.getCoConstraintExportMode().value);
		if (this.exportConfiguration.getCoConstraintExportMode() == null || this.exportConfiguration
				.getCoConstraintExportMode().equals(exportConfiguration.getCoConstraintExportMode().COMPACT)) {
			return this.generateCoConstraintsTableCompact();
		} else {
			return this.generateCoConstraintsTableVerbose();
		}
	}

	private Element generateCoConstraintsTableCompact() {
		if (coConstraintsTable != null) {
			Element coConstraintsElement = new Element("coconstraints");
			Element tableElement = new Element("table");
			tableElement.addAttribute(new Attribute("class", "contentTable"));
			tableElement.addAttribute(new Attribute("id", "parent"));
			Element thead = serializeCoConstraintsTableHeader(coConstraintsTable);
			tableElement.appendChild(thead);
			Element tbody = serializeContent(coConstraintsTable.getContent(), generateHeadersIDs(coConstraintsTable),
					calculateGroupNameColspan(coConstraintsTable));
			tableElement.appendChild(tbody);
			coConstraintsElement.appendChild(tableElement);
			return coConstraintsElement;
		}
		return null;
	}

	private Element generateCoConstraintsTableVerbose1() {
		if (coConstraintsTable != null) {
			Element coConstraintsElement = new Element("coconstraints");
			Element tableElement = new Element("table");
			tableElement.addAttribute(new Attribute("class", "contentTable"));
			tableElement.addAttribute(new Attribute("id", "parent"));
			Element thead = serializeCoConstraintsTableHeaderVerbose(coConstraintsTable);
			tableElement.appendChild(thead);
			Element tbody = serializeContentVerbose(coConstraintsTable.getContent(),
					generateHeadersIDs(coConstraintsTable), calculateGroupNameColspan(coConstraintsTable));
			tableElement.appendChild(tbody);
			coConstraintsElement.appendChild(tableElement);
			return coConstraintsElement;
		}
		return null;
	}
	
	private Element generateCoConstraintsTableVerbose() {
		if (coConstraintsTable != null) {
			Element coConstraintsElement = new Element("coconstraints");
			Element tableElement = new Element("table");
			tableElement.addAttribute(new Attribute("class", "contentTable"));
			tableElement.addAttribute(new Attribute("id", "parent"));
			Element thead = serializeCoConstraintsTableHeaderVerbose(coConstraintsTable);
			tableElement.appendChild(thead);
			Element tbody = new Element("tbody");
			tableElement.appendChild(tbody);
			if (coConstraintsTable.getContent().getFree() != null) {
				for (CoConstraintTableRow row : coConstraintsTable.getContent().getFree()) {
					 serializeRowVerbose(row, generateHeadersIDs(coConstraintsTable),tbody);
//					tableContent.appendChild(rowElement);
				}
			}
			coConstraintsElement.appendChild(tableElement);
			if (coConstraintsTable.getContent().getGroups() != null) {
				for (CoConstraintTableGroup group : coConstraintsTable.getContent().getGroups()) {
					Element groupElement = serializeGroupVerbose(group, generateHeadersIDs(coConstraintsTable), calculateGroupNameColspan(coConstraintsTable));
					coConstraintsElement.appendChild(groupElement);
				}
			
			return coConstraintsElement;
		}
		}
		return null;
	}

	private Element serializeContentVerbose(CoConstraintTableContent coConstraintsTableContent, List<String> headerIDs,
			int colspanTableWidth) {
		Element tableContent = new Element("tbody");
		if (coConstraintsTable.getContent().getFree() != null) {
			for (CoConstraintTableRow row : coConstraintsTableContent.getFree()) {
				 serializeRowVerbose(row, headerIDs,tableContent);
//				tableContent.appendChild(rowElement);
			}
		}
		if (coConstraintsTableContent.getGroups() != null) {
			for (CoConstraintTableGroup group : coConstraintsTableContent.getGroups()) {
				Element groupElement = serializeGroupVerbose(group, headerIDs, colspanTableWidth);
				tableContent.appendChild(groupElement);
			}
		}
		return tableContent;
	}

	private Element serializeGroupVerbose(CoConstraintTableGroup group, List<String> headerIDs, int colspanTableWidth) {
		Element groupElement = new Element("table");
		groupElement.addAttribute(new Attribute("class", "contentTable"));
		Element groupeTableHeader = serializeGroupHeaderVerbose(group.getData(), colspanTableWidth);
		Element groupeTableContent = serializeContentVerbose(group.getContent(), headerIDs, colspanTableWidth);
		groupElement.appendChild(groupeTableHeader);
		groupElement.appendChild(groupeTableContent);
		return groupElement;
	}

	private Element serializeGroupHeaderVerbose(CoConstraintGroupData data, int colspanTableWidth) {
		Element thead = new Element("thead");
		Element th = new Element("th");
		th.addAttribute(new Attribute("style", "border-top:4pt solid black"));
		th.addAttribute(new Attribute("colspan", "4"));
		th.addAttribute(new Attribute("class", "lightPinkCell"));
		th.appendChild("Group name : " + data.getName() + "  |  " + "Usage : "
				+ data.getRequirements().getUsage().name() + "  |  " + "Cardinality : ["
				+ Integer.toString(data.getRequirements().getCardinality().getMin()) + " : "
				+ data.getRequirements().getCardinality().getMax() + "]");
		thead.appendChild(th);
		return thead;
	}

	private void serializeRowVerbose(CoConstraintTableRow coConstraintTableRow, List<String> headerIDs, Element tableContent) {
		Map<String, List<String>> headerIdsMap = filterHeadersIds(coConstraintsTable);
		Map<String, String> mapIdToLabel = generateMapIdToLabel(coConstraintsTable);
		// Element thColumn = new Element("th");
		// thColumn.appendChild("Column");
		// rowElement.appendChild(thColumn);
		// Element thValue = new Element("th");
		// thValue.appendChild("Value");
		// rowElement.appendChild(thValue);
		// Element td1 = new Element("td");
		// rowElement.appendChild(td1);
		Element trRow1 = new Element("tr");
		// tr.addAttribute(new Attribute("rowspan",
		// String.valueOf(coConstraintsTable.getHeaders().getData().size()) +
		// String.valueOf(coConstraintsTable.getHeaders().getUser().size())+String.valueOf(coConstraintsTable.getHeaders().getSelectors().size())
		// +2));
		Element td1 = new Element("td");
		td1.addAttribute(new Attribute("width", "30%"));
		td1.addAttribute(new Attribute("style","vertical-align:top"));
		// td1.addAttribute(new Attribute("rowspan",
		// String.valueOf(coConstraintsTable.getHeaders().getData().size() +
		// coConstraintsTable.getHeaders().getUser().size() +3)));
		Element tableTd1 = new Element("table");
		tableTd1.addAttribute(new Attribute("class", "contentTable"));
		tableTd1.addAttribute(new Attribute("padding", "unset"));
		Element tbodyTd1 = new Element("tbody");
		td1.appendChild(tableTd1);
		tableTd1.appendChild(tbodyTd1);
		Element th1 = new Element("th");
		tbodyTd1.appendChild(th1);
		th1.appendChild("Column");
		th1.addAttribute(new Attribute("width", "30%"));
		Element th2 = new Element("th");
		tbodyTd1.appendChild(th2);
		th2.appendChild("Value");
		th2.addAttribute(new Attribute("width", "70%"));
		Element trIfHeader = new Element("tr");
		tbodyTd1.appendChild(trIfHeader);
		Element tdIfHeader = new Element("td");
		trIfHeader.appendChild(tdIfHeader);
		tdIfHeader.appendChild("IF");
		tdIfHeader.addAttribute(new Attribute("colspan", "2"));
		tdIfHeader.addAttribute(new Attribute("class", "lightBlueCell"));
		tdIfHeader.addAttribute(new Attribute("align", "center"));
		for (String id : coConstraintTableRow.getCells().keySet()) {
			if (headerIdsMap.get("If").contains(id)) {
				Element trIf = new Element("tr");
				tbodyTd1.appendChild(trIf);
				Element td = new Element("td");
				td.appendChild(mapIdToLabel.get(id));
				trIf.appendChild(td);
				td = new Element("td");
				td.appendChild(toStringACell(coConstraintTableRow.getCells().get(id)));
				trIf.appendChild(td);
			}
		}
		trRow1.appendChild(td1);
		Element tableTd2 = new Element("table");
		tableTd2.addAttribute(new Attribute("class", "contentTable"));  
		Element tbodyTd2 = new Element("tbody");
		tableTd2.appendChild(tbodyTd2);
		Element td2 = new Element("td");
		trRow1.appendChild(td2);
		td2.addAttribute(new Attribute("width", "70%"));
		td2.addAttribute(new Attribute("style","vertical-align:top"));
		td2.addAttribute(new Attribute("padding", "unset"));
		td2.addAttribute(new Attribute("colspan", "2"));
		td2.appendChild(tableTd2);
		Element tr1 = new Element("th");
		tbodyTd2.appendChild(tr1);
		tr1.appendChild("Column");
		tr1.addAttribute(new Attribute("width", "30%"));
		Element tr2 = new Element("th");
		tbodyTd2.appendChild(tr2);
		tr2.appendChild("Value");
		tr2.addAttribute(new Attribute("width", "70%"));
		Element trHeaderThen = new Element("tr");
		tbodyTd2.appendChild(trHeaderThen);
		Element tdThen = new Element("td");
		trHeaderThen.appendChild(tdThen);
		tdThen.appendChild("THEN");
		tdThen.addAttribute(new Attribute("colspan", "2"));
		tdThen.addAttribute(new Attribute("class", "lightGreyCell"));
		tdThen.addAttribute(new Attribute("align", "center"));
		for (String id : coConstraintTableRow.getCells().keySet()) {
			if (headerIdsMap.get("Then").contains(id)) {
				Element trThen = new Element("tr");
				Element tdColumn = new Element("td");
				tdColumn.appendChild(mapIdToLabel.get(id));
				trThen.appendChild(tdColumn);
				Element tdValue = new Element("td");
				tdValue.appendChild(toStringACell(coConstraintTableRow.getCells().get(id)));
				trThen.appendChild(tdValue);
				tbodyTd2.appendChild(trThen);
			}
		}
		Element td3 = new Element("td");
		td3.addAttribute(new Attribute("colspan", "3"));
		Element trRow2 = new Element("tr");
		trRow2.appendChild(td3);
		Element tableTd3 = new Element("table");
		td3.appendChild(tableTd3);
		tableTd3.addAttribute(new Attribute("class", "contentTable"));
		Element tbodyTd3 = new Element("tbody");
		tableTd3.appendChild(tbodyTd3);
		Element trHeaderUser = new Element("tr");
		Element tdUser = new Element("th");
		tdUser.appendChild("User");
		tdUser.addAttribute(new Attribute("class", "greenHeader"));
		tdUser.addAttribute(new Attribute("colspan", "2"));
		tdUser.addAttribute(new Attribute("align", "center"));
		trHeaderUser.appendChild(tdUser);
		tbodyTd3.appendChild(trHeaderUser);
		for (String id : coConstraintTableRow.getCells().keySet()) {
			if (headerIdsMap.get("User").contains(id)) {
				Element trUser = new Element("tr");
				Element tdColumn = new Element("th");
				tdColumn.addAttribute(new Attribute("width", "20%"));
				tdColumn.appendChild(mapIdToLabel.get(id));
				tdColumn.addAttribute(new Attribute("class", "greenHeader"));
				trUser.appendChild(tdColumn);
				Element tdValue = new Element("td");
				tdValue.addAttribute(new Attribute("class", "greenHeader"));
				tdValue.appendChild(toStringACell(coConstraintTableRow.getCells().get(id)));
				trUser.appendChild(tdValue);
				tbodyTd3.appendChild(trUser);
			}
		}
//		Element trRow = new Element("tr");
		tableContent.appendChild(trRow1);
		tableContent.appendChild(trRow2);

		return;
	}

	private Element serializeCoConstraintsTableHeaderVerbose(CoConstraintTable coConstraintsTable) {
		Element thead = new Element("thead");
		thead.addAttribute(new Attribute("class", "contentThead"));
		Element tr = new Element("tr");
		Element th = new Element("th");
		th.addAttribute(new Attribute("class", "ifContentThead"));
		th.addAttribute(new Attribute("width", "30%"));
		// th.addAttribute(new Attribute("colspan", "2"));
		th.appendChild("IF");
		tr.appendChild(th); 
		th = new Element("th");
		th.appendChild("Then & User");
		th.addAttribute(new Attribute("width", "70%"));
		th.addAttribute(new Attribute("colspan", "2"));
		tr.appendChild(th);
		thead.appendChild(tr);
		return thead;
	}

	public Element serializeCoConstraintsTableHeader(CoConstraintTable coConstraintTable) {
		Element thead = new Element("thead");
		thead.addAttribute(new Attribute("class", "contentThead"));
		Element tr = new Element("tr");
		Element th = new Element("th");
		th.addAttribute(new Attribute("rowspan", "2"));
		th.appendChild("Usage");
		tr.appendChild(th);
		th = new Element("th");
		th.addAttribute(new Attribute("rowspan", "2"));
		th.addAttribute(new Attribute("colspan", "2"));
		th.appendChild("Cardinality");
		tr.appendChild(th);
		th = new Element("th");
		th.addAttribute(new Attribute("class", "ifContentThead"));
		th.addAttribute(
				new Attribute("colspan", String.valueOf(coConstraintsTable.getHeaders().getSelectors().size())));
		th.appendChild("IF");
		tr.appendChild(th);
		th = new Element("th");
		th.addAttribute(new Attribute("colspan", String.valueOf(coConstraintsTable.getHeaders().getData().size())));
		th.appendChild("THEN");
		tr.appendChild(th);
		th = new Element("th");
		th.addAttribute(new Attribute("class", "greenHeader"));
		th.addAttribute(new Attribute("colspan", String.valueOf(coConstraintsTable.getHeaders().getUser().size())));
		th.appendChild("USER");
		tr.appendChild(th);
		thead.appendChild(tr);
		tr = new Element("tr");
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintsTable.getHeaders().getSelectors()) {
			if (coConstraintTableHeader != null) {
				Element thIF = new Element("th");
				thIF.addAttribute(new Attribute("class", "ifContentThead"));
				thIF.appendChild(coConstraintTableHeader.getLabel());
				tr.appendChild(thIF);
			}
		}
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintsTable.getHeaders().getData()) {
			if (coConstraintTableHeader != null) {
				Element thThen = new Element("th");
				thThen.appendChild(coConstraintTableHeader.getLabel());
				tr.appendChild(thThen);
			}
		}
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintsTable.getHeaders().getUser()) {
			if (coConstraintTableHeader != null) {
				Element thUser = new Element("th");
				thUser.addAttribute(new Attribute("class", "greenHeader"));
				thUser.appendChild(coConstraintTableHeader.getLabel());
				tr.appendChild(thUser);
			}
		}
		thead.appendChild(tr);
		return thead;
	}

	public Element serializeRow(CoConstraintTableRow coConstraintTableRow, List<String> headerIds) {
		Element tr = new Element("tr");
		Element td = new Element("td");
		td.appendChild(coConstraintTableRow.getRequirements().getUsage().name());
		tr.appendChild(td);
		td = new Element("td");
		td.appendChild(Integer.toString(coConstraintTableRow.getRequirements().getCardinality().getMin()));
		tr.appendChild(td);
		td = new Element("td");
		td.appendChild(coConstraintTableRow.getRequirements().getCardinality().getMax());
		tr.appendChild(td);
		for (String id : headerIds) {
			for (String mapID : coConstraintTableRow.getCells().keySet()) {
				if (mapID.equals(id)) {
					CoConstraintTableCell coConstraintTableCell = coConstraintTableRow.getCells().get(mapID);
					switch (coConstraintTableCell.getType()) {
					case Code:
						CodeCell codeCell = (CodeCell) coConstraintTableCell;
						Element table = new Element("table");
						// table.addAttribute(new Attribute("style", "border : none"));
						Element tr1 = new Element("tr");
						Element tr2 = new Element("tr");
						table.appendChild(tr1);
						table.appendChild(tr2);
						Element td1 = new Element("td");
						Element td2 = new Element("td");
						td1.addAttribute(new Attribute("style", "border : none"));
						td2.addAttribute(new Attribute("style", "border : none"));

						tr1.appendChild(td1);
						tr2.appendChild(td2);
						String location = "";
						for (String s : codeCell.getLocation()) {
							if (codeCell.getLocation().size() == 1) {
								location = codeCell.getLocation().get(0);
							} else if (codeCell.getLocation().size() == 2) {
								location = codeCell.getLocation().get(0) + " or " + codeCell.getLocation().get(1);
							} else if (codeCell.getLocation().size() == 3) {
								location = codeCell.getLocation().get(0) + " or " + codeCell.getLocation().get(1)
										+ " or " + codeCell.getLocation().get(2);
							} else {
								location = location + "or" + s;
							}
						}
						td1.appendChild("Value:" + codeCell.getValue());
						td2.appendChild("location: " + location);
						Element tdCode = new Element("td");
						tdCode.appendChild(table);
						tr.appendChild(tdCode);
						break;

					case Value:
						DataCell dataCell = (DataCell) coConstraintTableCell;
						Element tdData = new Element("td");
						tdData.appendChild(dataCell.getValue());
						tr.appendChild(tdData);
						break;

					case ValueSet:
						VSCell vSCell = (VSCell) coConstraintTableCell;
						Element tdVsCell = new Element("td");
						String tdVsCellContent = "";
						for (VSValue vSValue : vSCell.getVs()) {
							tdVsCellContent = tdVsCellContent + " " + vSValue.getName();
						}
						tdVsCell.appendChild(tdVsCellContent);
						tr.appendChild(tdVsCell);
						break;

					case textArea:
						TextAreaCell textAreaCell = (TextAreaCell) coConstraintTableCell;
						Element tdTextArea = new Element("td");
						tdTextArea.appendChild(textAreaCell.getValue());
						tr.appendChild(tdTextArea);
						break;

					case Ignore:
						IgnoreCell ignoreCell = (IgnoreCell) coConstraintTableCell;
						Element tdIgnoreCell = new Element("td");
						String datatypeName;
						if (datatypesMap.containsKey(ignoreCell.getValue())) {
							Datatype datatype = datatypesMap.get(ignoreCell.getValue());
							datatypeName = datatype.getName() + "-" + datatype.getDescription();
							tdIgnoreCell.appendChild(datatypeName);
						} else {
							tdIgnoreCell.appendChild(ignoreCell.getValue());
						}
						tr.appendChild(tdIgnoreCell);
						break;
					}
				}
			}
		}
		return tr;

	}

	public Element serializeGroup(CoConstraintTableGroup coConstraintTableGroup, List<String> headerIds,
			int colspanTableWidth) {
		Element groupElement = new Element("tr");
		// groupElement.addAttribute(new Attribute("class", "contentTable"));
		Element groupeTableHeader = serializeGroupHeader(coConstraintTableGroup.getData(), colspanTableWidth);
		Element groupeTableContent = serializeContent(coConstraintTableGroup.getContent(), headerIds,
				colspanTableWidth);
		groupElement.appendChild(groupeTableHeader);
		groupElement.appendChild(groupeTableContent);
		return groupElement;
	}

	public Element serializeGroupHeader(CoConstraintGroupData data, int colspanTableWidth) {
		// Element tbody = new Element("thead");
		Element tr = new Element("tr");
		tr.addAttribute(new Attribute("class", "lightGreyCell"));
		tr.addAttribute(new Attribute("style", "border-top:3pt solid black"));
		tr.addAttribute(new Attribute("align", "center"));
		tr.addAttribute(new Attribute("class", "lightPinkCell"));
		Element th = new Element("th");
		th.appendChild(data.getRequirements().getUsage().name());
		tr.appendChild(th);
		th = new Element("th");
		th.appendChild(Integer.toString(data.getRequirements().getCardinality().getMin()));
		tr.appendChild(th);
		th = new Element("th");
		th.appendChild(data.getRequirements().getCardinality().getMax());
		tr.appendChild(th);
		th = new Element("th");
		th.addAttribute(new Attribute("colspan", Integer.toString(colspanTableWidth)));
		th.appendChild("Group name : " + data.getName());
		tr.appendChild(th);
		// tbody.appendChild(tr);
		return tr;
	}

	public Element serializeContent(CoConstraintTableContent content, List<String> headerIds, int colspanTableWidth) {
		Element tableContent = new Element("tbody");
		if (content.getFree() != null) {

			for (CoConstraintTableRow row : content.getFree()) {
				Element rowElement = serializeRow(row, headerIds);
				tableContent.appendChild(rowElement);
			}
		}
		if (content.getGroups() != null) {
			for (CoConstraintTableGroup group : content.getGroups()) {
				Element groupElement = serializeGroup(group, headerIds, colspanTableWidth);
				tableContent.appendChild(groupElement);
			}
		}
		return tableContent;
	}

	public List<String> generateHeadersIDs(CoConstraintTable coConstraintTable) {
		List<String> headerIds = new ArrayList<String>();
		for (CoConstraintTableHeader header : coConstraintTable.getHeaders().getSelectors()) {
			String id = header.getId();
			headerIds.add(id);
		}
		for (CoConstraintTableHeader header : coConstraintTable.getHeaders().getData()) {
			String id = header.getId();
			headerIds.add(id);
		}
		for (CoConstraintTableHeader header : coConstraintTable.getHeaders().getUser()) {
			String id = header.getId();
			headerIds.add(id);
		}
		return headerIds;
	}

	public int calculateGroupNameColspan(CoConstraintTable coConstraintTable) {
		int i = coConstraintTable.getHeaders().getSelectors().size() + coConstraintTable.getHeaders().getData().size()
				+ coConstraintTable.getHeaders().getUser().size();
		return i;
	}

	public Map<String, String> getIdPathMap() {
		// TODO Auto-generated method stub
		return null;
	}

	public Map<String, List<String>> filterHeadersIds(CoConstraintTable coConstraintTable) {
		Map<String, List<String>> headerIdsMap = new HashMap<>();
		List<String> ifListIds = new ArrayList<>();
		List<String> thenListIds = new ArrayList<>();
		List<String> userListIds = new ArrayList<>();
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getSelectors()) {
			String id = coConstraintTableHeader.getId();
			ifListIds.add(id);
		}
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getUser()) {
			String id = coConstraintTableHeader.getId();
			userListIds.add(id);
		}
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getData()) {
			String id = coConstraintTableHeader.getId();
			thenListIds.add(id);
		}
		headerIdsMap.put("If", ifListIds);
		headerIdsMap.put("Then", thenListIds);
		headerIdsMap.put("User", userListIds);
		return headerIdsMap;
	}

	public Map<String, String> generateMapIdToLabel(CoConstraintTable coConstraintTable) {
		Map<String, String> mapIdToLabel = new HashMap<>();
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getSelectors()) {
			mapIdToLabel.put(coConstraintTableHeader.getId(), coConstraintTableHeader.getLabel());
		}
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getData()) {
			mapIdToLabel.put(coConstraintTableHeader.getId(), coConstraintTableHeader.getLabel());
		}
		for (CoConstraintTableHeader coConstraintTableHeader : coConstraintTable.getHeaders().getUser()) {
			mapIdToLabel.put(coConstraintTableHeader.getId(), coConstraintTableHeader.getLabel());
		}
		return mapIdToLabel;
	}

	public String toStringACell(CoConstraintTableCell coConstraintTableCell) {
		String value = "";
		switch (coConstraintTableCell.getType()) {
		case Code:
			CodeCell codeCell = (CodeCell) coConstraintTableCell;
			String location = "";
			for (String s : codeCell.getLocation()) {
				if (codeCell.getLocation().size() == 1) {
					location = codeCell.getLocation().get(0);
				} else if (codeCell.getLocation().size() == 2) {
					location = codeCell.getLocation().get(0) + " or " + codeCell.getLocation().get(1);
				} else if (codeCell.getLocation().size() == 3) {
					location = codeCell.getLocation().get(0) + " or " + codeCell.getLocation().get(1) + " or "
							+ codeCell.getLocation().get(2);
				} else {
					location = location + "or" + s;
				}
			}
			value = location;
			break;

		case Value:
			DataCell dataCell = (DataCell) coConstraintTableCell;
			value = dataCell.getValue();
			break;

		case ValueSet:
			VSCell vSCell = (VSCell) coConstraintTableCell;
			String tdVsCellContent = "";
			for (VSValue vSValue : vSCell.getVs()) {
				tdVsCellContent = tdVsCellContent + " " + vSValue.getName();
			}
			value = tdVsCellContent;
			break;

		case textArea:
			TextAreaCell textAreaCell = (TextAreaCell) coConstraintTableCell;
			value = textAreaCell.getValue();
			break;

		case Ignore:
			IgnoreCell ignoreCell = (IgnoreCell) coConstraintTableCell;
			String datatypeName;
			if (datatypesMap.containsKey(ignoreCell.getValue())) {
				Datatype datatype = datatypesMap.get(ignoreCell.getValue());
				datatypeName = datatype.getName() + "-" + datatype.getDescription();
				value = datatypeName;
			} else {
				value = ignoreCell.getValue();
			}
			break;
		}
		return value;
	}

}