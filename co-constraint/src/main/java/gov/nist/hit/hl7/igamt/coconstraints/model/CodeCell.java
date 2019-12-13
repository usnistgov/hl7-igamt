package gov.nist.hit.hl7.igamt.coconstraints.model;

import java.util.ArrayList;
import java.util.List;

public class CodeCell extends CoConstraintCell {
    protected String code;
    protected String codeSystem;
    protected List<Integer> locations;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeSystem() {
        return codeSystem;
    }

    public void setCodeSystem(String codeSystem) {
        this.codeSystem = codeSystem;
    }

    public List<Integer> getLocations() {
        return locations;
    }

    public void setLocations(List<Integer> locations) {
        this.locations = locations;
    }

    public CodeCell clone() {
        CodeCell clone = new CodeCell();
        clone.setCode(code);
        clone.setCodeSystem(codeSystem);
        clone.setLocations(new ArrayList<>(locations));
        return clone;
    }
}
