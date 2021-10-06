package gov.nist.hit.hl7.igamt.ig.domain.verification;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

public class Location {
    String pathId;
    LocationInfo info;
    PropertyType property;

    public Location() {}

    public Location(String pathId, LocationInfo info, PropertyType property) {
        this.pathId = pathId;
        this.info = info;
        this.property = property;
    }

    public Location(String pathId, LocationInfo info) {
        this.pathId = pathId;
        this.info = info;
    }

    public Location(String pathId) {
        this.pathId = pathId;
    }

    public Location(String pathId, PropertyType property) {
        this.pathId = pathId;
        this.property = property;
    }

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

    public LocationInfo getInfo() {
        return info;
    }

    public void setInfo(LocationInfo info) {
        this.info = info;
    }

    public PropertyType getProperty() {
        return property;
    }

    public void setProperty(PropertyType property) {
        this.property = property;
    }
}
