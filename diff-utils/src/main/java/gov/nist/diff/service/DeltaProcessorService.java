package gov.nist.diff.service;

import gov.nist.diff.domain.DeltaMode;
import gov.nist.diff.domain.DeltaObject;
import java.util.List;

public interface DeltaProcessorService {
    public <T> DeltaObject<T> delta(T a, T b, DeltaMode mode);
}
