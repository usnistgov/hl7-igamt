package gov.nist.diff.domain;

import java.lang.reflect.Field;
import java.util.List;

public class DeltaKey {
    private Field field;
    private List<DeltaKey> children;

    public DeltaKey(Field field, List<DeltaKey> children) {
        super();
        this.field = field;
        this.children = children;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public List<DeltaKey> getChildren() {
        return children;
    }

    public void setChildren(List<DeltaKey> children) {
        this.children = children;
    }
}
