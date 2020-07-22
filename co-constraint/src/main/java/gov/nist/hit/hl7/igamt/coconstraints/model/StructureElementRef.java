package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Path;

public class StructureElementRef {
    private String pathId;
    private Type type;
    private String name; // This is always null, instead I use segment Name from StructureElementRef segment
    private InstancePath path;

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public InstancePath getPath() {
        return path;
    }

    public void setPath(InstancePath path) {
        this.path = path;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
