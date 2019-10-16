package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ValueSetExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import nu.xom.Element;


public interface ValuesetSerializationService {
	
	public Element serializeValueSet(ValuesetDataModel valuesetDataModel, int level, int position, ValueSetExportConfiguration valueSetExportConfiguration) throws ResourceSerializationException;



}
