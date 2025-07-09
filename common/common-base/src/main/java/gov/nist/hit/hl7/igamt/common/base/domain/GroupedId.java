package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.List;
import java.util.Map;

public class GroupedId {

    List<String> groupNames;
    private Map<ValueSetType, String> defaultMap = new java.util.HashMap<ValueSetType, String>();

    boolean custom;
    public List<String> getGroupNames() {
        return groupNames;
    }

    public Map<ValueSetType, String> getDefaultMap() {
        return defaultMap;
    }

    public void setDefaultMap(Map<ValueSetType, String> defaultMap) {
        this.defaultMap = defaultMap;
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


    public void assignGroup(String id, ValueSetType type) {
        String groupName = defaultMap.get(type);
        if(groupName != null ){
            groupedData.computeIfAbsent(groupName, k -> new java.util.ArrayList<>()).add(id);
        }
    }

    public void findAndRemove(String id) {
        if (groupedData == null) {
            return;
        }
        for (Map.Entry<String, List<String>> entry : groupedData.entrySet()) {
            List<String> group = entry.getValue();
            if (group.remove(id)) {
                break;
            }
        }
    }

}
