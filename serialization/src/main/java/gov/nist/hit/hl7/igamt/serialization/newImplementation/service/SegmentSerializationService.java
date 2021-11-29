package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.SegmentExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import nu.xom.Element;

public interface SegmentSerializationService {

	public Element serializeSegment(IgDataModel igDataModel, SegmentDataModel segmentDataModel, int level, int position, SegmentExportConfiguration segmentExportConfiguration, ExportFilterDecision exportFilterDecision, Boolean deltaMode) throws ResourceSerializationException, SubStructElementSerializationException, SerializationException;
}
