package gov.nist.hit.hl7.igamt.examples.dto.parser;

import java.util.ArrayList;
import java.util.List;

public class MessageElement {
    MessageElementType type;
    String name;
    String positionalPath;
    String profilePath;
    String hl7Path;
    Point start;
    Point end;
    List<MessageElement> children;

    public MessageElementType getType() {
        return type;
    }

    public void setType(MessageElementType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPositionalPath() {
        return positionalPath;
    }

    public void setPositionalPath(String positionalPath) {
        this.positionalPath = positionalPath;
    }

    public String getProfilePath() {
        return profilePath;
    }

    public void setProfilePath(String profilePath) {
        this.profilePath = profilePath;
    }

    public String getHl7Path() {
        return hl7Path;
    }

    public void setHl7Path(String hl7Path) {
        this.hl7Path = hl7Path;
    }

    public List<MessageElement> getChildren() {
        if(this.children == null) {
            this.children = new ArrayList<>();
        }
        return children;
    }

    public void setChildren(List<MessageElement> children) {
        this.children = children;
    }

    public Point getStart() {
        return start;
    }

    public void setStart(Point start) {
        this.start = start;
    }

    public Point getEnd() {
        return end;
    }

    public void setEnd(Point end) {
        this.end = end;
    }
}
