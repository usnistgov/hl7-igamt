package gov.nist.hit.hl7.igamt.coconstraints.model;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "coconstraints")
public class CoConstraintGroup extends Resource {
    protected String baseSegment;
    @Deprecated
    protected String documentId;
    protected DeltaField<String> nameDelta;
    protected CoConstraintHeaders headers;
    protected List<CoConstraint> coConstraints;
    protected DeltaAction delta;

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

    public DeltaField<String> getNameDelta() {
        return nameDelta;
    }

    public void setNameDelta(DeltaField<String> nameDelta) {
        this.nameDelta = nameDelta;
    }

    public DeltaAction getDelta() {
        return delta;
    }

    public void setDelta(DeltaAction delta) {
        this.delta = delta;
    }

    @Deprecated
    public String getDocumentId() {
        return documentId;
    }

    @Deprecated
    public void setDocumentId(String documentId) {
        this.documentId = documentId;
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
