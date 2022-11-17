package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

import java.util.Objects;

public class CoConstraintMappingLocation {
    private String locationId;
    private String flavorId;
    private DisplayElement resource;

    public CoConstraintMappingLocation(String locationId, String flavorId, DisplayElement resource) {
        this.locationId = locationId;
        this.flavorId = flavorId;
        this.resource = resource;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getFlavorId() {
        return flavorId;
    }

    public void setFlavorId(String flavorId) {
        this.flavorId = flavorId;
    }

    public DisplayElement getResource() {
        return resource;
    }

    public void setResource(DisplayElement resource) {
        this.resource = resource;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CoConstraintMappingLocation that = (CoConstraintMappingLocation) o;
        return locationId.equals(that.locationId) &&
                flavorId.equals(that.flavorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(locationId, flavorId);
    }
}
