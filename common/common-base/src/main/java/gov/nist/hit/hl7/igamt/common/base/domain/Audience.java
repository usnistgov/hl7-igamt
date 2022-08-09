package gov.nist.hit.hl7.igamt.common.base.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = PrivateAudience.class, name = "PRIVATE"),
        @JsonSubTypes.Type(value = PublicAudience.class, name = "PUBLIC"),
        @JsonSubTypes.Type(value = WorkspaceAudience.class, name = "WORKSPACE")
})
public abstract class Audience {
    private AudienceType type;

    public Audience(AudienceType type) {
        this.type = type;
    }

    public AudienceType getType() {
        return type;
    }

    public void setType(AudienceType type) {
        this.type = type;
    }
}
