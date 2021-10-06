package gov.nist.hit.hl7.igamt.service.verification.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.ig.domain.verification.IgamtObjectError;
import gov.nist.hit.hl7.igamt.ig.domain.verification.Location;

public class IgamtVerificationEntryBuilder {
    IgamtObjectError error;

    public IgamtVerificationEntryBuilder(String code) {
        this.error = new IgamtObjectError();
        this.error.setCode(code);
    }

    public IgamtVerificationEntryBuilder handleByUser() {
        this.error.setHandleBy("User");
        return this;
    }

    public IgamtVerificationEntryBuilder handleInternally() {
        this.error.setHandleBy("Internal");
        return this;
    }

    public IgamtVerificationEntryBuilder error() {
        this.error.setSeverity("ERROR");
        return this;
    }

    public IgamtVerificationEntryBuilder fatal() {
        this.error.setSeverity("FATAL");
        return this;
    }

    public IgamtVerificationEntryBuilder warning() {
        this.error.setSeverity("WARNING");
        return this;
    }

    public IgamtVerificationEntryBuilder target(DisplayElement displayElement) {
        this.error.setTargetType(displayElement.getType());
        this.error.setTarget(displayElement.getId());
        return this;
    }

    public IgamtVerificationEntryBuilder target(Resource resource) {
        this.error.setTargetType(resource.getType());
        this.error.setTarget(resource.getId());
        return this;
    }

    public IgamtVerificationEntryBuilder target(String id, Type type) {
        this.error.setTargetType(type);
        this.error.setTarget(id);
        return this;
    }

    public IgamtVerificationEntryBuilder message(String message) {
        this.error.setDescription(message);
        return this;
    }

    public IgamtVerificationEntryBuilder locationInfo(String pathId, LocationInfo info, PropertyType propertyType) {
        this.error.setLocationInfo(new Location(pathId, info, propertyType));
        return this;
    }

    public IgamtVerificationEntryBuilder locationInfo(String pathId, LocationInfo info) {
        this.error.setLocationInfo(new Location(pathId, info));
        return this;
    }

    public IgamtVerificationEntryBuilder locationInfo(String pathId) {
        this.error.setLocationInfo(new Location(pathId));
        return this;
    }

    public IgamtVerificationEntryBuilder locationInfo(String pathId, PropertyType propertyType) {
        this.error.setLocationInfo(new Location(pathId, propertyType));
        return this;
    }

    @Deprecated
    public IgamtVerificationEntryBuilder location(String location) {
        this.error.setLocation(location);
        return this;
    }

    public IgamtObjectError entry() {
        return this.error;
    }


}
