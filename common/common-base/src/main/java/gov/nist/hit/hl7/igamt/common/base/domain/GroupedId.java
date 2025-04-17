package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.List;
import java.util.Map;

public class GroupedId {

    List<String> groupNames;

    boolean custom;
    public List<String> getGroupNames() {
        return groupNames;
    }

    public void setGroupNames(List<String> groupNames) {
        this.groupNames = groupNames;
    }

    public GroupedId(Map<String, List<String>> groupedData) {
        this.groupedData = groupedData;
    }
    public GroupedId() {
    }

    private Map<String, List<String>> groupedData;

    public Map<String, List<String>> getGroupedData() {
        return groupedData;
    }

    public void setGroupedData(Map<String, List<String>> groupedData) {
        this.groupedData = groupedData;
    }

    public boolean isCustom() {
        return custom;
    }

    public void setCustom(boolean custom) {
        this.custom = custom;
    }
}
