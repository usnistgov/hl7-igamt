package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

public interface IgDataModelSerializationService {

	public Element serializeIgDocument(IgDataModel igDataModel, ExportConfiguration exportConfiguration)
		      throws SerializationException;
	
	public Element serializeAbstractDomain(IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	
	public Element getElement(Type type, int level, String id, String title);



	  

}


