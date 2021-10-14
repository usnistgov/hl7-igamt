package gov.nist.hit.hl7.igamt.ig.service;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;

import java.util.Set;

public interface VerificationEntryService {
    IgamtObjectError ResourceNotFound(String pathId, PropertyType propertyType, String id, Type type);
    IgamtObjectError PathNotFound(String pathId, PropertyType propertyType, String id, Type type, String path, String pathQualifier);
    IgamtObjectError PathShouldBePrimitive(String pathId, PropertyType propertyType, LocationInfo info, String id, Type type, String path, String pathQualifier);
    IgamtObjectError PathShouldBeComplex(String pathId, PropertyType propertyType, LocationInfo info, String id, Type type, String path, String pathQualifier);
    IgamtObjectError SingleCodeNotAllowed(String pathId, LocationInfo info, String id, Type type);
    IgamtObjectError ValueSetBindingNotAllowed(String pathId, LocationInfo info, String id, Type type);
    IgamtObjectError MultipleValueSetNotAllowed(String pathId, LocationInfo info, String id, Type type);
    IgamtObjectError InvalidBindingLocation(String pathId, LocationInfo info, String id, Type type, Set<Integer> bindingLocations, String reason);
}
