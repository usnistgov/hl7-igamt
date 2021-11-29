package gov.nist.hit.hl7.igamt.coconstraints.model;

public class VariesCell extends CoConstraintCell {
    protected ColumnType cellType;
    protected CoConstraintCell cellValue;
    
    public VariesCell() {
		super();
		this.setType(ColumnType.VARIES);
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

    public VariesCell clone() throws CloneNotSupportedException {
        VariesCell clone = new VariesCell();
        clone.setCellType(this.cellType);
        clone.setCellValue(this.cellValue.cloneCell());
        clone.setType(this.getType());
        return clone;
    }
}
