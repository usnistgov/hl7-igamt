package gov.nist.hit.hl7.igamt.coconstraints.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CodeCell.class, name = "CODE"),
        @JsonSubTypes.Type(value = ValueSetCell.class, name = "VALUESET"),
        @JsonSubTypes.Type(value = DatatypeCell.class, name = "DATATYPE"),
        @JsonSubTypes.Type(value = VariesCell.class, name = "VARIES"),
        @JsonSubTypes.Type(value = ValueCell.class, name = "VALUE"),
        @JsonSubTypes.Type(value = AnyCell.class, name = "ANY")
})
public abstract class CoConstraintCell {
    protected ColumnType type;
    protected String cardinalityMax;

    public ColumnType getType() {
        return type;
    }

    public void setType(ColumnType type) {
        this.type = type;
    }

    public String getCardinalityMax() {
        return cardinalityMax;
    }

    public void setCardinalityMax(String cardinalityMax) {
        this.cardinalityMax = cardinalityMax;
    }

    public CoConstraintCell cloneCell() throws CloneNotSupportedException {
        CoConstraintCell cell = (CoConstraintCell) this.clone();
        cell.setCardinalityMax(cardinalityMax);
        return cell;
    }
}
