package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.List;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentItemDataModel;
import nu.xom.Element;

public interface ProfileComponentBindingSerializationService {

	
	public Element serializeProfileComponentValuesetBindings(List<ProfileComponentItemDataModel> profileComponentItemDataModelList);
	public Element serializeProfileComponentSingleCodes(List<ProfileComponentItemDataModel> profileComponentItemDataModelList);
	public List<String> createValueSetList(Set<ValuesetBinding> valuesetBindings);

}
