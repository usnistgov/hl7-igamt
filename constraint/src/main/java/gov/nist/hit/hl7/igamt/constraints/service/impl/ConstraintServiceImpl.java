package gov.nist.hit.hl7.igamt.constraints.service.impl;

import java.util.Set;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.common.base.util.ReferenceIndentifier;
import gov.nist.hit.hl7.igamt.common.base.util.RelationShip;
import gov.nist.hit.hl7.igamt.constraints.service.ConstraintService;

@Service
public class ConstraintServiceImpl implements ConstraintService{

	@Override
	public Set<RelationShip> collectDependencies(ReferenceIndentifier parent) {
		// TODO Auto-generated method stub
		return null;
	}

}
