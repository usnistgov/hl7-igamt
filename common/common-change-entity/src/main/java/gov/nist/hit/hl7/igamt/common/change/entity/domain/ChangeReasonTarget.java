package gov.nist.hit.hl7.igamt.common.change.entity.domain;

import gov.nist.hit.hl7.igamt.common.change.entity.exception.InvalidChangeTargetLocation;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ChangeReasonTarget {
    String path;
    PropertyType property;

    public ChangeReasonTarget(String location) throws InvalidChangeTargetLocation {
        Pattern pattern = Pattern.compile("([0-9-.]+)(?:>(\\S*))");
        Matcher matcher = pattern.matcher(location);
        if(matcher.find()) {
            this.path = matcher.group(1);
            String property = matcher.group(2);
            if(property != null && !property.isEmpty()) {
                try {
                    this.property = PropertyType.valueOf(property);
                } catch (Exception exception) {
                    throw new InvalidChangeTargetLocation(property + " is not a valid PropertyType");
                }
            } else {
                throw new InvalidChangeTargetLocation("Property type is required");
            }
        } else {
            throw new InvalidChangeTargetLocation(location + " does not match expression x[-y[-z]...][>[PropertyType]");
        }
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public PropertyType getProperty() {
        return property;
    }

    public void setProperty(PropertyType property) {
        this.property = property;
    }
}
