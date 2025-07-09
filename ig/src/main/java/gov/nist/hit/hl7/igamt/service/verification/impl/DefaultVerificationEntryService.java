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
                .message("Resource of type '" + resourceType + "' and ID '"+resourceId+" has missing document information")
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
    public IgamtObjectError DuplicateResourceIdentifier(
            String resourceId, Type resourceType, String label, String version
    ) {
        return new IgamtVerificationEntryBuilder("IG_RESOURCE_DUPLICATE_IDENTIFIER")
                .fatal()
                .handleByUser()
                .target(resourceId, resourceType)
                .locationInfo("resource.extension", "Resource Identifier", PropertyType.IDENTIFIER)
                .message("Resource \"" + label + "\" has duplicate identifier (extension or identifier already in use).")
                .entry();
    }

    @Override
    public IgamtObjectError InvalidResourceReference(LocationInfo location, String id, Type type, PropertyType property) {
        return new IgamtVerificationEntryBuilder("INVALID_RESOURCE_REFERENCE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location.getPathId(), location, property)
                .message("Element has invalid resource reference.")
                .entry();
    }

    @Override
    public IgamtObjectError InvalidResourceReferenceDocumentInfo(LocationInfo location, String id, Type type, PropertyType property) {
        return new IgamtVerificationEntryBuilder("INVALID_RESOURCE_REFERENCE_DOCUMENT_INFO")
                .fatal()
                .handleInternally()
                .target(id, type)
                .locationInfo(location.getPathId(), location, property)
                .message("Element has resource reference with invalid document information.")
                .entry();
    }

    @Override
    public IgamtObjectError MissingResourceExtension(
            String resourceId, Type resourceType, String label, String version
    ) {
        return new IgamtVerificationEntryBuilder("EXTENSION_MISSING")
                .fatal()
                .handleByUser()
                .target(resourceId, resourceType)
                .locationInfo("resource.extension", "Resource Extension", PropertyType.EXT)
                .message("Resource extension is missing")
                .entry();
    }

    @Override
    public IgamtObjectError InvalidResourceExtension(
            String resourceId, Type resourceType, String label, String version, String ext
    ) {
        return new IgamtVerificationEntryBuilder("EXTENSION_INVALID")
                .fatal()
                .handleByUser()
                .target(resourceId, resourceType)
                .locationInfo("resource.extension", "Resource Extension", PropertyType.EXT)
                .message("Resource '"+ label+ "' from version '"+ version +"' has an invalid extension '" + ext + "'. Extension must start with a letter and must not be longer than 8 characters and can only contain letters, numbers, - (dash) and _ (underscore)")
                .entry();
    }

    @Override
    public IgamtObjectError ResourceNotFound(Location location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("RESOURCE_NOT_FOUND")
                .fatal()
                .handleInternally()
                .target(id, type)
                .locationInfo(location)
                .message("Resource of type '" + type.getValue().toLowerCase() + "' and ID '" + id + " is not found")
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
    public IgamtObjectError DynamicMappingValueNotFound(Location location, String id, Type type, String value, Set<String> valueSets) {
        return new IgamtVerificationEntryBuilder("DYNAMIC_MAPPING_VALUE_NOT_FOUND")
                .error()
                .target(id, type)
                .locationInfo(location)
                .message("Dynamic mapping value '"+value+"' is not part of the value sets ["+ String.join(", ", valueSets)+"] bound at location "+ location.getName() +".")
                .entry();
    }

    @Override
    public IgamtObjectError DynamicMappingValueExcludedUsage(Location location, String id, Type type, String value, Set<String> valueSets) {
        return new IgamtVerificationEntryBuilder("DYNAMIC_MAPPING_VALUE_EXCLUDED")
                .error()
                .target(id, type)
                .locationInfo(location)
                .message("Dynamic mapping value '"+value+"' has a usage code of 'E' (excluded) in value sets ["+ String.join(", ", valueSets)+"] bound at location "+ location.getName() +".")
                .entry();
    }

    @Override
    public IgamtObjectError DynamicMappingMissingValue(Location location, String id, Type type, Set<String> values, String valueSet) {
        return new IgamtVerificationEntryBuilder("DYNAMIC_MAPPING_VALUE_MISSING")
                .error()
                .target(id, type)
                .locationInfo(location)
                .message("Values ["+ String.join(", ", values)+"] from value set '"+valueSet+"' do not have a datatype associated in the dynamic mapping.")
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
    public IgamtObjectError InconsequentialCodeUsage(String pathId, String name, LocationInfo target, PropertyType prop, String id, Type type) {
        return new IgamtVerificationEntryBuilder("INCONSEQUENTIAL_R_CODE_USAGE")
                .warning()
                .target(id, type)
                .locationInfo(pathId, name, prop)
                .message("Value Set Binding with S (Suggested) binding strength contains codes with R (required) usage.")
                .entry();
    }

    @Override
    public IgamtObjectError OBX2MessageValueSetBindingNotAllowed(
            String pathId, LocationInfo info, String id, Type type
    ) {
        return new IgamtVerificationEntryBuilder("OBX2_MESSAGE_VS_NOT_ALLOWED")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.VALUESET)
                .message("Message level value set binding not allowed on OBX-2, this location's value set determines dynamic datatype mappings for OBX-5 and should be managed at the OBX segment level")
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
                .message("Co-Constraint Table Header " + info.getHl7Path() + " has invalid column type \"" + column + "\" "+ (Strings.isNullOrEmpty(reason) ? "" : "reason : " + reason))
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
    public IgamtObjectError CoConstraintCellMissing(
            String pathId, String locationName, String id, Type type, String headerName, String headerType
    ) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_CELL_MISSING")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_ROW)
                .message("Co-Constraint row is missing a cell for header "+ headerName +" of type "+headerType)
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
    public IgamtObjectError CoConstraintDatatypeCellNotAllowed(String pathId, String locationName, String id, Type type) {
        return new IgamtVerificationEntryBuilder("COCONSTRAINT_DATATYPE_CELL_NOT_ALLOWED")
                .fatal()
                .target(id, type)
                .locationInfo(pathId, locationName, PropertyType.COCONSTRAINTBINDING_CELL)
                .message("Co-Constraint Table restriction due to OBX-5 dynamic mapping : the IF column group is restricted to only contain a CODE column for OBX-3 when the THEN group contains a DATATYPE column for OBX-2.")
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
    public IgamtObjectError AssertionValueInvalid(
            Location location,
            String id,
            Type type,
            String value,
            String requirement,
            boolean list
    ) {
        return new IgamtVerificationEntryBuilder("ASSERTION_VALUE_INVALID")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("Assertion's value "+(list ? "list contains invalid value(s): "+value : "'"+value+"' is invalid")+". "+ requirement)
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
    public IgamtObjectError FreeTextAssertionXMLLegacyValueSet(Location location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("FREETEXT_SCRIPT_LEGACY_VALUESET")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("'ValueSet' expression is used in the assertion's XML, this expression is limited and does not perform the same validation checks as other constructs such as regular value set validation or co-constraints. It is strongly advised to avoid using it.")
                .entry();
    }

    @Override
    public IgamtObjectError FreeTextAssertionXMLLegacyValueSetInvalidReference(Location location, String id, Type type, String bindingIdentifier) {
        return new IgamtVerificationEntryBuilder("FREETEXT_SCRIPT_LEGACY_VALUESET_REFERENCE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location)
                .message("'ValueSet' expression used in the assertion's XML has reference to nonexistent value set binding identifier '"+bindingIdentifier+"'")
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
	public IgamtObjectError ValuesetMissingCode(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_Code")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODES)
                .message("Missing code value")
                .entry();
	}

	@Override
	public IgamtObjectError ValuesetMissingDescription(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_Description")
                .informational()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.DESCRIPTION)
                .message("Missing code description")
                .entry();
	}

	@Override
	public IgamtObjectError ValuesetMissingCodeSys(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_CodeSys")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODESYSTEM)
                .message("Missing code system")
                .entry();
	}

	@Override
	public IgamtObjectError ValuesetMissingUsage(Location l, String id, Type type) {
		return new IgamtVerificationEntryBuilder("Valueset_Missing_Usage")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.USAGE)
                .message("Missing code usage")
                .entry();
	}

    @Override
    public IgamtObjectError ValuesetMissingPattern(Location l, String id, Type type) {
        return new IgamtVerificationEntryBuilder("Valueset_Missing_Pattern")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.PATTERN)
                .message("Missing code pattern (regular expression)")
                .entry();
    }

	@Override
	public IgamtObjectError ValuesetDuplicatedCode(Location l, String id, Type type, String code, String codesys) {
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
    public IgamtObjectError CompositeProfileBuildIssue(String compositeProfileId, String error) {
        return new IgamtVerificationEntryBuilder("COMPOSITE_PROFILE_BUILD_ISSUE")
                .fatal()
                .handleByUser()
                .target(compositeProfileId, Type.COMPOSITEPROFILE)
                .message(String.format("Could not build conformance profile from composite profile due to: %s", error))
                .entry();
    }

    @Override
    public IgamtObjectError ExternalValuesetMissingURL(Location l, String id, Type type) {
        return new IgamtVerificationEntryBuilder("VALUESET_MISSING_URL")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.URL)
                .message("External value set has missing URL.")
                .entry();
    }

    @Override
    public IgamtObjectError ExternalValuesetInvalidURL(Location l, String id, Type type, String URL) {
        return new IgamtVerificationEntryBuilder("VALUESET_INVALID_URL")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.URL)
                .message("External value set has invalid URL '"+ URL+"'")
                .entry();
    }

    @Override
    public IgamtObjectError InternalTrackedValuesetMissingCodeSet(Location l, String id, Type type) {
        return new IgamtVerificationEntryBuilder("VALUESET_MISSING_CODESETREFERENCE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODESETREFERENCE)
                .message("Value set missing code set reference.")
                .entry();
    }

    @Override
    public IgamtObjectError InternalTrackedValuesetCodeSetNotFound(Location l, String id, Type type) {
        return new IgamtVerificationEntryBuilder("VALUESET_INVALID_CODESETREFERENCE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODESETREFERENCE)
                .message("Value set has reference to code set not found.")
                .entry();
    }

    @Override
    public IgamtObjectError InternalTrackedValuesetNotPublicCodeSet(Location l, String id, Type type) {
        return new IgamtVerificationEntryBuilder("VALUESET_CODESETREFERENCE_NOT_ALLOWED")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(l.getPathId(), l.getName(), PropertyType.CODESETREFERENCE)
                .message("Value set has reference to code set that is not public.")
                .entry();
    }


    @Override
	public IgamtObjectError CardinalityInvalidRange(LocationInfo locationInfo, String id, Type type, String min, String max) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_INVALID_RANGE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Min Cardinality value is greater than Max Cardinality. Current Min Cardinality is %s and Current Max Cardinality is %s", min, max))
                .entry();
	}

	@Override
	public IgamtObjectError CardinalityInvalidMaxCardinality(LocationInfo locationInfo, String id, Type type, String max) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_INVALID_MAX")
				.fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Max Cardinality value should be a number or '*'.  Current Max Cardinality is %s", max))
                .entry();
	}

    @Override
    public IgamtObjectError CardinalityMissingMaxCardinality(LocationInfo locationInfo, String id, Type type) {
        return new IgamtVerificationEntryBuilder("CARDINALITY_MISSING_MAX")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message("Max Cardinality is missing.")
                .entry();
    }

    @Override
	public IgamtObjectError CardinalityNotAllowedMaxCardinality(LocationInfo locationInfo, String id, Type type, String max) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_NOT_ALLOWED_MAX")
				.error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Max Cardinality value should be 0, if the usage is X. Current Max Cardinality is %s", max))
                .entry();
	}

	@Override
	public IgamtObjectError CardinalityNotAllowedMinZero(LocationInfo locationInfo, String id, Type type, String min) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_NOT_ALLOWED_MIN_ZERO")
				.error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Min Cardinality value should be greater than 0, if the usage is R. Current Min Cardinality is %s", min))
                .entry();
	}

	@Override
	public IgamtObjectError CardinalityNotAllowedMin(LocationInfo locationInfo, String id, Type type, String usage, String min) {
		return new IgamtVerificationEntryBuilder("CARDINALITY_NOT_ALLOWED_MIN")
				.error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CARDINALITY)
                .message(String.format("Min Cardinality value should be 0, if the usage is not R. Current usage is %s and current Min Cardinality is %s", usage, min))
                .entry();
	}

	@Override
	public IgamtObjectError ConfLengthInvalid(LocationInfo locationInfo, String id, Type type, String confLength) {
		return new IgamtVerificationEntryBuilder("CONF_LENGTH_INVALID")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("The current ConfLength is '%s'. The truncation flag was left unspecified. The best practice is to define truncation by using '=' (truncation NOT allowed) or '#' (truncation allowed). If unspecified, the default behavior is that truncation is allowed '#'.", confLength))
                .entry();
	}

	@Override
	public IgamtObjectError LengthOrConfLengthMissing(LocationInfo locationInfo, String id, Type type) {
		return new IgamtVerificationEntryBuilder("LENGTH_OR_CONF_LENGTH_MISSING")
                .informational()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message("Primitive datatype does not have one of Length or ConfLength")
                .entry();
	}

	@Override
	public IgamtObjectError LengthInvalidMaxLength(LocationInfo locationInfo, String id, Type type, String maxLength) {
		return new IgamtVerificationEntryBuilder("MAX_LENGTH_INVALID")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("Max Length should be a number or '*'. The current Max Length is '%s'", maxLength))
                .entry();
	}

	@Override
	public IgamtObjectError LengthInvalidMinLength(LocationInfo locationInfo, String id, Type type, String minLength) {
		return new IgamtVerificationEntryBuilder("MIN_LENGTH_INVALID")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("Min Length should be a number. The current Min Length is '%s'", minLength))
                .entry();
	}

    @Override
    public IgamtObjectError LengthInvalidRUsage(LocationInfo locationInfo, String id, Type type, String length) {
        return new IgamtVerificationEntryBuilder("LENGTH_INVALID_R_USAGE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("The target element has R (Required) Usage and a minimum length of '%s'. The minimum length shall be greater than 0", length))
                .entry();
    }

    @Override
    public IgamtObjectError LengthInvalidXUsage(LocationInfo locationInfo, String id, Type type, String minLength, String maxLength) {
        return new IgamtVerificationEntryBuilder("LENGTH_INVALID_X_USAGE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("The target element has X (Excluded) Usage and a length range of [%s..%s]. The length shall be [0..0]", minLength, maxLength))
                .entry();
    }

    @Override
	public IgamtObjectError LengthInvalidRange(LocationInfo locationInfo, String id, Type type, String minLength, String maxLength) {
		return new IgamtVerificationEntryBuilder("LENGTH_INVALID_RANGE")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message(String.format("Min Length value is greater than Max Length. The current Min Length is '%s' and current Max Length is '%s'", minLength, maxLength))
                .entry();
	}

    @Override
    public IgamtObjectError ConfLengthNotAllowed(LocationInfo locationInfo, String id, Type type) {
        return new IgamtVerificationEntryBuilder("CONF_LENGTH_NOT_ALLOWED")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CONFLENGTH)
                .message("ConfLength is not allowed on a complex element")
                .entry();
    }

    @Override
    public IgamtObjectError LengthNotAllowed(LocationInfo locationInfo, String id, Type type) {
        return new IgamtVerificationEntryBuilder("LENGTH_NOT_ALLOWED")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.LENGTH)
                .message("Min/Max Length is not allowed on a complex element")
                .entry();
    }

	@Override
	public IgamtObjectError UsageNotAllowedIXUsageSenderProfile(LocationInfo locationInfo, String id, Type type) {
		return new IgamtVerificationEntryBuilder("USAGE_NOT_ALLOWED_IX_RECEIVER")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.USAGE)
                .message("IX usage can only be used in conformance profiles with role \"Receiver\".")
                .entry();
	}
	
	@Override
	public IgamtObjectError UsageNOTAllowedIXUsageSenderAndReceiverProfile(LocationInfo locationInfo, String id, Type type) {
		return new IgamtVerificationEntryBuilder("USAGE_NOT_ALLOWED_IX_SENDER_RECEIVER")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.USAGE)
                .message("IX usage can only be used in conformance profiles with role \"Receiver\".")
                .entry();
	}
	
	@Override
	public IgamtObjectError ProfileRoleMissingOrInvalidIX(String id, Type type) {
		return new IgamtVerificationEntryBuilder("PROFILE_ROLE_MISSING_OR_INVALID_IX")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo("metadata", "Metadata", PropertyType.ROLE)
                .message("Profile Role must be specified when IX usage is used in conformance profile")
                .entry();
	}
	
	@Override
	public IgamtObjectError ProfileRoleMissingOrInvalid(String id, Type type) {
		return new IgamtVerificationEntryBuilder("PROFILE_ROLE_MISSING_OR_INVALID")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo("metadata", "Metadata", PropertyType.ROLE)
                .message("Profile Role should be specified")
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
    public IgamtObjectError ConstantInvalidDatatype(LocationInfo locationInfo, String id, Type type, SubStructElement e) {
            return new IgamtVerificationEntryBuilder("CONSTANT_VALUE_COMPLEX_DT")
            .error()
            .handleByUser()
            .target(id, type)
            .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CONSTANTVALUE)
            .message("Constant Value can only be specified for elements with a primitive datatype")
            .entry();
    }

    @Override
    public IgamtObjectError ConstantInvalidUsage(LocationInfo locationInfo, String id, Type type) {
            return new IgamtVerificationEntryBuilder("CONSTANT_VALUE_USAGE_X")
            .warning()
            .handleByUser()
            .target(id, type)
            .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CONSTANTVALUE)
            .message("Constant Value cannot be specified for elements with X usage")
            .entry();
    }

    @Override
    public IgamtObjectError ConstantInvalidLengthRange(LocationInfo locationInfo, String id, Type type, String minLength, String maxLength, String constantValue) {
        return new IgamtVerificationEntryBuilder("CONSTANT_VALUE_LENGTH")
            .error()
            .handleByUser()
            .target(id, type)
            .locationInfo(locationInfo.getPathId(), locationInfo, PropertyType.CONSTANTVALUE)
            .message(String.format("The length of Constant Value: '%s' is not within [%s..%s]", constantValue, minLength, maxLength))
            .entry();
    }

    @Override
    public IgamtObjectError InvalidSlicingTargetType(LocationInfo location, String id, Type type, Type targetType) {
        return new IgamtVerificationEntryBuilder("INVALID_SLICING_TARGET")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location.getPathId(), location, PropertyType.SLICING)
                .message(String.format("Slicing target is of type %s", targetType))
                .entry();
    }

    @Override
    public IgamtObjectError EmptySlicing(LocationInfo location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("EMPTY_SLICING")
                .warning()
                .handleByUser()
                .target(id, type)
                .locationInfo(location.getPathId(), location, PropertyType.SLICING)
                .message("Location has slicing defined with no slice definition")
                .entry();
    }

    @Override
    public IgamtObjectError SliceMissingFlavor(LocationInfo location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("SLICE_MISSING_FLAVOR")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location.getPathId(), location, PropertyType.SLICE_FLAVOR)
                .message("Location has slice defined without a flavor")
                .entry();
    }

    @Override
    public IgamtObjectError OrderedSlicingInvalidPosition(LocationInfo location, String id, Type type, int position) {
        return new IgamtVerificationEntryBuilder("ORDERED_SLICE_INVALID_POSITION")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location.getPathId(), location, PropertyType.ORDERED_SLICE_POSITION)
                .message("Location has ordered slice with invalid position '"+ position +"'")
                .entry();
    }

    @Override
    public IgamtObjectError OrderedSlicingWithDuplicatePosition(
            LocationInfo location,
            String id,
            Type type,
            int position
    ) {
        return new IgamtVerificationEntryBuilder("ORDERED_SLICE_DUPLICATE_POSITION")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(location.getPathId(), location, PropertyType.ORDERED_SLICE_POSITION)
                .message("Location has ordered slice with duplicate position "+ position)
                .entry();
    }

    @Override
    public IgamtObjectError ConditionalSlicingAssertionMissing(LocationInfo location, String id, Type type) {
        return new IgamtVerificationEntryBuilder("CONDITIONAL_SLICE_MISSING_ASSERTION")
                .fatal()
                .handleByUser()
                .target(id, type)
                .locationInfo(location.getPathId(), location, PropertyType.CONDITIONAL_SLICE_ASSERTION)
                .message("Location has conditional slice with missing assertion")
                .entry();
    }
}
