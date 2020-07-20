package gov.nist.hit.hl7.igamt.coconstraints.model;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Document(collection = "coconstraints")
public class CoConstraintTable extends CoConstraintCollection {
    protected List<CoConstraintGroupBinding> groups;

    public List<CoConstraintGroupBinding> getGroups() {
        return groups;
    }

    public void setGroups(List<CoConstraintGroupBinding> groups) {
        this.groups = groups;
    }

    public CoConstraintTable clone() {
        CoConstraintTable clone = new CoConstraintTable();
        clone.setBaseSegment(baseSegment);
        clone.setHeaders(headers.clone());

        clone.setCoConstraints(this.coConstraints.stream().map(cc -> {
            try {
                return cc.clone();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList()));

        clone.groups = groups.stream().map(group -> {
            try {
                return group.cloneGroup();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
        return clone;
    }
}
