package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import nu.xom.Element;

public interface SegmentSerializationService {

	public Element serializeSegment(SegmentDataModel segmentDataModel, int level, ExportConfiguration exportConfiguration) throws ResourceSerializationException;
}
