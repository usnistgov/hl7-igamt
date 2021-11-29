package gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ParsedTable {
    private Map<Integer, String> ifHeaders = new HashMap<>();
    private Map<Integer, String> thenHeaders = new HashMap<>();
    private Map<Integer, String> narrativeHeaders = new HashMap<>();
    private int grouperPosition;
    private String grouperValue;
    private boolean hasGrouper;
    private List<ParsedCoConstraint> parsedCoConstraints = new ArrayList<>();
    private List<ParsedGroup> parsedGroups = new ArrayList<>();

    public List<ParsedCoConstraint> getParsedCoConstraints() {
        return parsedCoConstraints;
    }

    public void setParsedCoConstraints(List<ParsedCoConstraint> parsedCoConstraints) {
        this.parsedCoConstraints = parsedCoConstraints;
    }

    public List<ParsedGroup> getParsedGroups() {
        return parsedGroups;
    }

    public void setParsedGroups(List<ParsedGroup> parsedGroups) {
        this.parsedGroups = parsedGroups;
    }

    public Map<Integer, String> getIfHeaders() {
        return ifHeaders;
    }

    public void setIfHeaders(Map<Integer, String> ifHeaders) {
        this.ifHeaders = ifHeaders;
    }

    public Map<Integer, String> getThenHeaders() {
        return thenHeaders;
    }

    public void setThenHeaders(Map<Integer, String> thenHeaders) {
        this.thenHeaders = thenHeaders;
    }

    public Map<Integer, String> getNarrativeHeaders() {
        return narrativeHeaders;
    }

    public void setNarrativeHeaders(Map<Integer, String> narrativeHeaders) {
        this.narrativeHeaders = narrativeHeaders;
    }

    public int getGrouperPosition() {
		return grouperPosition;
	}

	public void setGrouperPosition(int grouperPosition) {
		this.grouperPosition = grouperPosition;
	}

	public String getGrouperValue() {
		return grouperValue;
	}

	public void setGrouperValue(String grouperValue) {
		this.grouperValue = grouperValue;
	}

	public boolean isHasGrouper() {
		return hasGrouper;
	}

	public void setHasGrouper(boolean hasGrouper) {
		this.hasGrouper = hasGrouper;
	}

	@Override
    public String toString() {
        return "ParsedTable{" +
                "ifHeaders=" + ifHeaders +
                ", thenHeaders=" + thenHeaders +
                ", narrativeHeaders=" + narrativeHeaders +
                ", parsedCoConstraints=" + parsedCoConstraints +
                ", parsedGroups=" + parsedGroups +
                '}';
    }
}
