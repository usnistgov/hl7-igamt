package gov.nist.hit.hl7.igamt.coconstraints.model;

public class DataElementHeader extends CoConstraintHeader {
    protected ColumnType columnType;

    public DataElementHeader() {
        this.type = HeaderType.DATAELEMENT;
    }

    public ColumnType getColumnType() {
        return columnType;
    }

    public void setColumnType(ColumnType columnType) {
        this.columnType = columnType;
    }

    public DataElementHeader clone() {
        DataElementHeader clone = new DataElementHeader();
        clone.setType(type);
        clone.setColumnType(columnType);
        return clone;
    }
}
