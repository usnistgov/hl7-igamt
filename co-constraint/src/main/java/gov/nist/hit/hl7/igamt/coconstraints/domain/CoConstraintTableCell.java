package gov.nist.hit.hl7.igamt.coconstraints.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = CodeCell.class, name = "Code"),
    @JsonSubTypes.Type(value = DataCell.class, name = "Value"),
    @JsonSubTypes.Type(value = VSCell.class, name = "ValueSet"),
    @JsonSubTypes.Type(value = IgnoreCell.class, name = "Ignore"),
    @JsonSubTypes.Type(value = TextAreaCell.class, name = "textArea")
})
public abstract class CoConstraintTableCell {
	
	public CellType type;

	public CellType getType() {
		return type;
	}

	public void setType(CellType name) {
		this.type = name;
	}
	
	public CoConstraintTableCell cloneCell() throws CloneNotSupportedException {
		return (CoConstraintTableCell) this.clone();
	}
}
