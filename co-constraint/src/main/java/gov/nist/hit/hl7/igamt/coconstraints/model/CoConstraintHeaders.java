package gov.nist.hit.hl7.igamt.coconstraints.model;


import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CoConstraintHeaders {
    private List<CoConstraintHeader> selectors;
    private List<CoConstraintHeader> constraints;
    private List<CoConstraintHeader> narratives;
    private CoConstraintGrouper grouper;

    public CoConstraintHeaders() {
        this.selectors = new ArrayList<>();
        this.constraints = new ArrayList<>();
        this.narratives = new ArrayList<>();
    }

    public List<CoConstraintHeader> getSelectors() {
        return selectors;
    }

    public void setSelectors(List<CoConstraintHeader> selectors) {
        this.selectors = selectors;
    }

    public List<CoConstraintHeader> getConstraints() {
        return constraints;
    }

    public void setConstraints(List<CoConstraintHeader> constraints) {
        this.constraints = constraints;
    }

    public List<CoConstraintHeader> getNarratives() {
        return narratives;
    }

    public void setNarratives(List<CoConstraintHeader> narratives) {
        this.narratives = narratives;
    }

    public CoConstraintHeaders clone() {
        CoConstraintHeaders clone = new CoConstraintHeaders();

        clone.narratives = narratives.stream().map(header -> {
            try {
                return header.cloneHeader();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());

        clone.constraints = constraints.stream().map(header -> {
            try {
                return header.cloneHeader();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());

        clone.selectors = selectors.stream().map(header -> {
            try {
                return header.cloneHeader();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());

        return clone;
    }

    public CoConstraintGrouper getGrouper() {
        return grouper;
    }

    public void setGrouper(CoConstraintGrouper grouper) {
        this.grouper = grouper;
    }
}
