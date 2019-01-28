package gov.nist.hit.hl7.igamt.common.constraint.model;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.model.SectionInfo;
import gov.nist.hit.hl7.igamt.common.base.model.SectionType;
import gov.nist.hit.hl7.igamt.common.constraint.domain.ConformanceStatement;

public class ConformanceStatementDisplay extends SectionInfo{
	  private Set<ConformanceStatement> conformanceStatements;
	  private String name;

	public Set<ConformanceStatement> getConformanceStatements() {
		return conformanceStatements;
	}

	public void setConformanceStatements(Set<ConformanceStatement> conformanceStatements) {
		this.conformanceStatements = conformanceStatements;
	}
	  
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}	
	
	public void complete(Resource elm, SectionType type,boolean readOnly, Set<ConformanceStatement> conformanceStatements ){
		
		super.complete(this, elm, type, readOnly);
		setConformanceStatements(conformanceStatements);
		this.name=elm.getName();
	}

}
