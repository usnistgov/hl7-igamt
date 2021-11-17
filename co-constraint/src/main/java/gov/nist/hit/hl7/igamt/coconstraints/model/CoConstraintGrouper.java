package gov.nist.hit.hl7.igamt.coconstraints.model;

public class CoConstraintGrouper extends WithDelta {

    private DeltaField<String> pathIdDelta;
    private String pathId;

    public String getPathId() {
        return pathId;
    }

    public void setPathId(String pathId) {
        this.pathId = pathId;
    }

    public DeltaField<String> getPathIdDelta() {
        return pathIdDelta;
    }

    public void setPathIdDelta(DeltaField<String> pathIdDelta) {
        this.pathIdDelta = pathIdDelta;
    }
}
