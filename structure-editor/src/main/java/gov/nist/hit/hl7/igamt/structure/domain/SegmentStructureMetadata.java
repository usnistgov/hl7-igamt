package gov.nist.hit.hl7.igamt.structure.domain;

public class SegmentStructureMetadata {
    String name;
    String identifier;
    String description;
    String hl7Version;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHl7Version() {
        return hl7Version;
    }

    public void setHl7Version(String hl7Version) {
        this.hl7Version = hl7Version;
    }
}
