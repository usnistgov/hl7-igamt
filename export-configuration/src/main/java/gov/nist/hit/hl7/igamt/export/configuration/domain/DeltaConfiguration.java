package gov.nist.hit.hl7.igamt.export.configuration.domain;

import gov.nist.diff.domain.DeltaAction;

import java.util.HashMap;

public class DeltaConfiguration {

    private DeltaExportConfigMode mode;
    private HashMap<DeltaAction,String> colors;
    
    public DeltaConfiguration(){
        super();
    }

    public DeltaConfiguration(DeltaExportConfigMode mode, HashMap<DeltaAction,String> colors){
        this.mode = mode;
        this.colors = colors;
    }

    public DeltaExportConfigMode getMode() {
        return mode;
    }

    public void setMode(DeltaExportConfigMode mode) {
        this.mode = mode;
    }

    public HashMap<DeltaAction, String> getColors() {
        return colors;
    }

    public void setColors(HashMap<DeltaAction, String> colors) {
        this.colors = colors;
    }
}
