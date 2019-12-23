package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import nu.xom.Attribute;
import nu.xom.Element;

public class CoConstraintSerializationServiceImpl implements  CoConstraintSerializationService{

	@Override
	public Element SerializeCoConstraintVerbose(CoConstraintTable coConstraintsTable) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Element SerializeCoConstraintCompact(CoConstraintTable coConstraintsTable) {
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
				new Attribute("colspan", String.valueOf(coConstraintTable.getHeaders().getSelectors().size())));
		th.appendChild("IF");
		tr.appendChild(th);
		th = new Element("th");
		th.addAttribute(new Attribute("colspan", String.valueOf(coConstraintTable.getHeaders().getConstraints().size())));
		th.appendChild("THEN");
		tr.appendChild(th);
		th = new Element("th");
		th.addAttribute(new Attribute("class", "greenHeader"));
		th.addAttribute(new Attribute("colspan", String.valueOf(coConstraintTable.getHeaders().getNarratives().size())));
		th.appendChild("NARRATIVES");
		tr.appendChild(th);
		thead.appendChild(tr);
		tr = new Element("tr");
		for (CoConstraintHeader coConstraintHeader : coConstraintTable.getHeaders().getSelectors()) {
			if (coConstraintHeader != null) {
				Element thIF = new Element("th");
				thIF.addAttribute(new Attribute("class", "ifContentThead"));
				thIF.appendChild("LABEL IF");
				tr.appendChild(thIF);
			}
		}
		for (CoConstraintHeader coConstraintHeader : coConstraintTable.getHeaders().getConstraints()) {
			if (coConstraintHeader != null) {
				Element thThen = new Element("th");
				thThen.appendChild("LABEL THEN");
				tr.appendChild(thThen);
			}
		}
		for (CoConstraintHeader coConstraintHeader : coConstraintTable.getHeaders().getNarratives()) {
			if (coConstraintHeader != null) {
				Element thUser = new Element("th");
				thUser.addAttribute(new Attribute("class", "greenHeader"));
				thUser.appendChild("LABEL NARRATIVES");
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
