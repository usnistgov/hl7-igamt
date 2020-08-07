package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConstraintExportConfiguration;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ConstraintSerializationServiceImpl implements ConstraintSerializationService{

	public Element serializeConstraints(Set<ConformanceStatement> conformanceStatements, Map<String,Predicate> predicates, ConstraintExportConfiguration constraintExportConfiguration) {
		if(!constraintExportConfiguration.getConformanceStatement() && !constraintExportConfiguration.getPredicate()){
			return null;
		}
		Element constraintsElement = new Element("Constraints");
		if(constraintExportConfiguration.getConformanceStatement()) {
			if(conformanceStatements !=null) {
				for(ConformanceStatement conformanceStatement : conformanceStatements){
					Element conformanceStatementElement = serializeConformanceStatement(conformanceStatement);
					constraintsElement.appendChild(conformanceStatementElement);
				}
			}
		}
		if(constraintExportConfiguration.getPredicate()) {
			if(predicates != null) {
				for(String location : predicates.keySet()){
					Predicate predicate = predicates.get(location);
					System.out.println("Location is : " + location);
					Element predicateElement = serializePredicate(predicate, location);
					constraintsElement.appendChild(predicateElement);
				}
			}
		}
		return constraintsElement;
	};


	@Override
	public Element serializeConformanceStatement(ConformanceStatement conformanceStatement) {
		Element conformanceStatementElement = new Element("ConformanceStatement");
		conformanceStatementElement.addAttribute(new Attribute("identifier",
				conformanceStatement.getIdentifier() != null ? conformanceStatement.getIdentifier() : ""));
		if (conformanceStatement instanceof AssertionConformanceStatement) {
			if (((AssertionConformanceStatement) conformanceStatement).getAssertion() != null) {
				String description =
						((AssertionConformanceStatement) conformanceStatement).getAssertion().getDescription();
				conformanceStatementElement
				.addAttribute(new Attribute("description", description != null ? description : ""));
			}
		} else if (conformanceStatement instanceof FreeTextConformanceStatement) {
			conformanceStatementElement.addAttribute(new Attribute("description",
					((FreeTextConformanceStatement) conformanceStatement).getFreeText() != null
					? ((FreeTextConformanceStatement) conformanceStatement).getFreeText()
							: ""));
		}
		return conformanceStatementElement;

	}

	@Override
	public Element serializePredicate(Predicate predicate, String location) {
		Element predicateElement = new Element("Predicate");
		predicateElement.addAttribute(new Attribute("trueUsage",
				predicate.getTrueUsage() != null ? predicate.getTrueUsage().name() : ""));
		predicateElement.addAttribute(new Attribute("falseUsage",
				predicate.getFalseUsage() != null ? predicate.getFalseUsage().name() : ""));
		predicateElement.addAttribute(new Attribute("location",
				predicate.getLocation() != null ? predicate.getLocation() : ""));
		predicateElement.addAttribute(new Attribute("position",location));
		System.out.println("New field path is : " + predicate.getContext());
		if (predicate instanceof AssertionPredicate) {
			if (((AssertionPredicate) predicate).getAssertion() != null) {
				String description = ((AssertionPredicate) predicate).getAssertion().getDescription();
				predicateElement
				.addAttribute(new Attribute("description", description != null ? description : ""));
			}
		} else if (predicate instanceof FreeTextPredicate) {
			predicateElement.addAttribute(new Attribute("description",
					((FreeTextPredicate) predicate).getFreeText() != null
					? ((FreeTextPredicate) predicate).getFreeText()
							: ""));
		}      
		return predicateElement;	  
	}

	//	 private Element serializeExternalSingleCode(ExternalSingleCode externalSingleCode) {
	//		    Element externalSingleCodeElement = new Element("ExternalSingleCode");
	//		    externalSingleCodeElement.addAttribute(new Attribute("value",
	//		        externalSingleCode.getValue() != null ? externalSingleCode.getValue() : ""));
	//		    externalSingleCodeElement.addAttribute(new Attribute("codeSystem",
	//		        externalSingleCode.getCodeSystem() != null ? externalSingleCode.getCodeSystem() : ""));
	//		    return externalSingleCodeElement;
	//		  }

}
