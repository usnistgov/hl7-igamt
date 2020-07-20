package gov.nist.hit.hl7.igamt.coconstraints.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = DataElementHeader.class, name = "DATAELEMENT"),
        @JsonSubTypes.Type(value = NarrativeHeader.class, name = "NARRATIVE"),
})
public abstract class CoConstraintHeader {
    protected HeaderType type;
    protected String key;

    public HeaderType getType() {
        return type;
    }

    public void setType(HeaderType type) {
        this.type = type;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public CoConstraintHeader cloneHeader() throws CloneNotSupportedException {
      CoConstraintHeader clone =(CoConstraintHeader) this.clone();
      clone.setKey(key);
      clone.setType(type);
      return clone;
    }
}
