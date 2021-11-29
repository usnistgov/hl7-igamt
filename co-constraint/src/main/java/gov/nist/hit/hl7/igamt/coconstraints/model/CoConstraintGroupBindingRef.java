package gov.nist.hit.hl7.igamt.coconstraints.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

import java.util.Set;

@JsonTypeName("REF")
public class CoConstraintGroupBindingRef extends CoConstraintGroupBinding {
    protected String refId;
    protected Set<String> excludeIfColumns;
    protected Set<String> excludeThenColumns;
    protected Set<String> excludeNarrativeColumns;

    public String getRefId() {
        return refId;
    }

    public void setRefId(String refId) {
        this.refId = refId;
    }

    public Set<String> getExcludeIfColumns() {
        return excludeIfColumns;
    }

    public void setExcludeIfColumns(Set<String> excludeIfColumns) {
        this.excludeIfColumns = excludeIfColumns;
    }

    public Set<String> getExcludeThenColumns() {
        return excludeThenColumns;
    }

    public void setExcludeThenColumns(Set<String> excludeThenColumns) {
        this.excludeThenColumns = excludeThenColumns;
    }

    public Set<String> getExcludeNarrativeColumns() {
        return excludeNarrativeColumns;
    }

    public void setExcludeNarrativeColumns(Set<String> excludeNarrativeColumns) {
        this.excludeNarrativeColumns = excludeNarrativeColumns;
    }

    public CoConstraintGroupBindingRef clone() {
        CoConstraintGroupBindingRef clone = new CoConstraintGroupBindingRef();
        clone.setExcludeIfColumns(excludeIfColumns);
        clone.setExcludeThenColumns(excludeThenColumns);
        clone.setExcludeNarrativeColumns(excludeNarrativeColumns);
        clone.setRefId(refId);
        clone.setId(id);
        clone.setRequirement(requirement.clone());
        clone.setType(type);
        return clone;
    }
}
