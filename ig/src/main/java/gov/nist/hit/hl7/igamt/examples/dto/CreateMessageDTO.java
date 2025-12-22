package gov.nist.hit.hl7.igamt.examples.dto;

public class CreateMessageDTO {
    private String name;
    private String profileId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfileId() {
        return profileId;
    }

    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }
}
