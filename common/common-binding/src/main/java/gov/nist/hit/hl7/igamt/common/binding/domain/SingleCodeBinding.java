package gov.nist.hit.hl7.igamt.common.binding.domain;

import java.io.Serializable;
import java.util.List;

public class SingleCodeBinding implements Serializable {

    private String code;
    private String codeSystem;
    private List<Integer> locations;

    public SingleCodeBinding() {
        super();
    }

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
}