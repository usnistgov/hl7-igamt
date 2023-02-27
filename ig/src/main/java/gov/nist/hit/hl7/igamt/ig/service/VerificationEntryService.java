package gov.nist.hit.hl7.igamt.ig.service;

import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintUsage;
import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;

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
    IgamtObjectError CoConstraintOBX3MappingIsDuplicate(String pathId, String id, Type type, String code);
    IgamtObjectError CoConstraintTableIdIsMissing(String pathId, String locationName, String id, Type type);
    IgamtObjectError CoConstraintTableIdIsDuplicate(String pathId, String locationName, String duplicateIdentifier, String id, Type type);

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
    IgamtObjectError AssertionOccurrenceTypeMissing(Location location, String id, Type type, LocationInfo path, String pathQualifier);
    IgamtObjectError AssertionOccurrenceTypeNotValid(Location location, String id, Type type, LocationInfo path, String occurrenceType, String pathQualifier);
    IgamtObjectError AssertionOccurrenceTypeInstanceOnNotMultiLevelRepeatable(Location location, String id, Type type, LocationInfo path, String pathQualifier);
    IgamtObjectError AssertionOccurrenceValueOverMax(Location location, String id, Type type, LocationInfo path, String occurrenceType, int max, int value, String pathQualifier);
    IgamtObjectError AssertionCodeSysMissing(Location location, String id, Type type);
    IgamtObjectError AssertionValueMissing(Location location, String id, Type type, boolean list);
    IgamtObjectError AssertionDescriptionMissing(Location location, String id, Type type, boolean list);
    IgamtObjectError AssertionComparisonPathMissing(Location location, String id, Type type);
    IgamtObjectError AssertionComparisonIncompatible(Location location, String id, Type type, LocationInfo path1, String path1ResourceName, LocationInfo path2, String path2ResourceName);
    IgamtObjectError AssertionComparisonDateTimeIncompatible(Location location, String id, Type type, LocationInfo path1, String path1ResourceName, LocationInfo path2, String path2ResourceName);

    // Value Sets
    IgamtObjectError Valueset_Missing_Code(Location info, String id, Type type);
    IgamtObjectError Valueset_Missing_Description(Location info, String id, Type type);
    IgamtObjectError Valueset_Missing_CodeSys(Location info, String id, Type type);
    IgamtObjectError Valueset_Missing_Usage(Location info, String id, Type type);
    IgamtObjectError Valueset_Duplicated_Code(Location location, String id, Type type, String code, String codesys);
    IgamtObjectError Valueset_NotAllowedCodeUsage_ConstrainableProfile(Location location, String id, Type type, String code, String usage);
    IgamtObjectError Valueset_NotAllowedCodeUsage_ImplementableProfile(Location location, String id, Type type, String code, String usage);
    IgamtObjectError Valueset_NotAllowedCodeUsage_ClosedValueset(Location location, String id, Type type, String code, String usage);
    IgamtObjectError Valueset_NotAllowedExtensibility_ConstrainableProfile(Location info, String id, Type type, String extensibility);
    IgamtObjectError Valueset_NotAllowedExtensibility_ImplementableProfile(Location info, String id, Type type, String extensibility);
    IgamtObjectError Valueset_NotAllowedStability_ConstrainableProfile(Location info, String id, Type type, String stability);
    IgamtObjectError Valueset_NotAllowedStability_ImplementableProfile(Location info, String id, Type type, String stability);
    
    
    // Cardinality
    IgamtObjectError Cardinality_INVALID_Range(Location info, String id, Type type, String min, String max);
    IgamtObjectError Cardinality_INVALID_MAXCardinality(Location info, String id, Type type, String max);
    IgamtObjectError Cardinality_NOTAllowed_MAXCardinality(Location info, String id, Type type, String max);
    IgamtObjectError Cardinality_NOTAllowed_MINCardinality1(Location info, String id, Type type, String min);
    IgamtObjectError Cardinality_NOTAllowed_MINCardinality2(Location info, String id, Type type, String usage, String min);
    
    
    // Length
    IgamtObjectError ConfLength_INVALID(Location info, String id, Type type, String confLength);
    IgamtObjectError LengthorConfLength_Missing(Location info, String id, Type type);
    IgamtObjectError Length_INVALID_MaxLength(Location info, String id, Type type, String maxLength);
    IgamtObjectError Length_INVALID_MinLength(Location info, String id, Type type, String minLength);
    IgamtObjectError Length_INVALID_Range(Location info, String id, Type type, String minLength, String maxLength);
}
