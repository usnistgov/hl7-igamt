package gov.nist.hit.hl7.igamt.service.verification.impl;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.google.common.base.Strings;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintUsage;
import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.service.verification.VerificationEntryService;

@Service
public class DefaultVerificationEntryService implements VerificationEntryService {

    @Override
    public IgamtObjectError IgTitleIsMissing(String id) {
        return new IgamtVerificationEntryBuilder("IG_TITLE_MISSING")
                .error()
                .handleInternally()
                .target(id, Type.IGDOCUMENT)
                .locationInfo("ig.metadata.title", "IG Metadata", null)
                .message("Implementation guide title is missing")
                .entry();
    }

    @Override
    public IgamtObjectError LinkedResourceIsNotFound(String igId, String resourceId, Type resourceType) {
        return new IgamtVerificationEntryBuilder("IG_RESOURCE_MISSING")
                .fatal()
                .handleInternally()
                .target(igId, Type.IGDOCUMENT)
                .locationInfo("ig." + resourceType + ".registry", "IG " +resourceType+" List", null)
                .message("Resource of type '" + resourceType + "' and ID '"+resourceId+"' is missing")
                .entry();
    }

    @Override
    public IgamtObjectError LinkedResourceDocumentInfoMissing(String resourceId, Type resourceType) {
        return new IgamtVerificationEntryBuilder("IG_RESOURCE_DOCUMENT_INFO_MISSING")
                .fatal()
                .handleInternally()
                .target(resourceId, resourceType)
                .locationInfo("resource.metadata", "Resource Document Info", null)
                .message("Resource document information is missing")
                .entry();
    }

    @Override
    public IgamtObjectError LinkedResourceDocumentInfoInvalid(String resourceId, Type resourceType) {
        return new IgamtVerificationEntryBuilder("IG_RESOURCE_DOCUMENT_INFO_INVALID")
                .fatal()
                .handleInternally()
                .target(resourceId, resourceType)
                .locationInfo("resource.metadata", "Resource Document Info", null)
                .message("Resource document information is invalid")
                .entry();
    }

    @Override
    public IgamtObjectError ResourceNotFound(Location location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("RESOURCE_NOT_FOUND")
                .fatal()
                .handleInternally()
                .target(id, type)
                .locationInfo(location)
                .message("In " + type.getValue().toLowerCase() + " Repository, " + type.getValue().toLowerCase() + " : " + id + " is not accessible")
                .entry();
    }

    @Override
    public IgamtObjectError PathNotFound(Location location, String id, Type type, String path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_NOT_FOUND")
                .fatal()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path + " does not exist" + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError PathShouldBePrimitive(Location location, String id, Type type, LocationInfo path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_SHOULD_BE_PRIMITIVE")
                .error()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " should be primitive" + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError PathShouldBeComplex(Location location, String id, Type type, LocationInfo path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_SHOULD_BE_COMPLEX")
                .error()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " should be complex" + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError SingleCodeNotAllowed(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("SINGLE_CODE_NOT_ALLOWED")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.SINGLECODE)
                .message("Single Code binding not allowed at location")
                .entry();
    }

    @Override
    public IgamtObjectError SingleCodeMissingCode(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("SINGLE_CODE_MISSING_CODE")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.SINGLECODE)
                .message("Single Code binding is missing code property")
                .entry();
    }

    @Override
    public IgamtObjectError SingleCodeMissingCodeSystem(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("SINGLE_CODE_MISSING_CODE_SYS")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.SINGLECODE)
                .message("Single Code binding is missing code system property")
                .entry();
    }


