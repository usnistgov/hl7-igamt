package gov.nist.hit.hl7.igamt.common.base.model;

public class EntityLocation {
    private int position;
    private EntityLocationType type;
    private String id;
    private String label;

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public EntityLocationType getType() {
        return type;
    }

    public void setType(EntityLocationType type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
