package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ValuesetSerializationServiceImpl implements ValuesetSerializationService{

	@Autowired
	private IgDataModelSerializationService igDataModelSerializationService;
	
	@Override
	public Element serializeValueSet(ValuesetDataModel valuesetDataModel, int level,
			ExportConfiguration exportConfiguration) throws ResourceSerializationException {
	   return null;
	  
	}

}

