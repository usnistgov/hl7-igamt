package gov.nist.hit.hl7.igamt.ig.binding;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;

public class BindingContainer<T> {
    private String pathId;
    private LocationInfo locationInfo;
    private T value;

    public BindingContainer() {
    }

    public BindingContainer(String pathId, T value) {
        this.pathId = pathId;
        this.value = value;
    }

    public BindingContainer(String pathId, LocationInfo locationInfo, T value) {
        this.pathId = pathId;
        this.locationInfo = locationInfo;
        this.value = value;
    }

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }

    public LocationInfo getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(LocationInfo locationInfo) {
        this.locationInfo = locationInfo;
    }
}
