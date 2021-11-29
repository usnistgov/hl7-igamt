package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.InstancePath;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Path;

public class StructureElementRef {
    private String pathId;
    private InstancePath path;

    public StructureElementRef() {
    }

    public StructureElementRef(String pathId) {
        this.pathId = pathId;
        this.path = InstancePath.fromString(pathId);
    }

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

    public InstancePath getPath() {
        return path;
    }

    public void setPath(InstancePath path) {
        this.path = path;
    }

}
