package gov.nist.hit.hl7.igamt.examples.dto.parser;

import java.util.List;

public class MessageModel {
    private List<MessageElement> children;

    public List<MessageElement> getChildren() {
        return children;
    }

    public void setChildren(List<MessageElement> children) {
        this.children = children;
    }
}
