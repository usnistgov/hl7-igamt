package gov.nist.hit.hl7.igamt.coconstraints.model;

import java.util.ArrayList;
import java.util.List;

public class BindingLocationItem {
    private String label;
    private List<Integer> value;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Integer> getValue() {
        return value;
    }

    public void setValue(List<Integer> value) {
        this.value = value;
    }

    public BindingLocationItem clone() {
        BindingLocationItem info = new BindingLocationItem();
        info.setLabel(label);
        info.setValue(new ArrayList<>(value));
        return info;
    }
}
