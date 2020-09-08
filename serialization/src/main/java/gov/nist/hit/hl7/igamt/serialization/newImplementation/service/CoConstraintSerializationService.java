package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ConformanceProfileExportConfiguration;
import org.springframework.stereotype.Service;


import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import nu.xom.Element;

import java.util.List;

@Service
public interface CoConstraintSerializationService {
	public Element SerializeCoConstraintVerbose(CoConstraintTable coConstraintsTable);
	public Element SerializeCoConstraintCompact(CoConstraintTable coConstraintsTable);
	public Element SerializeCoConstraintCompactDelta(CoConstraintTable coConstraintsTable, List<CoConstraintBinding> coConstraintDeltaChanged, ConformanceProfileExportConfiguration conformanceProfileExportConfiguration);

}
