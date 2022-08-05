package gov.nist.hit.hl7.igamt.ig.service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintUsage;
import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.service.verification.impl.DefaultVerificationEntryService;

import java.util.Set;

public interface VerificationEntryService {

    // Common
    IgamtObjectError ResourceNotFound(Location location, String id, Type type);
    IgamtObjectError PathNotFound(Location location, String id, Type type, String path, String pathQualifier);
    IgamtObjectError PathShouldBePrimitive(Location location, String id, Type type, LocationInfo path, String pathQualifier);
    IgamtObjectError PathShouldBeComplex(Location location, String id, Type type, LocationInfo path, String pathQualifier);

    // Single Code
    IgamtObjectError SingleCodeNotAllowed(String pathId, LocationInfo info, String id, Type type);
    IgamtObjectError SingleCodeMissingCode(String pathId, LocationInfo info, String id, Type type);
    IgamtObjectError SingleCodeMissingCodeSystem(String pathId, LocationInfo info, String id, Type type);

    // Value Set Binding
    IgamtObjectError ValueSetBindingNotAllowed(String pathId, LocationInfo info, String id, Type type);
    IgamtObjectError MultipleValueSetNotAllowed(String pathId, LocationInfo info, String id, Type type);
    IgamtObjectError InvalidBindingLocation(String pathId, String locationName, LocationInfo target, PropertyType prop, String id, Type type, Set<Integer> bindingLocations, String reason);

    // Co-Constraints
    IgamtObjectError CoConstraintTargetIsNotSegment(String pathId, String locationName, String id, Type type, String path, String pathQualifier);
    IgamtObjectError CoConstraintInvalidHeaderType(String pathId, String name, PropertyType propertyType, String id, Type type, LocationInfo info, ColumnType column, String reason);
    IgamtObjectError CoConstraintInvalidGroupRef(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintGroupNameIsMissing(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintCardinalityMissing(String pathId, String locationName, String id, Type type, boolean group, String cardinality);
    IgamtObjectError CoConstraintUsageMissing(String pathId, String locationName, String id, Type type, boolean group);
    IgamtObjectError CoConstraintPrimaryUsageInvalid(String pathId, String locationName, String id, Type type, CoConstraintUsage usage);
    IgamtObjectError CoConstraintCardinalityInvalid(String pathId, String locationName, String id, Type type, boolean group, int min, String max);
    IgamtObjectError CoConstraintCardinalityAndUsageInvalid(String pathId, String locationName, String id, Type type, boolean group, int min, String max, CoConstraintUsage usage);
    IgamtObjectError CoConstraintIncompatibleHeaderAndCellType(String pathId, String name, String id, Type type, ColumnType header, ColumnType cell);
    IgamtObjectError CoConstraintCodeCellMissingCode(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintCodeCellMissingCodeSystem(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintCodeCellMissingBindingLocation(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintCodeCellInvalidBindingLocation(String pathId, String locationName, LocationInfo info, String id, Type type, Set<Integer> bindingLocations, String reason);
    IgamtObjectError CoConstraintValueCellMissingValue(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintDatatypeCellMissingValue(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintDatatypeCellMissingDatatype(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintValueSetCellInvalidBindingLocation(String pathId, String locationName, LocationInfo info, String id, Type type, Set<Integer> bindingLocations, String reason);
    IgamtObjectError CoConstraintMultiDatatypeCells(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintMultiVariesCells(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintNoDatatypeCell(String pathId, String locationName, String id, Type type);

    // Conformance Statements
    IgamtObjectError AssertionOccurrenceTypeOnNotRepeatable(Location location, String id, Type type, LocationInfo path, String occurrenceType, String pathQualifier);
    IgamtObjectError AssertionOccurrenceTypeInstanceOnNotMultiLevelRepeatable(Location location, String id, Type type, LocationInfo path, String pathQualifier);
    IgamtObjectError AssertionOccurrenceValueOverMax(Location location, String id, Type type, LocationInfo path, String occurrenceType, int max, int value, String pathQualifier);
}
