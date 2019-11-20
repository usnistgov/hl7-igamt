package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "coconstraints")
public class CoConstraintGroup extends Resource {
    protected String baseSegment;
    protected CoConstraintHeaders headers;
    protected List<CoConstraint> coConstraints;

    public CoConstraintGroup() {
        this.headers = new CoConstraintHeaders();
        this.coConstraints = new ArrayList<>();
    }

    @Override
    public String getLabel() {
        return this.getName();
    }

    public CoConstraintGroup clone() {
        CoConstraintGroup clone = new CoConstraintGroup();
        super.complete(clone);
        clone.setBaseSegment(baseSegment);
        clone.setHeaders(headers.clone());
        clone.setCoConstraints(new ArrayList<>(this.coConstraints));
        return clone;
    }

    public String getBaseSegment() {
        return baseSegment;
    }

    public void setBaseSegment(String baseSegment) {
        this.baseSegment = baseSegment;
    }

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
