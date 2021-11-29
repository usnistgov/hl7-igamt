package gov.nist.hit.hl7.igamt.ig.model;

public class PathId {
    String head;
    String tail;
    String value;

    public PathId(String value) {
        this.value = value;
        int separatorIndex = this.value.indexOf('-');
        if(separatorIndex != -1) {
            this.head = this.value.substring(0, separatorIndex);
            this.tail = this.value.substring(separatorIndex + 1);
        } else {
            this.head = this.value;
        }
    }

    public String getHead() {
        return head;
    }

    public void setHead(String head) {
        this.head = head;
    }

    public String getTail() {
        return tail;
    }

    public void setTail(String tail) {
        this.tail = tail;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
