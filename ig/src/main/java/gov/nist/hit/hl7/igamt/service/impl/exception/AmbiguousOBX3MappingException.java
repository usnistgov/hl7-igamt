package gov.nist.hit.hl7.igamt.service.impl.exception;

import gov.nist.hit.hl7.igamt.ig.model.CoConstraintMappingLocation;
import gov.nist.hit.hl7.igamt.ig.model.CoConstraintOBX3MappingValue;

import java.util.Map;
import java.util.Set;

public class AmbiguousOBX3MappingException extends Exception {
    private final Map<CoConstraintMappingLocation, Set<CoConstraintOBX3MappingValue>> mappings;
    public AmbiguousOBX3MappingException(Map<CoConstraintMappingLocation, Set<CoConstraintOBX3MappingValue>> mappings) {
        this.mappings = mappings;
    }

    public Map<CoConstraintMappingLocation, Set<CoConstraintOBX3MappingValue>> getMappings() {
        return mappings;
    }
}
