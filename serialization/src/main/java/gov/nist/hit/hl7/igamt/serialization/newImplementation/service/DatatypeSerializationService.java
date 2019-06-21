package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import nu.xom.Element;

public interface DatatypeSerializationService {
	
	public Element serializeDatatype(DatatypeDataModel datatypeDataModel, int level, ExportConfiguration exportConfiguration );

	public Element serializeComplexDatatype(Element datatypeElement);

	public Element serializeDateTimeDatatype(Element datatypeElement);
}
