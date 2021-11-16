package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Path;

public class StructureElementRef {
    private String pathId;
//    @Deprecated
//    private Type type;
//    @Deprecated
//    private String name; // This is always null, instead I use segment Name from StructureElementRef segment
    private InstancePath path;

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

//    @Deprecated
//    public String getName() {
//        return name;
//    }
//    @Deprecated
//    public void setName(String name) {
//        this.name = name;
//    }

    public InstancePath getPath() {
        return path;
    }

    public void setPath(InstancePath path) {
        this.path = path;
    }

//    @Deprecated
//    public Type getType() {
//        return type;
//    }
//    @Deprecated
//    public void setType(Type type) {
//        this.type = type;
//    }
}
