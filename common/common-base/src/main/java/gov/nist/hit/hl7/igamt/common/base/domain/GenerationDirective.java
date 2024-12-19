package gov.nist.hit.hl7.igamt.common.base.domain;

public class GenerationDirective {
    String profileComponentId;
    String contextId;
    Type contextType;

    public GenerationDirective() {
    }

    public GenerationDirective(String contextId, Type contextType, String profileComponentId) {
        this.contextId = contextId;
        this.contextType = contextType;
        this.profileComponentId = profileComponentId;
    }

    public String getContextId() {
        return contextId;
    }

    public void setContextId(String contextId) {
        this.contextId = contextId;
    }

    public Type getContextType() {
        return contextType;
    }

    public void setContextType(Type contextType) {
        this.contextType = contextType;
    }

    public String getProfileComponentId() {
        return profileComponentId;
    }

    public void setProfileComponentId(String profileComponentId) {
        this.profileComponentId = profileComponentId;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }
        if(o == null || getClass() != o.getClass()) {
            return false;
        }

        GenerationDirective that = (GenerationDirective) o;
        return getProfileComponentId().equals(that.getProfileComponentId()) && getContextId().equals(that.getContextId()) && getContextType() == that.getContextType();
    }

    @Override
    public int hashCode() {
        int result = getProfileComponentId().hashCode();
        result = 31 * result + getContextId().hashCode();
        result = 31 * result + getContextType().hashCode();
        return result;
    }
}
