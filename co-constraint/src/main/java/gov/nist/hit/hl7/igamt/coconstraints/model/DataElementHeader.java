package gov.nist.hit.hl7.igamt.coconstraints.model;

public class DataElementHeader extends CoConstraintHeader {
    protected String name;
    protected boolean cardinality;
    protected ColumnType columnType;
    protected DataElementHeaderInfo elementInfo;

    public DataElementHeader() {
        this.type = HeaderType.DATAELEMENT;
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
