package gov.nist.hit.hl7.igamt.ig.model;

import java.util.Objects;

public class CoConstraintOBX3MappingValue {
    private String code;
    private String flavorId;

    public CoConstraintOBX3MappingValue(String code, String flavorId) {
        this.code = code;
        this.flavorId = flavorId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFlavorId() {
        return flavorId;
    }

    public void setFlavorId(String flavorId) {
        this.flavorId = flavorId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CoConstraintOBX3MappingValue that = (CoConstraintOBX3MappingValue) o;
        return code.equals(that.code) &&
                flavorId.equals(that.flavorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code, flavorId);
    }
}
