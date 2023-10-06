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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ResourceRef that = (ResourceRef) o;

        if (type != that.type) return false;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        int result = type.hashCode();
        result = 31 * result + id.hashCode();
        return result;
    }
}
