package gov.nist.hit.hl7.igamt.coconstraints.serialization;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintHeader;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintHeaders;

import java.util.List;

public class SerializableHeaders extends CoConstraintHeaders {
    private List<SerializableDataElementHeader> selectors;
    private List<SerializableDataElementHeader> constraints;
    private List<CoConstraintHeader> narratives;
    private SerializableGrouper grouper;

    public List<SerializableDataElementHeader> getSerializableSelectors() {
        return selectors;
    }

    public void setSerializableSelectors(List<SerializableDataElementHeader> selectors) {
        this.selectors = selectors;
    }

    public List<SerializableDataElementHeader> getSerializableConstraints() {
        return constraints;
    }

    public void setSerializableConstraints(List<SerializableDataElementHeader> constraints) {
        this.constraints = constraints;
    }

    @Override
    public List<CoConstraintHeader> getNarratives() {
        return narratives;
    }

    @Override
    public void setNarratives(List<CoConstraintHeader> narratives) {
        this.narratives = narratives;
    }

    @Override
    public SerializableGrouper getGrouper() {
        return grouper;
    }

    public void setGrouper(SerializableGrouper grouper) {
        this.grouper = grouper;
    }
}
