package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import nu.xom.Element;

public interface ConformanceProfileSerializationService {
	
	public Element serializeConformanceProfile(ConformanceProfileDataModel conformanceProfileDataModel, IgDataModel igDataModel, int level, ExportConfiguration exportConfiguration ) throws ResourceSerializationException;

}
