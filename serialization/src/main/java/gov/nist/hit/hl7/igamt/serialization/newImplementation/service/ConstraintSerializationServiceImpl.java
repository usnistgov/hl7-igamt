package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextPredicate;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ConstraintSerializationServiceImpl implements ConstraintSerializationService{

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
	public Element serializePredicate(Predicate predicate) {
	      Element predicateElement = new Element("Predicate");
	      predicateElement.addAttribute(new Attribute("true",
	          predicate.getTrueUsage() != null ? predicate.getTrueUsage().name() : ""));
	      predicateElement.addAttribute(new Attribute("codeSystem",
	          predicate.getFalseUsage() != null ? predicate.getFalseUsage().name() : ""));
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
	
	 private Element serializeExternalSingleCode(ExternalSingleCode externalSingleCode) {
		    Element externalSingleCodeElement = new Element("ExternalSingleCode");
		    externalSingleCodeElement.addAttribute(new Attribute("value",
		        externalSingleCode.getValue() != null ? externalSingleCode.getValue() : ""));
		    externalSingleCodeElement.addAttribute(new Attribute("codeSystem",
		        externalSingleCode.getCodeSystem() != null ? externalSingleCode.getCodeSystem() : ""));
		    return externalSingleCodeElement;
		  }

}
