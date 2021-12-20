package gov.nist.hit.hl7.igamt.coconstraints.serialization;

import gov.nist.hit.hl7.igamt.coconstraints.model.DataElementHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.DataElementHeaderInfo;

public class SerializableDataElementHeader extends DataElementHeader {
    protected String name;
    protected boolean cardinality;
    protected DataElementHeaderInfo elementInfo;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isCardinality() {
        return cardinality;
    }

    public void setCardinality(boolean cardinality) {
        this.cardinality = cardinality;
    }

    public DataElementHeaderInfo getElementInfo() {
        return elementInfo;
    }

    public void setElementInfo(DataElementHeaderInfo elementInfo) {
        this.elementInfo = elementInfo;
    }
}
