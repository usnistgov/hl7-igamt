package gov.nist.hit.hl7.igamt.examples.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Validation result for a single snippet after a message content change.
 */
public class SnippetValidationInfo {
    private String snippetId;
    private String snippetName;
    private int totalReferences;
    private int resolvedReferences;
    private List<String> brokenPaths;

    public SnippetValidationInfo() {
        this.brokenPaths = new ArrayList<>();
    }

    public SnippetValidationInfo(String snippetId, String snippetName) {
        this();
        this.snippetId = snippetId;
        this.snippetName = snippetName;
    }

    public String getSnippetId() {
        return snippetId;
    }

    public void setSnippetId(String snippetId) {
        this.snippetId = snippetId;
    }

    public String getSnippetName() {
        return snippetName;
    }

    public void setSnippetName(String snippetName) {
        this.snippetName = snippetName;
    }

    public int getTotalReferences() {
        return totalReferences;
    }

    public void setTotalReferences(int totalReferences) {
        this.totalReferences = totalReferences;
    }

    public int getResolvedReferences() {
        return resolvedReferences;
    }

    public void setResolvedReferences(int resolvedReferences) {
        this.resolvedReferences = resolvedReferences;
    }

    public List<String> getBrokenPaths() {
        return brokenPaths;
    }

    public void setBrokenPaths(List<String> brokenPaths) {
        this.brokenPaths = brokenPaths;
    }

    public boolean isFullyResolved() {
        return brokenPaths == null || brokenPaths.isEmpty();
    }
}