    @Override
    public IgamtObjectError ValueSetBindingNotAllowed(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("VALUESET_BINDING_NOT_ALLOWED")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.VALUESET)
                .message("Value Set binding not allowed at location")
                .entry();
    }

    @Override
    public IgamtObjectError MultipleValueSetNotAllowed(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("MULTI_VALUESET_BINDING_NOT_ALLOWED")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.VALUESET)
                .message("Multiple Value Set bindings not allowed at location")
                .entry();
    }

    @Override
    public IgamtObjectError InvalidBindingLocation(String pathId, String name, LocationInfo target, PropertyType prop, String id, Type type, Set<Integer> bindingLocations, String reason) {
        boolean blIsSet = bindingLocations != null && bindingLocations.size() > 0;
        return new IgamtVerificationEntryBuilder("INVALID_BINDING_LOCATION")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, name, prop)
                .message("Invalid binding location : " + (blIsSet ? bindingLocations : '.') + " at " + target.getHl7Path() + (!Strings.isNullOrEmpty(reason) ? " ("+ reason +")" : ""))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintTargetIsNotSegment(String pathId, String locationName, String id, Type type, String path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_TARGET_IS_NOT_SEGMENT")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_SEGMENT)
                .message("Path " + path + " target is not a segment reference "+ (Strings.isNullOrEmpty(pathQualifier) ? "" : "("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintOBX3MappingIsDuplicate(String pathId, String id, Type type, String code) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_OBX3_TO_FLAVOR_MAPPING")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, PropertyType.COCONSTRAINTBINDING_ROW)
                .message("OBX-3 Code : " + code + " is duplicated and associated with different flavors for OBX-5")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintTableIdIsMissing(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_TABLE_ID_MISSING")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_TABLE)
                .message("Co-Constraint table is missing Identifier property")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintTableIdIsDuplicate(String pathId, String locationName, String duplicateIdentifier, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_TABLE_ID_DUPLICATE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_TABLE)
                .message("Co-Constraint table Identifier \""+ duplicateIdentifier +"\" is duplicate")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintInvalidHeaderType(String pathId, String name, PropertyType propertyType, String id, Type type, LocationInfo info, ColumnType column, String reason) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_INVALID_HEADER_TYPE")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, name, propertyType)
                .message("Co-Constraint Table Header " + info.getHl7Path() + " has invalid column type \"" + column + "\" "+ (!Strings.isNullOrEmpty(reason) ? "" : "reason : " + reason))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintInvalidGroupRef(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_INVALID_GROUP_REF")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_GROUP)
                .message("Co-Constraint Group Reference not found")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintGroupNameIsMissing(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_GROUP_NAME_MISSING")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_GROUP)
                .message("Co-Constraint Group is missing name property")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCardinalityMissing(String pathId, String locationName, String id, Type type, boolean group, String cardinality) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CARDINALITY_MISSING")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " is missing " + cardinality + " cardinality property")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintUsageMissing(String pathId, String locationName, String id, Type type, boolean group) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_USAGE_MISSING")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " is missing usage property")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintPrimaryUsageInvalid(String pathId, String locationName, String id, Type type, CoConstraintUsage usage) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_PRIMARY_USAGE_INVALID")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Primary Co-Constraint has invalid usage " + usage)
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCardinalityInvalid(String pathId, String locationName, String id, Type type, boolean group, int min, String max) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CARDINALITY_INVALID")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " cardinality ["+min+".."+max+"] is invalid")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCardinalityAndUsageInvalid(String pathId, String locationName, String id, Type type, boolean group, int min, String max, CoConstraintUsage usage) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CARDINALITY_USAGE_INVALID")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " cardinality ["+min+".."+max+"] and usage "+ usage +" are inconsistent")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintIncompatibleHeaderAndCellType(String pathId, String name, String id, Type type, ColumnType header, ColumnType cell) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CELL_INCOMPATIBLE_TYPE")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, name, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Cell has incompatible type with header, cell type is \"" + cell + "\" header type is \"" + header +"\"")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCodeCellMissingCode(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CODE_CELL_MISSING_CODE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Code Cell has missing Code")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCodeCellMissingCodeSystem(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CODE_CELL_MISSING_CODESYS")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Code Cell has missing Code System")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCodeCellMissingBindingLocation(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CODE_CELL_MISSING_BL")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Code Cell has missing Binding Location")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCodeCellInvalidBindingLocation(String pathId, String locationName, LocationInfo info, String id, Type type, Set<Integer> bindingLocations, String reason) {
        boolean blIsSet = bindingLocations != null && bindingLocations.size() > 0;
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CODE_CELL_INVALID_BL")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Code Cell has invalid binding location : " + (blIsSet ? bindingLocations : '.') + " at " + info.getHl7Path() + (!Strings.isNullOrEmpty(reason) ? " ("+ reason +")" : ""))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintValueCellMissingValue(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_VALUE_CELL_MISSING_VALUE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Constant Value Cell has missing value")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintDatatypeCellMissingValue(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_DATATYPE_CELL_MISSING_VALUE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Datatype Cell has missing value")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintDatatypeCellMissingDatatype(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_DATATYPE_CELL_MISSING_DATATYPE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Datatype Cell has missing datatype")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintValueSetCellInvalidBindingLocation(String pathId, String locationName, LocationInfo info, String id, Type type, Set<Integer> bindingLocations, String reason) {
        boolean blIsSet = bindingLocations != null && bindingLocations.size() > 0;
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_VALUESET_CELL_INVALID_BL")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint ValueSet Cell has invalid binding location : " + (blIsSet ? bindingLocations : '.')  + " at " + info.getHl7Path() + (!Strings.isNullOrEmpty(reason) ? " ("+ reason +")" : ""))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintMultiDatatypeCells(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_DATATYPE_CELL_MULTI")
                .fatal()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Table has multiple columns of DATATYPE type")
                .entry();
    }


    @Override
    public IgamtObjectError CoConstraintMultiVariesCells(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_VARIES_CELL_MULTI")
                .fatal()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Table has multiple columns of VARIES type")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintNoDatatypeCell(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_NO_DATATYPE_CELL")
                .fatal()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Table has multiple a column of VARIES type but no DATATYPE column")
                .entry();
    }
    
    @Override
    public IgamtObjectError AssertionOccurrenceTypeOnNotRepeatable(Location location, String id, Type type, LocationInfo path, String occurrenceType, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("ASSERTION_OCCTYPE_NOT_REPEATABLE")
                .error()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " is not a repeatable element, but has an occurrence selection of type '"+ occurrenceType + "'. " + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError AssertionOccurrenceTypeMissing(Location location, String id, Type type, LocationInfo path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("ASSERTION_OCCTYPE_MISSING")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " is a repeatable element, but has no occurrence selection. " + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError AssertionOccurrenceTypeNotValid(Location location, String id, Type type, LocationInfo path, String occurrenceType, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("ASSERTION_OCCTYPE_INVALID")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " has an invalid occurrence type '"+occurrenceType+"' " + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }


    @Override
    public IgamtObjectError AssertionOccurrenceTypeInstanceOnNotMultiLevelRepeatable(Location location, String id, Type type, LocationInfo path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("ASSERTION_OCCTYPE_INSTANCE_MULTI")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " is repeating at multiple levels, selecting a specific instance of the element is not possible." + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError AssertionOccurrenceValueOverMax(Location location, String id, Type type, LocationInfo path, String occurrenceType, int max, int value, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("ASSERTION_OCC_OVER_MAX")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " is allowed a maximum repetition of " + max + ". An occurrence selector defined with type '" + occurrenceType + "' was given the value of " + value + " which is higher than the allowed"  + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError AssertionCodeSysMissing(Location location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("ASSERTION_CODESYS_MISSING")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Assertion required code system attribute is missing")
                .entry();
    }

    @Override
    public IgamtObjectError AssertionValueMissing(Location location, String id, Type type, boolean list) {
        return new IgamtVerificationEntryBuilder("ASSERTION_VALUE_MISSING")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Assertion required value "+(list ? "list " : "")+"attribute is missing")
                .entry();
    }

    @Override
    public IgamtObjectError AssertionDescriptionMissing(Location location, String id, Type type, boolean list) {
        return new IgamtVerificationEntryBuilder("ASSERTION_DESCRIPTION_MISSING")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Assertion required description "+(list ? "in list " : "attribute ")+"is missing")
                .entry();
    }

    @Override
    public IgamtObjectError AssertionComparisonIncompatible(Location location, String id, Type type, LocationInfo path1, String path1ResourceName, LocationInfo path2, String path2ResourceName) {
        return new IgamtVerificationEntryBuilder("ASSERTION_COMPARE_INCOMPATIBLE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(path1.getHl7Path() + " ("+ path1ResourceName +") and " + path2.getHl7Path() + " ("+ path2ResourceName +") can't be compared because of their incompatible types")
                .entry();
    }

    @Override
    public IgamtObjectError AssertionComparisonPathMissing(Location location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("ASSERTION_COMPARE_PATH_MISSING")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Comparison target path is missing")
                .entry();
    }

    @Override
    public IgamtObjectError AssertionComparisonDateTimeIncompatible(Location location, String id, Type type, LocationInfo path1, String path1ResourceName, LocationInfo path2, String path2ResourceName) {
        return new IgamtVerificationEntryBuilder("ASSERTION_COMPARE_DATETIME_INCOMPATIBLE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Date/Time comparator can’t be used to compare " + path1.getHl7Path() + " ("+ path1ResourceName +") and " + path2.getHl7Path() + " ("+ path2ResourceName +")")
                .entry();
    }

    @Override
    public IgamtObjectError FreeTextAssertionScriptMissing(Location location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("FREETEXT_SCRIPT_MISSING")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Free text assertion XML script is missing (no validation can be performed)")
                .entry();
    }

    @Override
    public IgamtObjectError FreeTextAssertionXMLInvalid(Location location, String id, Type type, String xmlError) {
        return new IgamtVerificationEntryBuilder("FREETEXT_SCRIPT_ERROR")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Invalid assertion XML script: "+ xmlError)
                .entry();
    }

    @Override
    public IgamtObjectError DuplicateConformanceStatementIdentifier(Location location, String id, Type type, String identifier) {
        return new IgamtVerificationEntryBuilder("CS_DUPLICATE_IDENTIFIER")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Duplicate conformance statement identifier : '"+identifier+"'")
                .entry();
    }


    @Override
	public IgamtObjectError Valueset_Missing_Code(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_Code")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODES)
                .message("Missing code value")
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_Missing_Description(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_Description")
                .informational()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.DESCRIPTION)
                .message("Missing code description")
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_Missing_CodeSys(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_CodeSys")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODESYSTEM)
                .message("Missing code system")
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_Missing_Usage(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_Usage")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.USAGE)
                .message("Missing code usage")
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_Duplicated_Code(Location l, String id, Type type, String code, String codesys) {
		return new IgamtVerificationEntryBuilder("Valueset_Duplicated_Code")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODES)
                .message(String.format("The combination of value %s and codesys %s are duplicated", code, codesys))
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_NotAllowedCodeUsage_ConstrainableProfile(Location l, String id, Type type, String code, String usage) {
		Location location = l.clone();
		location.setProperty(PropertyType.USAGE);
		return new IgamtVerificationEntryBuilder("Valueset_NotAllowedCodeUsage_ConstrainableProfile")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(String.format("In the code: %s, the Usage must be one of R/P/E, but current Usage is %s", code, usage))
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_NotAllowedCodeUsage_ImplementableProfile(Location l, String id, Type type, String code, String usage) {
		Location location = l.clone();
		location.setProperty(PropertyType.USAGE);
		return new IgamtVerificationEntryBuilder("Valueset_NotAllowedCodeUsage_ImplementableProfile")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(String.format("In the code: %s, the Usage must be one of R/E, but current Usage is %s", code, usage))
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_NotAllowedCodeUsage_ClosedValueset(Location l, String id, Type type, String code, String usage) {
		Location location = l.clone();
		location.setProperty(PropertyType.USAGE);
		return new IgamtVerificationEntryBuilder("Valueset_NotAllowedCodeUsage_ClosedValueset")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(String.format("In the code: %s, the Usage must be one of R/E, but current Usage is %s", code, usage))
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_NotAllowedExtensibility_ConstrainableProfile(Location l, String id, Type type, String extensibility) {
		Location location = l.clone();
		location.setProperty(PropertyType.EXTENSIBILITY);
		return new IgamtVerificationEntryBuilder("Valueset_NotAllowedExtensibility_ConstrainableProfile")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(String.format("The extensibility value of Valueset must be one of open/closed, but current extensibility is %s", extensibility))
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_NotAllowedExtensibility_ImplementableProfile(Location l, String id, Type type, String extensibility) {
		Location location = l.clone();
		location.setProperty(PropertyType.EXTENSIBILITY);
		return new IgamtVerificationEntryBuilder("Valueset_NotAllowedExtensibility_ImplementableProfile")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(String.format("The extensibility value of Valueset must be one of closed, but current extensibility is %s", extensibility))
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_NotAllowedStability_ConstrainableProfile(Location l, String id, Type type, String stability) {
		Location location = l.clone();
		location.setProperty(PropertyType.STABILITY);
		return new IgamtVerificationEntryBuilder("Valueset_NotAllowedStability_ConstrainableProfile")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(String.format("the stability value of Valueset must be one of static/dynamic, but current stability is %s", stability))
                .entry();
	}

	@Override
	public IgamtObjectError Valueset_NotAllowedStability_ImplementableProfile(Location l, String id, Type type, String stability) {
		Location location = l.clone();
		location.setProperty(PropertyType.STABILITY);
		return new IgamtVerificationEntryBuilder("Valueset_NotAllowedStability_ConstrainableProfile")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message(String.format("the stability value of Valueset must be one of static/dynamic, but current stability is %s", stability))
                .entry();
	}

	@Override
	public IgamtObjectError Cardinality_INVALID_Range(LocationInfo locationInfo, String id, Type type, String min, String max) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_INVALID_RANGE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Min Cardinality value is bigger than Max Cardinality. Current MinCardinality is %s and Current MaxCardinality is %s", min, max))
                .entry();
	}

	@Override
	public IgamtObjectError Cardinality_INVALID_MAXCardinality(LocationInfo locationInfo, String id, Type type, String max) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_INVALID_MAX")
				.error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Max cardinality value should be a number or '*'.  Current MaxCardinality is %s.", max))
                .entry();
	}

	@Override
	public IgamtObjectError Cardinality_NOTAllowed_MAXCardinality(LocationInfo locationInfo, String id, Type type, String max) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_NOT_ALLOWED_MAX")
				.error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Max cardinality value should be 0, if the usage is X. Current MaxCardinality is %s.", max))
                .entry();
	}

	@Override
	public IgamtObjectError Cardinality_NOTAllowed_MINCardinality1(LocationInfo locationInfo, String id, Type type, String min) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_NOT_ALLOWED_MIN_ZERO")
				.error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Min cardinality value should be bigger than 0, if the usage is R. Current MinCardinality is %s", min))
                .entry();
	}

	@Override
	public IgamtObjectError Cardinality_NOTAllowed_MINCardinality2(LocationInfo locationInfo, String id, Type type, String usage, String min) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_NOT_ALLOWED_MIN")
				.error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Min cardinality value should be 0, if the usage is not R. Current usage is %s and current MinCardinality is %s", usage, min))
                .entry();
	}

	@Override
	public IgamtObjectError ConfLength_INVALID(LocationInfo locationInfo, String id, Type type, String confLength) {
		return new IgamtVerificationEntryBuilder("ConfLength_INVALID")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("Either # or = can used to define truncation. The current ConfLength is %s", confLength))
                .entry();
	}

	@Override
	public IgamtObjectError LengthorConfLength_Missing(LocationInfo locationInfo, String id, Type type) {
		return new IgamtVerificationEntryBuilder("LengthorConfLength_Missing")
                .informational()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message("Primitive datatype should have one of Length and ConfLength")
                .entry();
	}

	@Override
	public IgamtObjectError Length_INVALID_MaxLength(LocationInfo locationInfo, String id, Type type, String maxLength) {
		return new IgamtVerificationEntryBuilder("Length_INVALID_MaxLength")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("Max Length should be number, '*' or 'NA'. The current MaxLength is %s", maxLength))
                .entry();
	}

	@Override
	public IgamtObjectError Length_INVALID_MinLength(LocationInfo locationInfo, String id, Type type, String minLength) {
		return new IgamtVerificationEntryBuilder("Length_INVALID_MinLength")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("Min Length should be number or 'NA'. The current MinLength is %s", minLength))
                .entry();
	}

	@Override
	public IgamtObjectError Length_INVALID_Range(LocationInfo locationInfo, String id, Type type, String minLength, String maxLength) {
		return new IgamtVerificationEntryBuilder("Length_INVALID_Range")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("Min Length value is bigger than Max Length. The current MinLength is %s and current MaxLength is %s", minLength, maxLength))
                .entry();
	}

	@Override
	public IgamtObjectError Usage_NOTAllowed_IXUsage_SenderProfile(LocationInfo locationInfo, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Usage_NOTAllowed_IXUsage")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.USAGE)
                .message("IX usage can only be used in conformance profiles with role \"Receiver\".")
                .entry();
	}
	
	@Override
	public IgamtObjectError Usage_NOTAllowed_IXUsage_SenderAndReceiverProfile(LocationInfo locationInfo, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Usage_NOTAllowed_IXUsage")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.USAGE)
                .message("IX usage can only be used in conformance profiles with role \"Receiver\".")
                .entry();
	}
	
	@Override
	public IgamtObjectError Required_ProfileRole_Error(String id, Type type) {
		return new IgamtVerificationEntryBuilder("ProfileRole_MissingOrInValid")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo("metadata", "Metadata", PropertyType.ROLE)
                .message("Profile Role must be specified")
                .entry();
	}
	
	@Override
	public IgamtObjectError Required_ProfileRole_Warning(String id, Type type) {
		return new IgamtVerificationEntryBuilder("ProfileRole_MissingOrInValid")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo("metadata", "Metadata", PropertyType.ROLE)
                .message("Profile Role must be specified")
                .entry();
	}

    @Override
    public IgamtObjectError MaxLevelExceeded(LocationInfo locationInfo, String id, Type type, String datatypeLabel) {
        return new IgamtVerificationEntryBuilder("MESSAGE_NESTING_LEVEL")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, null)
                .message("Message nesting level exceeds allowed for an HL7 message structure. Primitive datatype must be used at this location, found: '"+datatypeLabel+"'")
                .entry();
    }

    @Override
    public IgamtObjectError Constant_INVALID_Datatype(LocationInfo locationInfo, String id, Type type, SubStructElement e) {
            return new IgamtVerificationEntryBuilder("ConstantValue_NOTAllowed_NonPrimitiveDatetype")
            .error()
            .handleByUser()
            .target(id, type)
            .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CONSTANTVALUE)
            .message("Constant Value can only be specified for primitive datatype")
            .entry();
    }

    @Override
    public IgamtObjectError Constant_INVALID_Usage(LocationInfo locationInfo, String id, Type type) {
            return new IgamtVerificationEntryBuilder("ConstantValue_NOTAllowed_XUsage")
            .warning()
            .handleByUser()
            .target(id, type)
            .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CONSTANTVALUE)
            .message("Constant Value cannot be used with X usage")
            .entry();
    }

    @Override
    public IgamtObjectError Constant_INVALID_LengthRange(LocationInfo locationInfo, String id, Type type, String minLength, String maxLength, String constantValue) {
            return new IgamtVerificationEntryBuilder("ConstantValue_LengthInvalid")
            .error()
            .handleByUser()
            .target(id, type)
            .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CONSTANTVALUE)
            .message(String.format("The length of Constant Value: '%s' is not within [%s..%s]", constantValue, minLength, maxLength))
            .entry();
    }
}
