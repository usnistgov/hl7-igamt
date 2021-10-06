package gov.nist.hit.hl7.igamt.service.verification.impl;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.service.VerificationEntryService;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class DefaultVerificationEntryService implements VerificationEntryService {

    @Override
    public IgamtObjectError ResourceNotFound(String pathId, PropertyType propertyType, String id, Type type) {
        return new IgamtVerificationEntryBuilder("RESOURCE_NOT_FOUND")
                .error()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, propertyType)
                .message("In " + type.getValue().toLowerCase() + " Repository, " + type.getValue().toLowerCase() + " : " + id + " is not accessible")
                .entry();
    }

    @Override
    public IgamtObjectError PathNotFound(String pathId, PropertyType propertyType, String id, Type type, String path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_NOT_FOUND")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, propertyType)
                .message("Path :" + path + " does not exist" + (Strings.isNullOrEmpty(pathQualifier) ? "" : "("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError PathShouldBePrimitive(String pathId, PropertyType propertyType, LocationInfo info, String id, Type type, String path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_SHOULD_BE_PRIMITIVE")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, info, propertyType)
                .message("Path :" + path + " should be primitive" + (Strings.isNullOrEmpty(pathQualifier) ? "" : "("+ pathQualifier +")"))
                .entry();
    }

    @Override
    public IgamtObjectError PathShouldBeComplex(String pathId, PropertyType propertyType, LocationInfo info, String id, Type type, String path, String pathQualifier) {
        return new IgamtVerificationEntryBuilder("PATH_SHOULD_BE_COMPLEX")
                .error()
                .handleByUser()
                .target(id, type)
                .locationInfo(pathId, info, propertyType)
                .message("Path :" + path + " should be complex" + (Strings.isNullOrEmpty(pathQualifier) ? "" : "("+ pathQualifier +")"))
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
    public IgamtObjectError InvalidBindingLocation(String pathId, LocationInfo info, String id, Type type, Set<Integer> bindingLocations, String reason) {
        boolean blIsSet = bindingLocations != null && bindingLocations.size() > 0;
        return new IgamtVerificationEntryBuilder("INVALID_BINDING_LOCATION")
                .warning()
                .handleInternally()
                .target(id, type)
                .locationInfo(pathId, info, PropertyType.VALUESET)
                .message("Invalid binding location : " + (blIsSet ? bindingLocations : '.') + (Strings.isNullOrEmpty(reason) ? " ("+ reason +")" : ""))
                .entry();
    }

}
