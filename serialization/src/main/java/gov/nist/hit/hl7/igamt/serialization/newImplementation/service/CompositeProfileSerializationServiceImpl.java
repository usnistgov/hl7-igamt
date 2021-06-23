package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.Collections;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.OrderedProfileComponentLink;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.export.configuration.domain.GeneratedFlavorsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.CompositeProfileExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.CompositeProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class CompositeProfileSerializationServiceImpl implements CompositeProfileSerializationService {

	@Autowired
    private IgDataModelSerializationService igDataModelSerializationService;
	
	@Autowired
    private ConformanceProfileService conformanceProfileService;
	
	@Autowired
    private ProfileComponentService profileComponentService;
	
	@Autowired
    private ConformanceProfileSerializationService conformanceProfileSerializationService;
	
	
	
	@Override
	public Element serializeCompositeProfile(CompositeProfileDataModel compositeProfileDataModel,
			IgDataModel igDataModel, int level, int position,
			CompositeProfileExportConfiguration compositeProfileExportConfiguration, Boolean deltaMode)
			throws ResourceSerializationException {
		if (compositeProfileDataModel != null) {
            try {
            	// Add flavored Segments and Datatypes of composite profile to DatamodelList to be exported in Datatypes and Segments
					igDataModel.getSegments().addAll(compositeProfileDataModel.getFlavoredSegmentDataModelsList());
					igDataModel.getDatatypes().addAll(compositeProfileDataModel.getFlavoredDatatypeDataModelsList());

                Element compositeProfileElement = igDataModelSerializationService.serializeResource(compositeProfileDataModel.getModel(), Type.COMPOSITEPROFILE, position, compositeProfileExportConfiguration);
                CompositeProfileStructure compositeProfile = compositeProfileDataModel.getModel();
//                Element composition = new Element("Composition");
                if(compositeProfileExportConfiguration.isIncludeComposition()) {
                String compositionString= compositeProfile.getName() +" Composition = ";
                ConformanceProfile cs = conformanceProfileService.findById(compositeProfile.getConformanceProfileId());
                if(cs != null) compositionString += cs.getLabel();
                for(OrderedProfileComponentLink orderedProfileComponentLink :compositeProfile.getOrderedProfileComponents() ) {
                		ProfileComponent pc = profileComponentService.findById(orderedProfileComponentLink.getProfileComponentId());
                		if(pc !=null) compositionString+= " + " + pc.getLabel();
                }
                compositeProfileElement.addAttribute(
        				new Attribute("Composition", compositeProfile != null ? compositionString : "")
				);
            }
                if(compositeProfileExportConfiguration.isFlavorExtension()) {
                compositeProfileElement.addAttribute(
        				new Attribute("flavorExtension", compositeProfile.getFlavorsExtension() != null ? compositeProfile.getFlavorsExtension() : "")
				);
                }
                if(compositeProfileExportConfiguration.isDescription()) {
                    compositeProfileElement.addAttribute(
            				new Attribute("description", compositeProfile.getShortDescription() != null ? compositeProfile.getShortDescription() : "")
    				);
                    }
                if(compositeProfileExportConfiguration.isEntityIdentifier()) {
                    compositeProfileElement.addAttribute(
            				new Attribute("entityIdentifier", compositeProfile.getPreCoordinatedMessageIdentifier() != null ? compositeProfile.getPreCoordinatedMessageIdentifier().getEntityIdentifier() : "")
    				);
                    }
                if(compositeProfileExportConfiguration.isNamespaceId()) {
                    compositeProfileElement.addAttribute(
            				new Attribute("nameSpaceID", compositeProfile.getPreCoordinatedMessageIdentifier() != null ? compositeProfile.getPreCoordinatedMessageIdentifier().getNamespaceId() : "")
    				);
                    }
                if(compositeProfileExportConfiguration.isUniversalId()) {
                    compositeProfileElement.addAttribute(
            				new Attribute("universalID", compositeProfile.getPreCoordinatedMessageIdentifier() != null ? compositeProfile.getPreCoordinatedMessageIdentifier().getUniversalId() : "")
    				);
                    }
                if(compositeProfileExportConfiguration.isUniversalIdType()) {
                    compositeProfileElement.addAttribute(
            				new Attribute("universalIDType", compositeProfile.getPreCoordinatedMessageIdentifier() != null ? compositeProfile.getPreCoordinatedMessageIdentifier().getUniversalIdType() : "")
    				);
                    }
                Element conformanceProfileElement = conformanceProfileSerializationService.serializeConformanceProfile(compositeProfileDataModel.getConformanceProfileDataModel(), igDataModel, level +1, 0, compositeProfileExportConfiguration.getConformamceProfileExportConfiguration(), false);
                if (conformanceProfileElement != null) {
                	compositeProfileElement.appendChild(conformanceProfileElement);
                }
                return igDataModelSerializationService.getSectionElement(compositeProfileElement, compositeProfileDataModel.getModel(), level, compositeProfileExportConfiguration);

            	} catch (Exception exception) {
                throw new ResourceSerializationException(exception, Type.COMPOSITEPROFILE,
                		compositeProfileDataModel.getModel());
            }
        }
        return null;
	}

}

