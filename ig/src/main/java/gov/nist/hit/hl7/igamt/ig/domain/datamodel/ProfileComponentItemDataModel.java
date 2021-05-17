package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;

import java.util.Set;

public class ProfileComponentItemDataModel {
    String path;
    LocationInfo locationInfo;
    Set<ItemProperty> itemProperties;

    public ProfileComponentItemDataModel(String path, LocationInfo locationInfo, Set<ItemProperty> itemProperties) {
        this.path = path;
        this.locationInfo = locationInfo;
        this.itemProperties = itemProperties;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public LocationInfo getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(LocationInfo locationInfo) {
        this.locationInfo = locationInfo;
    }

    public Set<ItemProperty> getItemProperties() {
        return itemProperties;
    }

    public void setItemProperties(Set<ItemProperty> itemProperties) {
        this.itemProperties = itemProperties;
    }
}
