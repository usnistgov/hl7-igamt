package gov.nist.hit.hl7.igamt.coconstraints.model;

public class AnyCell extends CoConstraintCell {
    protected ColumnType cellType;
    protected CoConstraintCell cellValue;

    public AnyCell() {
		super();
		this.setType(ColumnType.ANY);
	}

    public ColumnType getCellType() {
        return cellType;
    }

    public void setCellType(ColumnType cellType) {
        this.cellType = cellType;
    }

    public CoConstraintCell getCellValue() {
        return cellValue;
    }

    public void setCellValue(CoConstraintCell cellValue) {
        this.cellValue = cellValue;
    }

    public AnyCell clone() throws CloneNotSupportedException {
        AnyCell clone = new AnyCell();
        clone.setCellType(this.cellType);
        clone.setCellValue(this.cellValue.cloneCell());
        clone.setType(this.getType());
        return clone;
    }
}
