package gov.nist.hit.hl7.igamt.ig.domain.verification;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import org.apache.commons.lang.StringUtils;

public class Location {
    String pathId;
    String name;
    LocationInfo info;
    PropertyType property;

    public Location() {}

    public Location(String pathId, LocationInfo info, PropertyType property) {
        this.pathId = pathId;
        this.info = info;
        this.property = property;
        if(info != null) {
            this.name = info.getHl7Path();
            if(!StringUtils.isBlank(info.getName())) {
                this.name += " ("+info.getName()+")";
            }
        } else {
            this.name = pathId;
        }
    }

    public Location(String pathId, String name, PropertyType property) {
        this.pathId = pathId;
        if(!Strings.isNullOrEmpty(name)) {
            this.name = name;
        } else {
            this.name = this.pathId;
        }
        this.property = property;
    }

    public Location(String pathId, LocationInfo info) {
        this.pathId = pathId;
        this.info = info;
        if(info != null) {
            this.name = info.getHl7Path();
            if(!StringUtils.isBlank(info.getName())) {
                this.name += " ("+info.getName()+")";
            }
        } else {
            this.name = pathId;
        }
    }

    public Location(String pathId) {
        this.pathId = pathId;
        this.name = pathId;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

	@Override
	public String toString() {
		return "Location [pathId=" + pathId + ", name=" + name + ", info=" + info + ", property=" + property + "]";
	}
        
    public Location clone() {
    	Location l = new Location();
    	l.setName(this.getName());
    	l.setPathId(this.getPathId());
    	l.setProperty(this.getProperty());
    	l.setInfo(this.info.clone());
    	
    	return l;
    }
}
