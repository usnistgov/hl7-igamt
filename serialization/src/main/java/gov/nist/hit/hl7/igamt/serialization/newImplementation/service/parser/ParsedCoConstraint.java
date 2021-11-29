package gov.nist.hit.hl7.igamt.serialization.newImplementation.service.parser;

import java.util.HashMap;
import java.util.Map;

public class ParsedCoConstraint {
    public String usage;
    public int minCardinality;
    public String maxCardinality;
    public Map<Integer, String> ifs = new HashMap<>();
    public Map<Integer, String> then = new HashMap<>();
    public Map<Integer, String> narratives = new HashMap<>();

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

    public Map<Integer, String> getIfs() {
        return ifs;
    }

    public void setIfs(Map<Integer, String> ifs) {
        this.ifs = ifs;
    }

    public Map<Integer, String> getThen() {
        return then;
    }

    public void setThen(Map<Integer, String> then) {
        this.then = then;
    }

    public Map<Integer, String> getNarratives() {
        return narratives;
    }

    public void setNarratives(Map<Integer, String> narratives) {
        this.narratives = narratives;
    }

    @Override
    public String toString() {
        return "ParsedCoConstraint{" +
                "usage='" + usage + '\'' +
                ", minCardinality=" + minCardinality +
                ", maxCardinality='" + maxCardinality + '\'' +
                ", ifs=" + ifs +
                ", then=" + then +
                ", narratives=" + narratives +
                '}';
    }
}
