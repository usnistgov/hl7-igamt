package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintUsage;
import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;
import gov.nist.hit.hl7.igamt.ig.service.VerificationEntryService;
import org.springframework.stereotype.Service;
import java.util.Set;

@Service
public class DefaultVerificationEntryService implements VerificationEntryService {

    @Override
    public IgamtObjectError ResourceNotFound(Location location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("RESOURCE_NOT_FOUND")
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(location)
                .message("In " + type.getValue().toLowerCase() + " Repository, " + type.getValue().toLowerCase() + " : " + id + " is not accessible")
                .entry();
    }

    @Override
    public IgamtObjectError PathNotFound(Location location, String id, Type type, String path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_NOT_FOUND")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path + " does not exist" + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError PathShouldBePrimitive(Location location, String id, Type type, LocationInfo path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_SHOULD_BE_PRIMITIVE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " should be primitive" + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError PathShouldBeComplex(Location location, String id, Type type, LocationInfo path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_SHOULD_BE_COMPLEX")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " should be complex" + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError SingleCodeNotAllowed(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("SINGLE_CODE_NOT_ALLOWED")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.SINGLECODE)
                .message("Single Code binding not allowed at location")
                .entry();
    }

    @Override
    public IgamtObjectError SingleCodeMissingCode(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("SINGLE_CODE_MISSING_CODE")
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.SINGLECODE)
                .message("Single Code binding is missing code property")
                .entry();
    }

    @Override
    public IgamtObjectError SingleCodeMissingCodeSystem(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("SINGLE_CODE_MISSING_CODE_SYS")
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.SINGLECODE)
                .message("Single Code binding is missing code system property")
                .entry();
    }


    @Override
    public IgamtObjectError ValueSetBindingNotAllowed(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("VALUESET_BINDING_NOT_ALLOWED")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.VALUESET)
                .message("Value Set binding not allowed at location")
                .entry();
    }

    @Override
    public IgamtObjectError MultipleValueSetNotAllowed(String pathId, LocationInfo info, String id, Type type) {
        return new IgamtVerificationEntryBuilder("MULTI_VALUESET_BINDING_NOT_ALLOWED")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.VALUESET)
                .message("Multiple Value Set bindings not allowed at location")
                .entry();
    }

    @Override
    public IgamtObjectError InvalidBindingLocation(String pathId, String name, LocationInfo target, PropertyType prop, String id, Type type, Set<Integer> bindingLocations, String reason) {
        boolean blIsSet = bindingLocations != null && bindingLocations.size() > 0;
        return new IgamtVerificationEntryBuilder("INVALID_BINDING_LOCATION")
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, name, prop)
                .message("Invalid binding location : " + (blIsSet ? bindingLocations : '.') + " at " + target.getHl7Path() + (!Strings.isNullOrEmpty(reason) ? " ("+ reason +")" : ""))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintTargetIsNotSegment(String pathId, String locationName, String id, Type type, String path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_TARGET_IS_NOT_SEGMENT")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_SEGMENT)
                .message("Path " + path + " target is not a segment reference "+ (Strings.isNullOrEmpty(pathQualifier) ? "" : "("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintOBX3MappingIsDuplicate(String pathId, String id, Type type, String code) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_OBX3_TO_FLAVOR_MAPPING")
                .error()
                .handleByUser()
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
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, name, propertyType)
                .message("Co-Constraint Table Header " + info.getHl7Path() + " has invalid column type \"" + column + "\" "+ (!Strings.isNullOrEmpty(reason) ? "" : "reason : " + reason))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintInvalidGroupRef(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_INVALID_GROUP_REF")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_GROUP)
                .message("Co-Constraint Group Reference not found")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintGroupNameIsMissing(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_GROUP_NAME_MISSING")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_GROUP)
                .message("Co-Constraint Group is missing name property")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCardinalityMissing(String pathId, String locationName, String id, Type type, boolean group, String cardinality) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CARDINALITY_MISSING")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " is missing " + cardinality + " cardinality property")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintUsageMissing(String pathId, String locationName, String id, Type type, boolean group) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_USAGE_MISSING")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " is missing usage property")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintPrimaryUsageInvalid(String pathId, String locationName, String id, Type type, CoConstraintUsage usage) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_PRIMARY_USAGE_INVALID")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Primary Co-Constraint has invalid usage " + usage)
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCardinalityInvalid(String pathId, String locationName, String id, Type type, boolean group, int min, String max) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CARDINALITY_INVALID")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " cardinality ["+min+".."+max+"] is invalid")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCardinalityAndUsageInvalid(String pathId, String locationName, String id, Type type, boolean group, int min, String max, CoConstraintUsage usage) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CARDINALITY_USAGE_INVALID")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, group ? PropertyType.COCONSTRAINTBINDING_GROUP : PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint " + (group ? "Group" : "") + " cardinality ["+min+".."+max+"] and usage "+ usage +" are inconsistent")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintIncompatibleHeaderAndCellType(String pathId, String name, String id, Type type, ColumnType header, ColumnType cell) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CELL_INCOMPATIBLE_TYPE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, name, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Cell has incompatible type with header, cell type is \"" + cell + "\" header type is \"" + header +"\"")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCodeCellMissingCode(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CODE_CELL_MISSING_CODE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Code Cell has missing Code")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCodeCellMissingCodeSystem(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CODE_CELL_MISSING_CODESYS")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Code Cell has missing Code System")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintCodeCellMissingBindingLocation(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CODE_CELL_MISSING_BL")
                .error()
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
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Code Cell has invalid binding location : " + (blIsSet ? bindingLocations : '.') + " at " + info.getHl7Path() + (!Strings.isNullOrEmpty(reason) ? " ("+ reason +")" : ""))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintValueCellMissingValue(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_VALUE_CELL_MISSING_VALUE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Constant Value Cell has missing value")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintDatatypeCellMissingValue(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_DATATYPE_CELL_MISSING_VALUE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Datatype Cell has missing value")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintDatatypeCellMissingDatatype(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_DATATYPE_CELL_MISSING_DATATYPE")
                .error()
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
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint ValueSet Cell has invalid binding location : " + (blIsSet ? bindingLocations : '.')  + " at " + info.getHl7Path() + (!Strings.isNullOrEmpty(reason) ? " ("+ reason +")" : ""))
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintMultiDatatypeCells(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_DATATYPE_CELL_MULTI")
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Table has multiple columns of DATATYPE type")
                .entry();
    }


    @Override
    public IgamtObjectError CoConstraintMultiVariesCells(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_VARIES_CELL_MULTI")
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Table has multiple columns of VARIES type")
                .entry();
    }

    @Override
    public IgamtObjectError CoConstraintNoDatatypeCell(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_NO_DATATYPE_CELL")
                .error()
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
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Path : " + path.getHl7Path() + " is not a repeatable element, but has an occurrence selection of type '"+ occurrenceType + "'. " + (Strings.isNullOrEmpty(pathQualifier) ? "" : " ("+ pathQualifier +")"))
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

}
