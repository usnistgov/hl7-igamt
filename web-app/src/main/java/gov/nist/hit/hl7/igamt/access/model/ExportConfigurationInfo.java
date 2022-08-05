package gov.nist.hit.hl7.igamt.access.model;

public class ExportConfigurationInfo {
    private String username;
    private boolean original;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isOriginal() {
        return original;
    }

    public void setOriginal(boolean original) {
        this.original = original;
    }
}
