//package gov.nist.hit.hl7.igamt.coconstraints.xml.generator;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import org.springframework.stereotype.Service;
//import org.xembly.Directives;
//import org.xembly.ImpossibleModificationException;
//import org.xembly.Xembler;
//
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CellType;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableContent;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableGroup;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableHeader;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableHeaders;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableRequirement;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableRow;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.CodeCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.DataCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.IgnoreCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.VSCell;
//import gov.nist.hit.hl7.igamt.coconstraints.domain.VSValue;
//
//@Service
//public class SimpleCoConstraintXMLGenerator implements CoConstraintXmlGenerator {
//
//	@Override
//	public String generateXML(List<CoConstraintTable> tables) throws ImpossibleModificationException {
//		Directives ccSection = new Directives().add("CoConstraints");
//
//		for(CoConstraintTable table : tables){
//			ccSection.push();
//			Directives payload = new Directives()
//					.add("For")
//					.attr("Segment", table.getSegment());
//			content(payload, table.getHeaders(), table.getContent());
//			ccSection.append(payload);
//			ccSection.pop();
//		}
//
//		return new Xembler(ccSection).xml();
//	}
//
//	public void content(Directives container, CoConstraintTableHeaders headers, CoConstraintTableContent content) throws ImpossibleModificationException{
//		coConstraints(container, headers, content.getFree());
//		if(content.getGroups() != null){
//			for(CoConstraintTableGroup group : content.getGroups()){
//				group(container, headers, group);
//			}
//		}
//
//	}
//
//	public void group(Directives container, CoConstraintTableHeaders headers, CoConstraintTableGroup group) throws ImpossibleModificationException{
//
//		container.push();
//		Directives payload = new Directives()
//							.add("Group")
//							.attr("Name", group.getData().getName());
//
//		addRequirements(payload, group.getData().getRequirements());
//		System.out.println(group.getContent());
//		content(payload, headers, group.getContent());
//		container.append(payload).up().pop();
//	}
//
//	public void coConstraints(Directives container, CoConstraintTableHeaders headers, List<CoConstraintTableRow> rows){
//
//		for(CoConstraintTableRow row : rows){
//			container.push();
//
//			Directives payload = new Directives().add("CoConstraint");
//			addRequirements(payload, row.getRequirements());
//
//			section(payload, "Triggers", headers.getSelectors(), row);
//			section(payload, "Data", headers.getData(), row);
//
//			container.append(payload)
//					 .up()
//					 .pop();
//		}
//
//	}
//
//	public void section(Directives container, String name, List<CoConstraintTableHeader> headers, CoConstraintTableRow row){
//		container.push();
//		container.add(name);
//
//		for(CoConstraintTableHeader header : headers){
//			container.push();
//
//			Directives payload = new Directives();
//			cell(payload, header.getContent().getType(), header.getContent().getPath(), row.get(header.getId()));
//
//			container.append(payload)
//			 		 .up()
//			 		 .pop();
//		}
//		container.pop();
//	}
//
//	public void addRequirements(Directives dir, CoConstraintTableRequirement req){
//		dir.attr("Usage", req.getUsage())
//			.attr("Min", req.getCardinality().getMin())
//			.attr("Max", req.getCardinality().getMax());
//	}
//
//	public void cell(Directives container, CellType type, String path, CoConstraintTableCell cell){
//
//		Directives payload = new Directives();
//		String cellType = "";
//
//		if(cell instanceof DataCell){
//			payload = cell((DataCell) cell);
//			cellType = "PlainText";
//		}
//		else if(cell instanceof VSCell){
//			payload = cell((VSCell) cell);
//			cellType = "ValueSet";
//		}
//		else if(cell instanceof CodeCell){
//			payload = cell((CodeCell) cell);
//			cellType = "Code";
//		}
//		else if(cell instanceof IgnoreCell){
//			return;
//		}
//
//		container.push();
//		container.add(cellType)
//				 .attr("Path", path)
//				 .append(payload)
//				 .pop();
//
//	}
//
//	public Directives cell(DataCell cell){
//		return new Directives()
//				.attr("Value", cell.getValue());
//	}
//
//	public Directives cell(VSCell cell){
//
//		Directives payload = new Directives().add("ValueSetBindings");
//
//		for(VSValue value : cell.getVs()){
//			payload.add("Binding")
//			.attr("ID", value.getBindingIdentifier())
//			.attr("Strength", value.getBindingStrength());
//
//			for(String location : value.getBindingLocation()){
//				payload.push();
//				payload.append(new Directives().add("Location").attr("Path", location + "[1]"));
//				payload.pop();
//			}
//
//			payload.up();
//		}
//
//		return payload;
//	}
//
//	public Directives cell(CodeCell cell){
//		Directives dir = new Directives()
//				.add("PlainText")
//				.attr("Value", cell.getValue());
//
//		for(String location : cell.getLocations()){
//			dir.push();
//			dir.append(new Directives().add("Location").attr("Path", location));
//			dir.pop();
//		}
//
//		return dir;
//	}
//
//}
