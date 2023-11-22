package gov.nist.hit.hl7.igamt.service.verification;

import java.util.Set;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintUsage;
import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;

public interface VerificationEntryService {

    // Implementation Guide
    IgamtObjectError IgTitleIsMissing(String id);
    IgamtObjectError LinkedResourceIsNotFound(String igId, String resourceId, Type resourceType);
    IgamtObjectError LinkedResourceDocumentInfoMissing(String resourceId, Type resourceType);
    IgamtObjectError LinkedResourceDocumentInfoInvalid(String resourceId, Type resourceType);
    IgamtObjectError DuplicateResourceIdentifier(String resourceId, Type resourceType, String label, String version);

    // Extension
    IgamtObjectError MissingResourceExtension(String resourceId, Type resourceType, String label, String version);
    IgamtObjectError InvalidResourceExtension(String resourceId, Type resourceType, String label, String version, String ext);

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

    // Conformance Statements and Predicates
    IgamtObjectError AssertionOccurrenceTypeOnNotRepeatable(Location location, String id, Type type, LocationInfo path, String occurrenceType, String pathQualifier);
    IgamtObjectError AssertionOccurrenceTypeMissing(Location location, String id, Type type, LocationInfo path, String pathQualifier);
    IgamtObjectError AssertionOccurrenceTypeNotValid(Location location, String id, Type type, LocationInfo path, String occurrenceType, String pathQualifier);
    IgamtObjectError AssertionOccurrenceTypeInstanceOnNotMultiLevelRepeatable(Location location, String id, Type type, LocationInfo path, String pathQualifier);
    IgamtObjectError AssertionOccurrenceValueOverMax(Location location, String id, Type type, LocationInfo path, String occurrenceType, int max, int value, String pathQualifier);
    IgamtObjectError AssertionCodeSysMissing(Location location, String id, Type type);
    IgamtObjectError AssertionValueMissing(Location location, String id, Type type, boolean list);
    IgamtObjectError AssertionValueInvalid(Location location,String id, Type type, String value, String requirement, boolean list);
    IgamtObjectError AssertionDescriptionMissing(Location location, String id, Type type, boolean list);
    IgamtObjectError AssertionComparisonPathMissing(Location location, String id, Type type);
    IgamtObjectError AssertionComparisonIncompatible(Location location, String id, Type type, LocationInfo path1, String path1ResourceName, LocationInfo path2, String path2ResourceName);
    IgamtObjectError AssertionComparisonDateTimeIncompatible(Location location, String id, Type type, LocationInfo path1, String path1ResourceName, LocationInfo path2, String path2ResourceName);
    IgamtObjectError FreeTextAssertionScriptMissing(Location location, String id, Type type);
    IgamtObjectError FreeTextAssertionXMLInvalid(Location location, String id, Type type, String xmlError);
    IgamtObjectError DuplicateConformanceStatementIdentifier(Location location, String id, Type type, String identifier);

    // Value Sets
    IgamtObjectError ValuesetMissingCode(Location info, String id, Type type);
    IgamtObjectError ValuesetMissingDescription(Location info, String id, Type type);
    IgamtObjectError ValuesetMissingCodeSys(Location info, String id, Type type);
    IgamtObjectError ValuesetMissingUsage(Location info, String id, Type type);
    IgamtObjectError ValuesetDuplicatedCode(Location location, String id, Type type, String code, String codesys);
    IgamtObjectError Valueset_NotAllowedCodeUsage_ConstrainableProfile(Location location, String id, Type type, String code, String usage);
    IgamtObjectError Valueset_NotAllowedCodeUsage_ImplementableProfile(Location location, String id, Type type, String code, String usage);
    IgamtObjectError Valueset_NotAllowedCodeUsage_ClosedValueset(Location location, String id, Type type, String code, String usage);
    IgamtObjectError Valueset_NotAllowedExtensibility_ConstrainableProfile(Location info, String id, Type type, String extensibility);
    IgamtObjectError Valueset_NotAllowedExtensibility_ImplementableProfile(Location info, String id, Type type, String extensibility);
    IgamtObjectError Valueset_NotAllowedStability_ConstrainableProfile(Location info, String id, Type type, String stability);
    IgamtObjectError Valueset_NotAllowedStability_ImplementableProfile(Location info, String id, Type type, String stability);
    
    
    // Cardinality
    IgamtObjectError CardinalityInvalidRange(LocationInfo info, String id, Type type, String min, String max);
    IgamtObjectError CardinalityInvalidMaxCardinality(LocationInfo info, String id, Type type, String max);
    IgamtObjectError CardinalityNotAllowedMaxCardinality(LocationInfo info, String id, Type type, String max);
    IgamtObjectError CardinalityNotAllowedMinZero(LocationInfo info, String id, Type type, String min);
    IgamtObjectError CardinalityNotAllowedMin(LocationInfo info, String id, Type type, String usage, String min);
    
    
    // Length
    IgamtObjectError ConfLengthInvalid(LocationInfo info, String id, Type type, String confLength);
    IgamtObjectError LengthOrConfLengthMissing(LocationInfo info, String id, Type type);
    IgamtObjectError LengthInvalidMaxLength(LocationInfo info, String id, Type type, String maxLength);
    IgamtObjectError LengthInvalidMinLength(LocationInfo info, String id, Type type, String minLength);
    IgamtObjectError LengthInvalidRange(LocationInfo info, String id, Type type, String minLength, String maxLength);
    IgamtObjectError ConfLengthNotAllowed(LocationInfo info, String id, Type type);
    IgamtObjectError LengthNotAllowed(LocationInfo info, String id, Type type);

    // Conformance Profile
    IgamtObjectError UsageNotAllowedIXUsageSenderProfile(LocationInfo info, String id, Type type);
    IgamtObjectError UsageNOTAllowedIXUsageSenderAndReceiverProfile(LocationInfo l, String id, Type type);
    IgamtObjectError ProfileRoleMissingOrInvalidIX(String id, Type type);
    IgamtObjectError ProfileRoleMissingOrInvalid(String id, Type type);
    IgamtObjectError MaxLevelExceeded(LocationInfo locationInfo, String id, Type type, String resourceName);

    // Constant Value
    IgamtObjectError ConstantInvalidDatatype(LocationInfo location, String id, Type type, SubStructElement e);
    IgamtObjectError ConstantInvalidUsage(LocationInfo location, String id, Type type);
    IgamtObjectError ConstantInvalidLengthRange(LocationInfo location, String id, Type type, String minLength, String maxLength, String constantValue);
}

