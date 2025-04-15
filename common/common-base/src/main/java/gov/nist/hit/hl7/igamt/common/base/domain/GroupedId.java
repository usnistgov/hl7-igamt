package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.List;
import java.util.Map;

public class GroupedId {
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
}
