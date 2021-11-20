package gov.nist.hit.hl7.igamt.coconstraints.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "tableType", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CoConstraintGroup.class, name = "GROUP"),
        @JsonSubTypes.Type(value = CoConstraintTable.class, name = "TABLE"),
})
public abstract class CoConstraintCollection extends WithDelta {
    protected String id;
    protected CollectionType tableType;
//    protected String baseSegment;
    protected CoConstraintHeaders headers;
    protected List<CoConstraint> coConstraints;

    public CoConstraintCollection() {
        this.headers = new CoConstraintHeaders();
        this.coConstraints = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CollectionType getTableType() {
        return tableType;
    }

    public void setTableType(CollectionType tableType) {
        this.tableType = tableType;
    }

//    public String getBaseSegment() {
//        return baseSegment;
//    }
//
//    public void setBaseSegment(String baseSegment) {
//        this.baseSegment = baseSegment;
//    }

    public CoConstraintHeaders getHeaders() {
        return headers;
    }

    public void setHeaders(CoConstraintHeaders headers) {
        this.headers = headers;
    }

    public List<CoConstraint> getCoConstraints() {
        return coConstraints;
    }

    public void setCoConstraints(List<CoConstraint> coConstraints) {
        this.coConstraints = coConstraints;
    }

}
