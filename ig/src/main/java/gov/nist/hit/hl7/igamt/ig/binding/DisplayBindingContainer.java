package gov.nist.hit.hl7.igamt.ig.binding;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;

public class DisplayBindingContainer<E extends BindingContainer<?>> {
    E binding;
    LocationInfo locationInfo;

    public DisplayBindingContainer(E binding, LocationInfo locationInfo) {
        this.binding = binding;
        this.locationInfo = locationInfo;
    }

    public DisplayBindingContainer() {
    }

    public E getBinding() {
        return binding;
    }

    public void setBinding(E binding) {
        this.binding = binding;
    }

    public LocationInfo getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(LocationInfo locationInfo) {
        this.locationInfo = locationInfo;
    }
}
