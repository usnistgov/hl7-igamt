package gov.nist.hit.hl7.igamt.examples.dto;

public class SaveMessageDTO {
    private String message;
    private String narrative;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNarrative() {
        return narrative;
    }

    public void setNarrative(String narrative) {
        this.narrative = narrative;
    }
}
