package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class DataElementHeaderInfo {
    protected String version;
    protected String parent;
    protected String datatype;
    protected int location;
    protected CoConstraintCardinality cardinality;
    protected Type type;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public String getDatatype() {
        return datatype;
    }

    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }

    public int getLocation() {
        return location;
    }

    public void setLocation(int location) {
        this.location = location;
    }

    public CoConstraintCardinality getCardinality() {
        return cardinality;
    }

    public void setCardinality(CoConstraintCardinality cardinality) {
        this.cardinality = cardinality;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public DataElementHeaderInfo clone() {
        DataElementHeaderInfo info = new DataElementHeaderInfo();
        info.setVersion(version);
        info.setParent(parent);
        info.setDatatype(datatype);
        info.setLocation(location);
        info.setCardinality(cardinality.clone());
        info.setType(type);
        return info;
    }
}
