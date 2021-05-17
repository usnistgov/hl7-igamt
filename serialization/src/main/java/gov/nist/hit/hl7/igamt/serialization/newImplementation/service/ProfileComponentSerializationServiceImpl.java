package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentContextDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentItemDataModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ProfileComponentExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentDataModel;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMax;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMin;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConfLength;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConstantValue;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDatatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthMax;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthMin;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthType;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyName;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyRef;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyUsage;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyValueSet;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ProfileComponentSerializationServiceImpl implements ProfileComponentSerializationService {
	
	@Autowired
    private IgDataModelSerializationService igDataModelSerializationService;
	
	@Autowired
    private SegmentService segmentService;
	
	@Autowired
    private ConformanceProfileService conformanceProfileService;
	
	@Autowired
    private DatatypeService datatypeService;

	@Override
	public Element serializeProfileComponent(ProfileComponentDataModel profileComponentDataModel,
			IgDataModel igDataModel, int level, int position,
			ProfileComponentExportConfiguration profileComponentExportConfiguration, Boolean deltaMode)
			throws ResourceSerializationException {

        if (profileComponentDataModel != null) {
            try {
                Element profileComponentElement = igDataModelSerializationService.serializeResource(profileComponentDataModel.getModel(), Type.PROFILECOMPONENT, position, profileComponentExportConfiguration);

                for(ProfileComponentContextDataModel profileComponentContext : profileComponentDataModel.getProfileComponentContextDataModels()) {
                	if(profileComponentContext != null) {
                		Element profileComponentContextElement = new Element("profileComponentContextElement");
                		profileComponentElement.appendChild(profileComponentContextElement);
                		profileComponentContextElement.addAttribute(
                				new Attribute("id", profileComponentContext.getId() != null ? profileComponentContext.getId() : "")
						);
                		profileComponentContextElement.addAttribute(
                				new Attribute("level", profileComponentContext.getLevel() != null ? profileComponentContext.getLevel().name() : "")
						);
                		profileComponentContextElement.addAttribute(
                				new Attribute("sourceId", profileComponentContext.getSourceId() != null ? profileComponentContext.getSourceId() : "")
						);
                		profileComponentContextElement.addAttribute(
                				new Attribute("position", String.valueOf(profileComponentContext.getPosition()))
						);

						if(profileComponentContext.getLevel().equals(Type.SEGMENT)) {
							Segment segment = segmentService.findById(profileComponentContext.getSourceId());
							profileComponentContextElement.addAttribute(
									new Attribute("sourceName", segment != null ? String.valueOf(segment.getLabel()) : "")
							);
						} else if(profileComponentContext.getLevel().equals(Type.CONFORMANCEPROFILE) ) {
							ConformanceProfile conformanceProfile = conformanceProfileService.findById(profileComponentContext.getSourceId());
							profileComponentContextElement.addAttribute(
									new Attribute("sourceName", conformanceProfile != null ? String.valueOf(conformanceProfile.getLabel()) : "")
							);
						}
                	
                		for(ProfileComponentItemDataModel profileComponentItem : profileComponentContext.getProfileComponentItemMap().values()) {
                			if(profileComponentItem != null) {
                        		Element profileComponentItemElement = new Element("profileComponentItemElement");
                        		profileComponentContextElement.appendChild(profileComponentItemElement);
                        		profileComponentItemElement.addAttribute(
                        				new Attribute("path", profileComponentItem.getPath() != null ? profileComponentItem.getPath() : ""));
                        	
								for(ItemProperty itemProperty : profileComponentItem.getItemProperties()) {
									if(itemProperty != null) {
										switch (itemProperty.getPropertyKey()) {
											case CARDINALITYMAX:
												profileComponentItemElement.addAttribute(
														new Attribute("cardinalityMax", ((PropertyCardinalityMax) itemProperty).getMax() != null ? ((PropertyCardinalityMax) itemProperty).getMax() : "")
												);
											break;

											case CARDINALITYMIN:
												profileComponentItemElement.addAttribute(
														new Attribute("cardinalityMin", String.valueOf(((PropertyCardinalityMin) itemProperty).getMin()))
												);
											break;

											case CONFLENGTH:
												profileComponentItemElement.addAttribute(
														new Attribute("confLength", ((PropertyConfLength) itemProperty).getConfLength() != null ? ((PropertyConfLength) itemProperty).getConfLength() : "")
												);
											break;

											case CONSTANTVALUE:
												profileComponentItemElement.addAttribute(
														new Attribute("constantValue", ((PropertyConstantValue) itemProperty).getConstantValue() != null ? ((PropertyConstantValue) itemProperty).getConstantValue() : "")
												);
											break;

											case DATATYPE:
												Datatype datatype = datatypeService.findById(((PropertyDatatype) itemProperty).getDatatypeId());
												profileComponentItemElement.addAttribute(
														new Attribute("datatype", datatype != null ? datatype.getLabel() : "")
												);
											break;

											case LENGTHMAX:
												profileComponentItemElement.addAttribute(new Attribute("lengthMax",
														((PropertyLengthMax) itemProperty) != null ? ((PropertyLengthMax) itemProperty).getMax() : ""));
											break;

											case LENGTHMIN:
												profileComponentItemElement.addAttribute(new Attribute("lengthMin",
														((PropertyLengthMin) itemProperty) != null ? ((PropertyLengthMin) itemProperty).getMin() : ""));
											break;

											case NAME:
												profileComponentItemElement.addAttribute(new Attribute("name",
														((PropertyName) itemProperty) != null ? ((PropertyName) itemProperty).getName() : ""));
											break;

		//                                    case PREDICATE:
		//                                    	profileComponentItemElement.addAttribute(new Attribute("cardinalityMax",
		//                                    			((PropertyCardinalityMax) itemProperty) != null ? ((PropertyCardinalityMax) itemProperty).getMax() : ""));
		//                                    break;

											case SEGMENTREF:
												profileComponentItemElement.addAttribute(new Attribute("segmentRef",
														((PropertyRef) itemProperty) != null ? ((PropertyRef) itemProperty).getRef(): ""));
											break;

	//                                    case SINGLECODE:
	//                                    	profileComponentItemElement.addAttribute(new Attribute("cardinalityMax",
	//                                    			((PropertyCardinalityMax) itemProperty) != null ? ((PropertyCardinalityMax) itemProperty).getMax() : ""));
	//                                    break;

											case USAGE:
												profileComponentItemElement.addAttribute(new Attribute("usage",
														((PropertyUsage) itemProperty) != null ? ((PropertyUsage) itemProperty).getUsage().name() : ""));
											break;

											case VALUESET:
												//TODO ALSO
												profileComponentItemElement.addAttribute(new Attribute("valueSet",
														((PropertyValueSet) itemProperty) != null ? ((PropertyValueSet) itemProperty).getValuesetBindings().toString() : ""));
											break;

											case LENGTHTYPE:
												profileComponentItemElement.addAttribute(new Attribute("lengthType",
														((PropertyLengthType) itemProperty) != null ? ((PropertyLengthType) itemProperty).getType().name() : ""));
											break;
										default:
											break;
										}
									}
								}
							}
                		}
            		}
                }
                return igDataModelSerializationService.getSectionElement(profileComponentElement, profileComponentDataModel.getModel(), level, profileComponentExportConfiguration);
            } catch (Exception exception) {
                throw new ResourceSerializationException(exception, Type.PROFILECOMPONENT,
                		profileComponentDataModel.getModel());
            }
        }
        return null;
    
	}

}
