package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.common.base.domain.Comment;
import gov.nist.hit.hl7.igamt.common.base.domain.MsgStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.delta.domain.ConformanceStatementDelta;
import gov.nist.hit.hl7.igamt.delta.domain.ResourceDelta;
import gov.nist.hit.hl7.igamt.delta.domain.StructureDelta;
import gov.nist.hit.hl7.igamt.export.configuration.domain.DeltaExportConfigMode;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportTools;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ProfileComponentExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentDataModel;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMax;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMin;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyComment;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConfLength;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConstantValue;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDatatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDefinitionText;
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
    private DatatypeService datatypeService;

	@Override
	public Element serializeProfileComponent(ProfileComponentDataModel profileComponentDataModel,
			IgDataModel igDataModel, int level, int position,
			ProfileComponentExportConfiguration profileComponentExportConfiguration, Boolean deltaMode)
			throws ResourceSerializationException {

		ProfileComponent profileComponent = profileComponentDataModel.getModel();
        if (profileComponent != null) {
            try {
                Element profileComponentElement = igDataModelSerializationService.serializeResource(profileComponentDataModel.getModel(), Type.PROFILECOMPONENT, position, profileComponentExportConfiguration);

                for(ProfileComponentContext profileComponentContext : profileComponent.getChildren() ) {
                	if(profileComponentContext != null) {
                	Element profileComponentContextElement = new Element("profileComponentContextElement");
                	profileComponentElement.appendChild(profileComponentContextElement);
                	profileComponentContextElement.addAttribute(new Attribute("id",
                			profileComponentContext.getId() != null ? profileComponentContext.getId() : ""));
                	profileComponentContextElement.addAttribute(new Attribute("level",
                			profileComponentContext.getLevel() != null ? profileComponentContext.getLevel().name() : ""));
                	profileComponentContextElement.addAttribute(new Attribute("sourceId",
                			profileComponentContext.getSourceId() != null ? profileComponentContext.getSourceId() : ""));
                	profileComponentContextElement.addAttribute(new Attribute("position",
                			profileComponentContext != null ? String.valueOf(profileComponentContext.getPosition()) : ""));
                	Segment segment = segmentService.findById(profileComponentContext.getSourceId());
                	
                	profileComponentContextElement.addAttribute(new Attribute("segmentName",
                			segment != null ? String.valueOf(segment.getName()) : ""));
                	
                	for(ProfileComponentItem profileComponentItem : profileComponentContext.getProfileComponentItems()) {
                		if(profileComponentItem != null) {
                        	Element profileComponentItemElement = new Element("profileComponentItemElement");
                        	profileComponentContextElement.appendChild(profileComponentItemElement);
                        	profileComponentItemElement.addAttribute(new Attribute("path",
                        			profileComponentItem.getPath() != null ? profileComponentItem.getPath() : ""));
                        	
                        for(ItemProperty itemProperty : profileComponentItem.getItemProperties()) {
                        	if(itemProperty != null) {
//                            	Element itemPropretyElement = new Element("itemPropretyElement");
//                            	profileComponentItemElement.appendChild(itemPropretyElement);
                        		switch (itemProperty.getPropertyKey()) 
                                {
                                    case CARDINALITYMAX:
                                    	profileComponentItemElement.addAttribute(new Attribute("cardinalityMax",
                                    			((PropertyCardinalityMax) itemProperty) != null ? ((PropertyCardinalityMax) itemProperty).getMax() : ""));
                                    break;
                                    
                                    case CARDINALITYMIN:
                                    	profileComponentItemElement.addAttribute(new Attribute("cardinalityMin",
                                    			((PropertyCardinalityMin) itemProperty) != null ? String.valueOf(((PropertyCardinalityMin) itemProperty).getMin()) : ""));
                                    break;
                                    
                                    case COMMENT:
                                    	profileComponentItemElement.addAttribute(new Attribute("comment",
                                    			((PropertyComment) itemProperty).getComment() != null ? ((PropertyComment) itemProperty).getComment().getDescription() : ""));
                                    break;
                                    
                                    case CONFLENGTH:
                                    	profileComponentItemElement.addAttribute(new Attribute("confLength",
                                    			((PropertyConfLength) itemProperty) != null ? ((PropertyConfLength) itemProperty).getConfLength() : ""));
                                    break;
                                    
//                                    case STATEMENT:
//                                    	profileComponentItemElement.addAttribute(new Attribute("cardinalityMax",
//                                    			((PropertyStatement) itemProperty) != null ? ((PropertyCardinalityMax) itemProperty).getMax() : ""));
//                                    break;
                                    
                                    case CONSTANTVALUE:
                                    	profileComponentItemElement.addAttribute(new Attribute("constantValue",
                                    			((PropertyConstantValue) itemProperty) != null ? ((PropertyConstantValue) itemProperty).getConstantValue() : ""));
                                    break;
                                    
                                    case DATATYPE:
                                    	Datatype datatype = datatypeService.findById(((PropertyDatatype) itemProperty).getDatatypeId());
                                    	profileComponentItemElement.addAttribute(new Attribute("datatype",
                                    			datatype != null ? datatype.getLabel() : ""));
                                    break;
                                    
//                                    case DYNAMICMAPPINGITEM:
//                                    	profileComponentItemElement.addAttribute(new Attribute("cardinalityMax",
//                                    			((PropertyCardinalityMax) itemProperty) != null ? ((PropertyCardinalityMax) itemProperty).getMax() : ""));
//                                    break;
                                    
                                    case DEFINITIONTEXT:
                                    	profileComponentItemElement.addAttribute(new Attribute("definitionText",
                                    			((PropertyDefinitionText) itemProperty) != null ? ((PropertyDefinitionText) itemProperty).getDefinitionText() : ""));
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
                	
           
                

                
//        	      Map<String, Boolean > bindedPaths = conformanceProfile.getChildren().stream().filter(  field  -> field != null && ExportTools.CheckUsage(conformanceProfileExportConfiguration.getSegmentORGroupsMessageExport(), field.getUsage())).collect(Collectors.toMap( x -> x.getId(), x -> true ));
//                if (conformanceProfile.getBinding() != null) {
//                    Element bindingElement = bindingSerializationService.serializeBinding(conformanceProfile.getBinding(), conformanceProfileDataModel.getValuesetMap(), conformanceProfileDataModel.getModel().getName(), bindedPaths);
//                    if (bindingElement != null) {
//                        conformanceProfileElement.appendChild(bindingElement);
//                    }
//                }



//                if (conformanceProfile.getChildren() != null
//                        && conformanceProfile.getChildren().size() > 0) {
//                    Element commentsElement = new Element("Comments");
//                    Element definitionTextsElement = new Element("DefinitionTexts");
//                    for (SegmentRefOrGroup segmentRefOrGroup : conformanceProfile.getChildren()) {
//                        if (segmentRefOrGroup.getComments() != null) {
//                            for (Comment comment : segmentRefOrGroup.getComments()) {
//                                Element commentElement = new Element("Comment");
//                                commentElement.addAttribute(new Attribute("name", segmentRefOrGroup.getName()));
//                                commentElement.addAttribute(new Attribute("description", comment.getDescription()));
//                                commentsElement.appendChild(commentElement);
//                            }
//
//                        }
//                        if (segmentRefOrGroup.getText() != null) {
//                            Element definitionText = new Element("DefinitionText");
//                            definitionText
//                                    .addAttribute(new Attribute("text", segmentRefOrGroup.getText()));
//                            definitionText.addAttribute(new Attribute("name", segmentRefOrGroup.getName()));
//                            definitionTextsElement.appendChild(definitionText);
//                        }
//                    }
//
//                    if(conformanceProfileExportConfiguration.getStructuredNarrative().isComments()) {
//                        conformanceProfileElement.appendChild(commentsElement);
//                    }
//                    if(conformanceProfileExportConfiguration.getStructuredNarrative().isDefinitionText()) {
//                        conformanceProfileElement.appendChild(definitionTextsElement);
//                    }
//
//
//                    List<MsgStructElement> msgStructElementList = conformanceProfile.getChildren().stream().sorted((e1, e2) ->
//                            e1.getPosition() - e2.getPosition()).collect(Collectors.toList());
//
//                    for (MsgStructElement messageStructElm : msgStructElementList) {
//                        if (messageStructElm != null && ExportTools.CheckUsage(conformanceProfileExportConfiguration.getSegmentORGroupsMessageExport(), messageStructElm.getUsage())) {
//                            if (messageStructElm != null) {
////		              if(this.bindedGroupsAndSegmentRefs.contains(msgStructElm.getId())) {
//                                Element msgStructElement = this.serializeMsgStructElement(igDataModel, messageStructElm, 0, conformanceProfileExportConfiguration);
//                                if (msgStructElement != null) {
//                                    conformanceProfileElement.appendChild(msgStructElement);
//                                }
//                            }
//                        }
////		            }
//                    }
//                }
                



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
