package gov.nist.hit.hl7.igamt.common.base.domain;

public class GenerationDirective {
    String id;
    int position;
    Type type;

    public GenerationDirective(String id, int position, Type type) {
        this.id = id;
        this.position = position;
        this.type = type;
    }

    public GenerationDirective() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
