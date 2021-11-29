package gov.nist.hit.hl7.igamt.export.domain;

public class CoConstraintExcelExportFormData {
    private String json;
    private String contextId;
    private String segmentRef;
    private String conformanceProfileId;

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public String getContextId() {
        return contextId;
    }

    public void setContextId(String contextId) {
        this.contextId = contextId;
    }

    public String getSegmentRef() {
        return segmentRef;
    }

    public void setSegmentRef(String segmentRef) {
        this.segmentRef = segmentRef;
    }

    public String getConformanceProfileId() {
        return conformanceProfileId;
    }

    public void setConformanceProfileId(String conformanceProfileId) {
        this.conformanceProfileId = conformanceProfileId;
    }
}
