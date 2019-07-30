package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

public interface BindingSerializationService {
	
	public Element serializeBinding(IgDataModel igDataModel, Binding binding) throws SerializationException;
}
