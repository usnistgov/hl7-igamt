package gov.nist.hit.hl7.igamt.delta.service;

import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;

public interface CompareFn<T> {
    void compare(StructureDelta structureDelta, T a, T b);
}
