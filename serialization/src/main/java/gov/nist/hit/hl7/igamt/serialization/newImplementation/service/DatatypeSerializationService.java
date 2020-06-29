package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DatatypeExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.SegmentExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.serialization.exception.SubStructElementSerializationException;
import nu.xom.Element;

public interface DatatypeSerializationService {
	
	public Element serializeDatatype(String igId, DatatypeDataModel datatypeDataModel, int level, int position, DatatypeExportConfiguration datatypeExportConfiguration, Type type, Boolean deltaMode ) throws SubStructElementSerializationException, SerializationException;

	public Element serializeComplexDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel , DatatypeExportConfiguration datatypeExportConfiguration, Type type) throws SubStructElementSerializationException;

	public Element serializeDateTimeDatatype(Element datatypeElement, DatatypeDataModel datatypeDataModel, DatatypeExportConfiguration datatypeExportConfiguration);
}
