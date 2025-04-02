package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.access.model.Action;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public interface UserResourcePermissionService {
	boolean hasPermission(Type type, String id, Action level);
}
