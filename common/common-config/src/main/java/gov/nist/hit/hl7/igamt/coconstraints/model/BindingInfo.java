package gov.nist.hit.hl7.igamt.coconstraints.model;

import java.util.ArrayList;
import java.util.List;

public class BindingInfo {
    private List<BindingLocationItem> allowedBindingLocations;
    private boolean singleCodeAllowed;
    private boolean multiple;
    private boolean coded;
    private boolean allowSingleCode;
    private boolean allowValueSets;

    public List<BindingLocationItem> getAllowedBindingLocations() {
        return allowedBindingLocations;
    }

    public void setAllowedBindingLocations(List<BindingLocationItem> allowedBindingLocations) {
        this.allowedBindingLocations = allowedBindingLocations;
    }

    public boolean isSingleCodeAllowed() {
        return singleCodeAllowed;
    }

    public void setSingleCodeAllowed(boolean singleCodeAllowed) {
        this.singleCodeAllowed = singleCodeAllowed;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }

    public boolean isCoded() {
        return coded;
    }

    public void setCoded(boolean coded) {
        this.coded = coded;
    }

    public boolean isAllowSingleCode() {
        return allowSingleCode;
    }

    public void setAllowSingleCode(boolean allowSingleCode) {
        this.allowSingleCode = allowSingleCode;
    }

    public boolean isAllowValueSets() {
        return allowValueSets;
    }

    public void setAllowValueSets(boolean allowValueSets) {
        this.allowValueSets = allowValueSets;
    }

    public BindingInfo clone() {
        BindingInfo info = new BindingInfo();
        info.setAllowedBindingLocations(new ArrayList<>(allowedBindingLocations));
        info.setSingleCodeAllowed(singleCodeAllowed);
        info.setMultiple(multiple);
        info.setCoded(coded);
        info.setAllowSingleCode(allowSingleCode);
        info.setAllowValueSets(allowValueSets);
        return info;
    }
}
