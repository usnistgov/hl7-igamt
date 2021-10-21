package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentContextDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentItemDataModel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeType;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.constraints.domain.AssertionConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ProfileComponentExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentDataModel;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PcDynamicMappingItem;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMax;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCardinalityMin;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConfLength;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConformanceStatement;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyConstantValue;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDatatype;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthMax;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthMin;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyLengthType;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyName;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyPredicate;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyRef;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyUsage;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyValueSet;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertySingleCode;

import gov.nist.hit.hl7.igamt.profilecomponent.service.ProfileComponentService;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
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
    private ProfileComponentService profileComponentService;
	
	@Autowired
	private ValuesetService valuesetService;
	
	@Autowired
	private ConstraintSerializationService constraintSerializationService;
	
	@Autowired
	CoConstraintService coConstraintService;
	
	
	
	@Autowired
	private ProfileComponentBindingSerializationService profileComponentBindingSerializationService;
	
    @Autowired
    private CoConstraintSerializationService coConstraintSerializationService;
	
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
                ProfileComponent profileComponent = profileComponentDataModel.getModel();
                List<ProfileComponentContextDataModel> contextList = profileComponentDataModel.getProfileComponentContextDataModels().stream().collect(Collectors.toList());
              Collections.sort(contextList);
                for(ProfileComponentContextDataModel profileComponentContext : contextList) {
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
                			Segment segment = new Segment();
                			ConformanceProfile conformanceProfile = new ConformanceProfile();
						if(profileComponentContext.getLevel().equals(Type.SEGMENT)) {
							 segment = segmentService.findById(profileComponentContext.getSourceId());
							profileComponentContextElement.addAttribute(
									new Attribute("sourceName", segment != null ? String.valueOf(segment.getLabel()) : "")
							);
						} else if(profileComponentContext.getLevel().equals(Type.CONFORMANCEPROFILE) ) {
							 conformanceProfile = conformanceProfileService.findById(profileComponentContext.getSourceId());
							profileComponentContextElement.addAttribute(
									new Attribute("sourceName", conformanceProfile != null ? String.valueOf(conformanceProfile.getLabel()) : "")
							);
						}
						
						List<ProfileComponentItemDataModel> itemList = profileComponentContext.getProfileComponentItemMap().values().stream().collect(Collectors.toList());
						Collections.sort(itemList);
                		for(ProfileComponentItemDataModel profileComponentItem : itemList) {
                			if(profileComponentItem != null) {
                        		Element profileComponentItemElement = new Element("profileComponentItemElement");
                        		profileComponentContextElement.appendChild(profileComponentItemElement);
                        		profileComponentItemElement.addAttribute(
                        				new Attribute("path", profileComponentItem.getLocationInfo() != null ? profileComponentItem.getLocationInfo().getPositionalPath() : ""));
                        		if(profileComponentItem.getLocationInfo() != null) {
                        		profileComponentItemElement.addAttribute(new Attribute("name",
										profileComponentItem.getLocationInfo().getName() != null ? profileComponentItem.getLocationInfo().getHl7Path() + " (" + profileComponentItem.getLocationInfo().getName()+")" : profileComponentItem.getLocationInfo().getHl7Path()));
                        		}
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

		//                                    case PREDICATE:
		//                                    	profileComponentItemElement.addAttribute(new Attribute("cardinalityMax",
		//                                    			((PropertyCardinalityMax) itemProperty) != null ? ((PropertyCardinalityMax) itemProperty).getMax() : ""));
		//                                    break;

											case SEGMENTREF:
												 segment = segmentService.findById(((PropertyRef) itemProperty).getRef());
												profileComponentItemElement.addAttribute(new Attribute("segmentRef",
														segment != null ? segment.getLabel(): ""));
											break;

	                                    case SINGLECODE:
	                                    	profileComponentItemElement.addAttribute(new Attribute("valueSet",
													((PropertySingleCode) itemProperty).getInternalSingleCode() != null ? ((PropertySingleCode) itemProperty).getInternalSingleCode().getCode() : ""));
										break;

											case USAGE:
												profileComponentItemElement.addAttribute(new Attribute("usage",
														((PropertyUsage) itemProperty) != null ? ((PropertyUsage) itemProperty).getUsage().toString() : ""));
											break;

											case VALUESET:
												//TODO ALSO
												profileComponentItemElement.addAttribute(new Attribute("valueSet",
														!(profileComponentBindingSerializationService.createValueSetList(((PropertyValueSet) itemProperty).getValuesetBindings()).isEmpty()) ? createValueSetList(((PropertyValueSet) itemProperty).getValuesetBindings()).toString() : "REMOVED"));
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
            		
                	
                	List<ProfileComponentItemDataModel> filtredValueSetProfileComponentItemDataModelList = profileComponentContext.getProfileComponentItemMap().values().stream().filter((item) -> {
            			return item.getItemProperties().stream().anyMatch((itemProperty) -> {
            				return (itemProperty instanceof PropertyValueSet && !((PropertyValueSet) itemProperty).getValuesetBindings().isEmpty());
            			});		
            		}).collect(Collectors.toList());
                	
                	List<ProfileComponentItemDataModel> filtredSingleCodeProfileComponentItemDataModelList = profileComponentContext.getProfileComponentItemMap().values().stream().filter((item) -> {
            			return item.getItemProperties().stream().anyMatch((itemProperty) -> {
            				return itemProperty instanceof PropertySingleCode;
            			});		
            		}).collect(Collectors.toList());
                	
                	List<ProfileComponentItemDataModel> filtredPredicateProfileComponentItemDataModelList = profileComponentContext.getProfileComponentItemMap().values().stream().filter((item) -> {
            			return item.getItemProperties().stream().anyMatch((itemProperty) -> {
            				return itemProperty instanceof PropertyPredicate;
            			});		
            		}).collect(Collectors.toList());
                	
                	List<PropertyBinding> filtredConformanceStatementProfileComponentItemDataModelList = profileComponentContext.getRootContextBindings().stream().filter((item) -> {
            				return item instanceof PropertyConformanceStatement;
            		}).collect(Collectors.toList());
                	
                	Element bindings = new Element("Binding");
                	if(!filtredValueSetProfileComponentItemDataModelList.isEmpty()) {
                Element valueSetBinding = profileComponentBindingSerializationService.serializeProfileComponentValuesetBindings(filtredValueSetProfileComponentItemDataModelList);
                if(valueSetBinding != null && valueSetBinding.getChildCount() !=0) {
                    bindings.appendChild(valueSetBinding);
                    }
                	}
                	if(!filtredSingleCodeProfileComponentItemDataModelList.isEmpty()) {
                Element singleCodeBinding = profileComponentBindingSerializationService.serializeProfileComponentSingleCodes(filtredSingleCodeProfileComponentItemDataModelList);
                if(singleCodeBinding != null) {
                    bindings.appendChild(singleCodeBinding);
                    }
                	}
                	
                
                if(bindings != null) {
                	profileComponentContextElement.appendChild(bindings);
                }
                
                Element constraints = new Element("Constraints");
                if(!filtredPredicateProfileComponentItemDataModelList.isEmpty()) {
            		for(ProfileComponentItemDataModel profileComponentItemDataModel :filtredPredicateProfileComponentItemDataModelList) {
            			if(profileComponentItemDataModel != null) {
            				ItemProperty itemProperty = profileComponentItemDataModel.getItemProperties().stream().filter((item) -> {
            					return item instanceof PropertyPredicate;
            				}).findAny().get();
            			Element predicateElement = constraintSerializationService.serializePredicate(((PropertyPredicate) itemProperty).getPredicate(), profileComponentItemDataModel.getLocationInfo().getHl7Path());
                    if(predicateElement != null) {
                    	constraints.appendChild(predicateElement);
                        }
                    	}
            	}
                }
                if(!filtredConformanceStatementProfileComponentItemDataModelList.isEmpty()) {
        			ResourceBinding resourceBinding = new ResourceBinding();
    				ConformanceStatement conformanceStatement = new ConformanceStatement();
        			if(profileComponentContext.getLevel().equals(Type.SEGMENT)) {
        				resourceBinding = segment.getBinding();
        			} else if(profileComponentContext.getLevel().equals(Type.CONFORMANCEPROFILE)){
        				resourceBinding = conformanceProfile.getBinding()	;
        			}
            		for(PropertyBinding propertyBinding :filtredConformanceStatementProfileComponentItemDataModelList) {
            			if(propertyBinding != null) {
            				ConformanceStatement cs = getConformanceStatement(propertyBinding, resourceBinding);
            				if(cs != null) {
                            	Element conformanceStatementElement = constraintSerializationService.serializeConformanceStatement(cs);
                    			conformanceStatementElement.addAttribute(new Attribute("changeType",propertyBinding != null ? ((PropertyConformanceStatement) propertyBinding).getChange().name(): ""));
                    			conformanceStatementElement.addAttribute(new Attribute("changeType",propertyBinding != null ? ((PropertyConformanceStatement) propertyBinding).getChange().name(): ""));

//            					String description = "";
//                    			if(conformanceStatement != null) {
//                                 			conformanceStatementElement.addAttribute(new Attribute("description",((AssertionConformanceStatement) conformanceStatement).getAssertion() != null ? ((AssertionConformanceStatement) conformanceStatement).getAssertion().getDescription(): ""));
//                    			}
//                    			conformanceStatementElement.addAttribute(new Attribute("changeType",propertyBinding != null ? ((PropertyConformanceStatement) propertyBinding).getChange().name(): ""));
//                    			conformanceStatementElement.addAttribute(new Attribute("identifier",conformanceStatement != null ? conformanceStatement.getIdentifier(): ""));

                    					if(conformanceStatementElement != null) {
                            	constraints.appendChild(conformanceStatementElement);
                                }            				}
//            				ItemProperty itemProperty = profileComponentItemDataModel.getItemProperties().stream().filter((item) -> {
//            					return item instanceof PropertyConformanceStatement;
//            				}).findAny().get();
            			

            			
            			
                    	}
            	}
            	}
                
                if(constraints != null) {
                	profileComponentContextElement.appendChild(constraints);
                }
                
            	//Dynamic mapping	
            	if(profileComponentContext.getProfileComponentDynamicMapping() != null) {
                    Element dynamicMapping = new Element("DynamicMappingForProfileComponent");
                    Set<PcDynamicMappingItem> dynamicMappingItemSet = profileComponentContext.getProfileComponentDynamicMapping().getItems();
              	  List<PcDynamicMappingItem> dynamicMappingList = dynamicMappingItemSet.stream().sorted((e1, e2) -> 
              	  e1.getDatatypeName().compareTo(e2.getDatatypeName())).collect(Collectors.toList());
                    for(PcDynamicMappingItem pcDynamicMappingItem : dynamicMappingList){
                    	if(pcDynamicMappingItem != null){
                            Element dynamicMappingItem = this.serializeDynamicMapping(pcDynamicMappingItem);              
                            if(dynamicMappingItem != null){
                            	dynamicMapping.appendChild(dynamicMappingItem);
                            }
                    	}
                    }
                    if(dynamicMapping != null) {
                    	profileComponentContextElement.appendChild(dynamicMapping);
                    }
            	}
            	
            	//Coconstraints	
            	if (profileComponentContext.getProfileComponentCoConstraints() != null && profileComponentContext.getProfileComponentCoConstraints().getBindings()  != null) {
                    Element coConstraintsBindingsElement = new Element("coConstraintsBindingsElement");
                    profileComponentContextElement.appendChild(coConstraintsBindingsElement);
                    for (CoConstraintBinding coConstraintBinding : profileComponentContext.getProfileComponentCoConstraints().getBindings() ) {
                        Element coConstraintBindingElement = new Element("coConstraintBindingElement");
                        coConstraintsBindingsElement.appendChild(coConstraintBindingElement);
                        if (coConstraintBinding != null) {
                            if (coConstraintBinding.getContext() != null) {
                                Element coConstraintContext = new Element("coConstraintContext");
                                coConstraintContext.appendChild(coConstraintBinding.getContext().getName());
                                coConstraintBindingElement.appendChild(coConstraintContext);
                            }
                            if (coConstraintBinding.getBindings() != null) {
                                for (CoConstraintBindingSegment coConstraintBindingSegment : coConstraintBinding.getBindings()) {
                                    if (coConstraintBindingSegment != null) {
                                        Element coConstraintBindingSegmentElement = new Element("coConstraintBindingSegmentElement");
                                        coConstraintBindingElement.appendChild(coConstraintBindingSegmentElement);
//            							coConstraintBindingSegmentElement.appendChild(coConstraintContext);
                                        Element coConstraintSegmentName = new Element("coConstraintSegmentName");
                                        coConstraintSegmentName.appendChild(coConstraintBindingSegment.getSegment().getName());
                                        coConstraintBindingSegmentElement.appendChild(coConstraintSegmentName);
                                        for (CoConstraintTableConditionalBinding coConstraintTableConditionalBinding : coConstraintBindingSegment.getTables()) {
                                            CoConstraintTable mergedCoConstraintTable = coConstraintService.resolveRefAndMerge(coConstraintTableConditionalBinding.getValue());
                                            Element coConstraintTableConditionalBindingElement = new Element("coConstraintTableConditionalBindingElement");
                                            coConstraintBindingSegmentElement.appendChild(coConstraintTableConditionalBindingElement);
                                            if (coConstraintTableConditionalBinding.getCondition() != null) {
                                                Element coConstraintCondition = new Element("coConstraintCondition");
                                                coConstraintCondition.appendChild(coConstraintTableConditionalBinding.getCondition().getDescription());
                                                coConstraintTableConditionalBindingElement.appendChild(coConstraintCondition);
                                            }
    
                                                Element coConstraintsTable = new Element("coConstraintsTable");
                                                coConstraintsTable.appendChild(coConstraintSerializationService.SerializeCoConstraintCompact(mergedCoConstraintTable));
                                                coConstraintTableConditionalBindingElement.appendChild(coConstraintsTable);
                                            
//            	    						if(conformanceProfileExportConfiguration.getCoConstraintExportMode().name().equals("NOEXPORT")) {
//            		    						 coConstraintsElement = new Element("");
//            	    						}
//            	    						System.out.println("Coconstraint XML :" + coConstraintsElement.toXML());
//            	    		    	        if (coConstraintsElement != null) {
//            	    		    	        	getCoConstraintsBindingsElement.appendChild(coConstraintsElement);
//            	    		    	        }
                                        }
                                    }
                                }
                            }

                        }
//            		conformanceProfileElement.appendChild(getCoConstraintsBindingsElement);

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
	
	private Element serializeDynamicMapping(PcDynamicMappingItem pcDynamicMappingItem) {
		Element dynamicMappingItem	= new Element("DynamicMappingItem");
		dynamicMappingItem.addAttribute(
				new Attribute("change", pcDynamicMappingItem.getChange() != null ? pcDynamicMappingItem.getChange().name() : "")
		);
		dynamicMappingItem.addAttribute(
				new Attribute("datatypeName", pcDynamicMappingItem.getDatatypeName() != null ? pcDynamicMappingItem.getDatatypeName() : "")
		);
		Datatype datatype = datatypeService.findById(pcDynamicMappingItem.getFlavorId());
		dynamicMappingItem.addAttribute(
				new Attribute("flavor", datatype != null ? datatype.getLabel() : "")
		);
		return dynamicMappingItem;
	}
	

	private ConformanceStatement getConformanceStatement(PropertyBinding propertyBinding, ResourceBinding resourceBinding) {
		if(((PropertyConformanceStatement) propertyBinding).getChange().equals(ChangeType.DELETE)) {
			
			 return resourceBinding.getConformanceStatements().stream().filter((cs) -> {
				return cs.getId().equals(((PropertyConformanceStatement) propertyBinding).getTargetId());
			}).findAny().orElse(null);
			 
		} else {
			return ((PropertyConformanceStatement) propertyBinding).getPayload();
		}
	}

	private List<String> createValueSetList(Set<ValuesetBinding> valuesetBindings) {
		List<String> vsList = new ArrayList<String>();
		for(ValuesetBinding valuesetBinding : valuesetBindings) {
			for(String vs : valuesetBinding.getValueSets()) {
				Valueset valueset = valuesetService.findById(vs);
				vsList.add(valueset.getLabel());
			}
		}
		return vsList;
	}

}
