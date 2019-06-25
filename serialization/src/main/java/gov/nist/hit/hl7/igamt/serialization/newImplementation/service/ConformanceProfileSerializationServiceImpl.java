package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ConformanceProfileSerializationServiceImpl implements ConformanceProfileSerializationService {

@Autowired
private IgDataModelSerializationService igDataModelSerializationService;
	
	@Override
	public Element serializeConformanceProfile(ConformanceProfileDataModel conformanceProfileDataModel, int level,
			ExportConfiguration exportConfiguration) throws ResourceSerializationException {
	    ConformanceProfile conformanceProfile = conformanceProfileDataModel.getModel();
	    if (conformanceProfile != null) {
	      try {
			Element conformanceProfileElement = igDataModelSerializationService.serializeResource(conformanceProfileDataModel.getModel(), Type.CONFORMANCEPROFILE, exportConfiguration);
	        conformanceProfileElement.addAttribute(new Attribute("identifier",
	            conformanceProfile.getIdentifier() != null ? conformanceProfile.getIdentifier() : ""));
	        conformanceProfileElement.addAttribute(new Attribute("messageType",
	            conformanceProfile.getMessageType() != null ? conformanceProfile.getMessageType()
	                : ""));
	        conformanceProfileElement.addAttribute(new Attribute("event",
	            conformanceProfile.getEvent() != null ? conformanceProfile.getEvent() : ""));
	        conformanceProfileElement.addAttribute(new Attribute("structID",
	            conformanceProfile.getStructID() != null ? conformanceProfile.getStructID() : ""));
//	        Element bindingElement = super.serializeResourceBinding(conformanceProfile.getBinding(), this.valuesetNamesMap);
//	        if (bindingElement != null) {
//	          conformanceProfileElement.appendChild(bindingElement);
//	        }
//	        if (conformanceProfile.getChildren() != null
//	            && conformanceProfile.getChildren().size() > 0) {
//	          for (MsgStructElement msgStructElm : conformanceProfile.getChildren()) {
//	            if (msgStructElm != null) {
//	              if(this.bindedGroupsAndSegmentRefs.contains(msgStructElm.getId())) {
//	                Element msgStructElement = this.serializeMsgStructElement(msgStructElm, 0);
//	                if (msgStructElement != null) {
//	                  conformanceProfileElement.appendChild(msgStructElement);
//	                }
//	              }
//	            }
//	          }
//	        }
		    return igDataModelSerializationService.getSectionElement(conformanceProfileElement, conformanceProfileDataModel.getModel(), level);

	      } catch (Exception exception) {
	        throw new ResourceSerializationException(exception, Type.CONFORMANCEPROFILE,
	        		conformanceProfileDataModel.getModel());
	      }
	    }
	    return null;
	  
	}

}
