package gov.nist.hit.hl7.igamt.coconstraints.serialization;

import gov.nist.hit.hl7.igamt.coconstraints.model.ColumnType;
import gov.nist.hit.hl7.igamt.coconstraints.model.DataElementHeaderInfo;
import gov.nist.hit.hl7.igamt.coconstraints.model.HeaderType;

public class SerializableDataElementHeader {
    protected HeaderType type;
    protected String key;
    protected String name;
    protected boolean cardinality;
    protected ColumnType columnType;
    protected DataElementHeaderInfo elementInfo;

    public HeaderType getType() {
        return type;
    }

    public void setType(HeaderType type) {
        this.type = type;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

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

    public ColumnType getColumnType() {
        return columnType;
    }

    public void setColumnType(ColumnType columnType) {
        this.columnType = columnType;
    }

    public DataElementHeaderInfo getElementInfo() {
        return elementInfo;
    }

    public void setElementInfo(DataElementHeaderInfo elementInfo) {
        this.elementInfo = elementInfo;
    }
}
