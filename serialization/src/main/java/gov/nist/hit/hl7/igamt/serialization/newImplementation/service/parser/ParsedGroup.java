package gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser;

import java.util.ArrayList;
import java.util.List;

public class ParsedGroup {
    public String usage;
    public int minCardinality;
    public String maxCardinality;
    public String name;
    public List<ParsedCoConstraint> parsedCoConstraints = new ArrayList<>();

    public String getUsage() {
        return usage;
    }

    public void setUsage(String usage) {
        this.usage = usage;
    }

    public int getMinCardinality() {
        return minCardinality;
    }

    public void setMinCardinality(int minCardinality) {
        this.minCardinality = minCardinality;
    }

    public String getMaxCardinality() {
        return maxCardinality;
    }

    public void setMaxCardinality(String maxCardinality) {
        this.maxCardinality = maxCardinality;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ParsedCoConstraint> getParsedCoConstraints() {
        return parsedCoConstraints;
    }

    public void setParsedCoConstraints(List<ParsedCoConstraint> parsedCoConstraints) {
        this.parsedCoConstraints = parsedCoConstraints;
    }

    @Override
    public String toString() {
        return "ParsedGroup{" +
                "usage='" + usage + '\'' +
                ", minCardinality=" + minCardinality +
                ", maxCardinality='" + maxCardinality + '\'' +
                ", name='" + name + '\'' +
                ", parsedCoConstraints=" + parsedCoConstraints +
                '}';
    }
}
