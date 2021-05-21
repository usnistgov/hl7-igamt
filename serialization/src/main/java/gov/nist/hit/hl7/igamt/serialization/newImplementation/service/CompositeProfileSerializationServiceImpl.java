package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.export.configuration.newModel.CompositeProfileExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.CompositeProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import nu.xom.Element;

public class CompositeProfileSerializationServiceImpl implements CompositeProfileSerializationService {

	@Override
	public Element serializeCompositeProfile(CompositeProfileDataModel compositeProfileDataModel,
			IgDataModel igDataModel, int level, int position,
			CompositeProfileExportConfiguration compositeProfileExportConfiguration, Boolean deltaMode)
			throws ResourceSerializationException {
		// TODO Auto-generated method stub
		return null;
	}

}
