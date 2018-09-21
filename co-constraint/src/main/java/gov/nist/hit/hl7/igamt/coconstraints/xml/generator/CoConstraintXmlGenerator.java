package gov.nist.hit.hl7.igamt.coconstraints.xml.generator;

import java.util.List;

import org.xembly.ImpossibleModificationException;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;

public interface CoConstraintXmlGenerator {
	
	public String generateXML(List<CoConstraintTable> table) throws ImpossibleModificationException;

}
