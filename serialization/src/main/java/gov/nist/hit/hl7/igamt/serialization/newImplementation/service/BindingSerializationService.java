package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.binding.domain.Binding;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetBindingDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

public interface BindingSerializationService {


//	public Element serializeBinding(Binding binding, Set<ValuesetBindingDataModel> valuesetBindingDataModels)
//			throws SerializationException;

	public Element serializeBinding(Binding binding, Map<String, Set<ValuesetBindingDataModel>> valuesetMap, String name) throws SerializationException;

//	public Element serializeBinding(Binding binding, DatatypeDataModel datatypeDataModel);
}
