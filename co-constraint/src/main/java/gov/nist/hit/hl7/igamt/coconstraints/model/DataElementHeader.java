package gov.nist.hit.hl7.igamt.coconstraints.model;

public class DataElementHeader extends CoConstraintHeader {
    protected String name;
    protected boolean cardinality;
    protected ColumnType columnType;
    protected DataElementHeaderInfo elementInfo;

    public DataElementHeader() {
        this.type = HeaderType.DATAELEMENT;
    }

    @Deprecated
    public String getName() {
        return name;
    }
    @Deprecated
    public void setName(String name) {
        this.name = name;
    }
    @Deprecated
    public boolean isCardinality() {
        return cardinality;
    }
    @Deprecated
    public void setCardinality(boolean cardinality) {
        this.cardinality = cardinality;
    }

    public ColumnType getColumnType() {
        return columnType;
    }

    public void setColumnType(ColumnType columnType) {
        this.columnType = columnType;
    }

    @Deprecated
    public DataElementHeaderInfo getElementInfo() {
        return elementInfo;
    }
    @Deprecated
    public void setElementInfo(DataElementHeaderInfo elementInfo) {
        this.elementInfo = elementInfo;
    }

    public DataElementHeader clone() {
        DataElementHeader clone = new DataElementHeader();
        clone.setCardinality(cardinality);
        clone.setElementInfo(elementInfo.clone());
        clone.setName(name);
        clone.setType(type);
        clone.setColumnType(columnType);
        return clone;
    }
}
