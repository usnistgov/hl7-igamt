package gov.nist.hit.hl7.igamt.constraints.service;

import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;

public interface ConstraintService{
	
	public Set<RelationShip> collectDependencies(ReferenceIndentifier parent); 
	

}
