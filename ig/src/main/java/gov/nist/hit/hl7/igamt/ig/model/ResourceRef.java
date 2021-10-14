package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class ResourceRef {
    private Type type;
    private String id;

    public ResourceRef(Type type, String id) {
        this.type = type;
        this.id = id;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
