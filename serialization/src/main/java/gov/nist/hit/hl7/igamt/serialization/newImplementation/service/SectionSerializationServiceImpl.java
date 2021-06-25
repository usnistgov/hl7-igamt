package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.export.configuration.newModel.ProfileComponentExportConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructureDataModel;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ValuesetNotFoundException;
import gov.nist.hit.hl7.igamt.conformanceprofile.exception.ConformanceProfileNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibraryDataModel;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.GeneratedFlavorsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.CompositeProfileExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DatatypeExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.CompositeProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.SegmentDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class SectionSerializationServiceImpl implements SectionSerializationService {

    private Set<Element> conformanceStatements = new HashSet<>();
    private Set<Element> predicates = new HashSet<>();

    @Autowired
    private IgDataModelSerializationService igDataModelSerializationService;

    @Autowired
    private DatatypeSerializationService datatypeSerializationService;

    @Autowired
    private SegmentSerializationService segmentSerializationService;

    @Autowired
    private ConformanceProfileSerializationService conformanceProfileSerializationService;
    
    @Autowired
    private CompositeProfileSerializationService compositeProfileSerializationService;
    
    
    @Autowired
    private ProfileComponentSerializationService profileComponentSerializationService;

    @Autowired
    private ValuesetSerializationService valuesetSerializationService;
    
    @Autowired
    private FroalaSerializationUtil frolaCleaning;


    @Override
    public Element SerializeSection(Section section, int level, DocumentStructureDataModel documentStructureDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Element serializedSection = null;
        if(documentStructureDataModel instanceof IgDataModel) {
        if (Type.TEXT.equals(section.getType()) && !exportConfiguration.getIgGeneralConfiguration().isNotMessageInfrastructure()) {
            serializedSection = SerializeTextSection((TextSection) section, level, (IgDataModel) documentStructureDataModel, exportConfiguration);
        } else
        	if (Type.PROFILE.equals(section.getType())) {
            serializedSection = SerializeProfile((TextSection) section, level, (IgDataModel) documentStructureDataModel, exportConfiguration,
                    exportFilterDecision);
        } 
        	else if (Type.PROFILECOMPONENTREGISTRY.equals(section.getType())) {
            serializedSection = SerializeProfileComponentRegistry(section, level, (IgDataModel) documentStructureDataModel, exportConfiguration,
                    exportFilterDecision);
        } 
         	else if (Type.COMPOSITEPROFILEREGISTRY.equals(section.getType())) {
                serializedSection = SerializeCompositeProfileRegistry(section, level, (IgDataModel) documentStructureDataModel, exportConfiguration,
                        exportFilterDecision);
            } 
        else 
        	if (Type.DATATYPEREGISTRY.equals(section.getType())) {
            serializedSection = SerializeDatatypeRegistry(section, level, (IgDataModel) documentStructureDataModel, exportConfiguration,
                    exportFilterDecision);
        } else if (Type.SEGMENTREGISTRY.equals(section.getType())) {
            if (exportConfiguration.isIncludeSegmentTable()) {
                serializedSection = SerializeSegmentRegistry(section, level, (IgDataModel) documentStructureDataModel, exportConfiguration,
                        exportFilterDecision);
            }
        } else if (Type.CONFORMANCEPROFILEREGISTRY.equals(section.getType())) {
            if (exportConfiguration.isIncludeMessageTable()) {
                serializedSection = SerializeConformanceProfileRegistry(section, level, (IgDataModel) documentStructureDataModel,
                        exportConfiguration, exportFilterDecision);
            }
        } else if (Type.VALUESETREGISTRY.equals(section.getType())) {
            if (exportConfiguration.isIncludeValuesetsTable()) {
                serializedSection = SerializeValuesetRegistry(section, level, (IgDataModel) documentStructureDataModel, exportConfiguration,
                        exportFilterDecision);
            }
        }
        } else if(documentStructureDataModel instanceof DatatypeLibraryDataModel) {
        	if (Type.TEXT.equals(section.getType())) {
                serializedSection = SerializeTextSection((TextSection) section, level, (DatatypeLibraryDataModel) documentStructureDataModel, exportConfiguration);
            } else if (Type.PROFILE.equals(section.getType())) {
                serializedSection = SerializeProfile((TextSection) section, level, (DatatypeLibraryDataModel) documentStructureDataModel, exportConfiguration,
                        exportFilterDecision);
            } else if (Type.DATATYPEREGISTRY.equals(section.getType())) {
                serializedSection = SerializeDatatypeRegistry(section, level, (DatatypeLibraryDataModel) documentStructureDataModel, exportConfiguration,
                        exportFilterDecision);
            }
        }
        return serializedSection;
    }
    private Element SerializeCompositeProfileRegistry(Section section, int level,
			IgDataModel igDataModel, ExportConfiguration exportConfiguration,
			ExportFilterDecision exportFilterDecision) throws RegistrySerializationException 
    {
    		Registry compositeProfileRegistry = igDataModel.getModel().getCompositeProfileRegistry();
            try {
                Element compositeProfileRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
                if (compositeProfileRegistry != null && !compositeProfileRegistry.getChildren().isEmpty()) {
//                	ArrayList<CompositeProfileDataModel> compositeProfileDataModelsList = new ArrayList<>();
//                	for (Link compositeProfileLink : compositeProfileRegistry.getChildren()) {
//
//                		CompositeProfileDataModel compositeProfileModel = igDataModel.getCompositeProfile()
//    							.stream()
//    							.filter(dt -> compositeProfileLink.getId().equals(dt.getModel().getId()))
//    							.findAny()
//    							.orElseThrow(() -> new ConformanceProfileNotFoundException(compositeProfileLink.getId()));
//                		compositeProfileDataModelsList.add(compositeProfileModel);
//                	}
					List<CompositeProfileDataModel> compositeProfileDataModelsList = (igDataModel).getCompositeProfile().stream().collect(Collectors.toList());
                	Collections.sort(compositeProfileDataModelsList);

                	for(CompositeProfileDataModel compositeProfileDataModel : compositeProfileDataModelsList) {
    					boolean exportFilterDecisionNotSet = exportFilterDecision == null;
    					boolean exportFilterDecisionIsTrue = exportFilterDecision != null
    							&& exportFilterDecision.getCompositeProfileFilterMap() != null
    							&& exportFilterDecision.getCompositeProfileFilterMap().containsKey(compositeProfileDataModel.getModel().getId())
    							&& exportFilterDecision.getCompositeProfileFilterMap().get(compositeProfileDataModel.getModel().getId());

    					if (exportFilterDecisionNotSet || exportFilterDecisionIsTrue) {

    						boolean configurationIsOverridden = !exportFilterDecisionNotSet
    								&& exportFilterDecision.getOveriddedCompositeProfileMap() != null
    								&& exportFilterDecision.getOveriddedCompositeProfileMap().containsKey(compositeProfileDataModel.getModel().getId());

    						CompositeProfileExportConfiguration compositeProfileExportConfiguration = configurationIsOverridden ?
    								exportFilterDecision.getOveriddedCompositeProfileMap().get(compositeProfileDataModel.getModel().getId()) :
    								exportConfiguration.getCompositeProfileExportConfiguration();


    						Element compositeProfileElement = compositeProfileSerializationService.serializeCompositeProfile(compositeProfileDataModel, igDataModel, level+1, 0, compositeProfileExportConfiguration, false);

    						if (compositeProfileElement != null) {
    							compositeProfileRegistryElement.appendChild(compositeProfileElement);
    						}
    					}
    				}
                }
                return compositeProfileRegistryElement;
            } catch (Exception exception) {
            	exception.printStackTrace();
				throw new RegistrySerializationException(exception, section, null);
            }
    	
	}
	private Element SerializeProfileComponentRegistry(
    		Section section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision
	) throws RegistrySerializationException {
        Registry profileComponentRegistry = igDataModel.getModel().getProfileComponentRegistry();
        try {
            Element profileComponentRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
            if (profileComponentRegistry != null && !profileComponentRegistry.getChildren().isEmpty()) {
            	ArrayList<ProfileComponentDataModel> profileComponentDataModelsList = new ArrayList<>();
            	for (Link profileComponentLink : profileComponentRegistry.getChildren()) {

            		ProfileComponentDataModel profileComponentModel = igDataModel.getProfileComponents()
							.stream()
							.filter(dt -> profileComponentLink.getId().equals(dt.getModel().getId()))
							.findAny()
							.orElseThrow(() -> new ConformanceProfileNotFoundException(profileComponentLink.getId()));
            		profileComponentDataModelsList.add(profileComponentModel);
            	}
            	Collections.sort(profileComponentDataModelsList);

            	for(ProfileComponentDataModel profileComponentDataModel : profileComponentDataModelsList) {
					boolean exportFilterDecisionNotSet = exportFilterDecision == null;
					boolean exportFilterDecisionIsTrue = exportFilterDecision != null
							&& exportFilterDecision.getProfileComponentFilterMap() != null
							&& exportFilterDecision.getProfileComponentFilterMap().containsKey(profileComponentDataModel.getModel().getId())
							&& exportFilterDecision.getProfileComponentFilterMap().get(profileComponentDataModel.getModel().getId());

					if (exportFilterDecisionNotSet || exportFilterDecisionIsTrue) {

						boolean configurationIsOverridden = !exportFilterDecisionNotSet
								&& exportFilterDecision.getOveriddedProfileComponentMap() != null
								&& exportFilterDecision.getOveriddedProfileComponentMap().containsKey(profileComponentDataModel.getModel().getId());

						ProfileComponentExportConfiguration profileComponentExportConfiguration = configurationIsOverridden ?
								exportFilterDecision.getOveriddedProfileComponentMap().get(profileComponentDataModel.getModel().getId()) :
								exportConfiguration.getProfileComponentExportConfiguration();

						Element profileComponentElement = profileComponentSerializationService.serializeProfileComponent(
								profileComponentDataModel,
								igDataModel,
								level + 1,
								0,
								profileComponentExportConfiguration,
								false
						);

						if (profileComponentElement != null) {
							profileComponentRegistryElement.appendChild(profileComponentElement);
						}
					}
				}
            }
            return profileComponentRegistryElement;
        } catch (Exception exception) {
        	exception.printStackTrace();
            throw new RegistrySerializationException(exception, section, profileComponentRegistry);
        }
	}


    public Element SerializeCommonSection(Section section, int level, DocumentStructureDataModel documentStructureDataModel,
            ExportConfiguration exportConfiguration) {
        Element sectionElement = igDataModelSerializationService.getElement(Type.SECTION, section.getPosition(),
                section.getId(), section.getLabel());
        if (section.getDescription() != null && !section.getDescription().isEmpty()) {
            Element sectionContentElement = new Element("SectionContent");
            sectionContentElement.appendChild(frolaCleaning.cleanFroalaInput(section.getDescription()));
            sectionElement.appendChild(sectionContentElement);
        }
        sectionElement.addAttribute(new Attribute("type", section.getType() != null ? section.getType().name() : ""));
        sectionElement.addAttribute(new Attribute("h", String.valueOf(level)));
        return sectionElement;
    }

    @Override
    public Element SerializeTextSection(TextSection section, int level, DocumentStructureDataModel documentStructureDataModel,
            ExportConfiguration exportConfiguration) {
        Element textSectionElement = SerializeCommonSection(section, level, documentStructureDataModel, exportConfiguration);
        if (section.getChildren() != null) {
        	List<TextSection> sectionChildren = section.getChildren().stream().collect(Collectors.toList());
        	Collections.sort(sectionChildren);
            for (TextSection child : sectionChildren) {
                Element childElement = SerializeTextSection(child, level + 1, documentStructureDataModel, exportConfiguration);
                if (childElement != null) {
                    textSectionElement.appendChild(childElement);
                }
            }
        }
        return textSectionElement;

    }

    @Override
    public Element SerializeProfile(TextSection section, int level, DocumentStructureDataModel documentStructureDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Element profileElement = SerializeCommonSection(section, level, documentStructureDataModel, exportConfiguration);
        if (section.getChildren() != null) {
        	List<TextSection> sectionChildren = section.getChildren().stream().collect(Collectors.toList());
        	Collections.sort(sectionChildren);
            for (TextSection childSection : sectionChildren) {
                if (childSection != null) {
                    Element childSectionElement = SerializeSection(childSection, level + 1, documentStructureDataModel,
                            exportConfiguration, exportFilterDecision);
                    if (childSectionElement != null) {
                        profileElement.appendChild(childSectionElement);
                    }
                }
            }
        }
        return profileElement;
    }
   
    @SuppressWarnings("unchecked")
	@Override
    public Element SerializeDatatypeRegistry(Section section, int level, DocumentStructureDataModel documentStructureDataModel,
    		ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
    				throws RegistrySerializationException {
    	Registry datatypeRegistry = null;
    	try {
    		Element datatypeRegistryElement = SerializeCommonSection(section, level, documentStructureDataModel, exportConfiguration);
    		if(documentStructureDataModel instanceof IgDataModel) {
    			datatypeRegistry = ((IgDataModel) documentStructureDataModel).getModel().getDatatypeRegistry();
    			if (datatypeRegistry != null) {
    				if (!datatypeRegistry.getChildren().isEmpty()) {					
    					List<DatatypeDataModel> datatypeDataModelsList = ((IgDataModel) documentStructureDataModel).getDatatypes().stream().collect(Collectors.toList());
    					if(exportConfiguration.getCompositeProfileExportConfiguration().getGeneratedDatatypesFlavorsConfiguration().equals(GeneratedFlavorsConfiguration.NOEXPORT)) {
    						datatypeDataModelsList = datatypeDataModelsList.stream().filter((s) -> {
    								return !s.getModel().isGenerated();
    							}).collect(Collectors.toList());
    							Collections.sort(datatypeDataModelsList);
    							System.out.println("s");
    						
        					Collections.sort(datatypeDataModelsList);
    					}

    					for(DatatypeDataModel datatypeDataModel : datatypeDataModelsList) {
    							Element datatypeElement;
    							if(!datatypeDataModel.getModel().isGenerated()) {
    							if (exportFilterDecision != null && exportFilterDecision.getDatatypesFilterMap() != null
        								&& exportFilterDecision.getDatatypesFilterMap().containsKey(datatypeDataModel.getModel().getId())
        								&& exportFilterDecision.getDatatypesFilterMap().get(datatypeDataModel.getModel().getId())) {
    							if (exportFilterDecision != null && exportFilterDecision.getOveriddedDatatypesMap() != null
    									&& exportFilterDecision.getOveriddedDatatypesMap()
    									.containsKey(datatypeDataModel.getModel().getId())) {
    								datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
    										level + 1, 0,
    										exportFilterDecision.getOveriddedDatatypesMap().get(datatypeDataModel.getModel().getId()),documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());
    							} else {
    								datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
    										level + 1, 0,
    										exportConfiguration.getDatatypeExportConfiguration(), documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());
    							}
    							if (datatypeElement != null) {
    								datatypeRegistryElement.appendChild(datatypeElement);
    							}
    							}
    						
    					if(exportFilterDecision == null) {
//    							DatatypeDataModel datatypeDataModel = null;
    //
//    							datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
//    									.filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//    									.orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 


//    							Element datatypeElement;
    							datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
    									level + 1, 0,
    									exportConfiguration.getDatatypeExportConfiguration(), documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());

    							if (datatypeElement != null) {
    								datatypeRegistryElement.appendChild(datatypeElement);
    							}

    						}
    							} else {
    								datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
        									level + 1, 0,
        									exportConfiguration.getDatatypeExportConfiguration(), documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());

        							if (datatypeElement != null) {
        								datatypeRegistryElement.appendChild(datatypeElement);
        							}
    							}
    							}
    					}
    				}
    			}else 
    			if(documentStructureDataModel instanceof DatatypeLibraryDataModel) {
    			datatypeRegistry = ((DatatypeLibraryDataModel) documentStructureDataModel).getModel().getDatatypeRegistry();
    			if (datatypeRegistry != null) {
    				if (!datatypeRegistry.getChildren().isEmpty()) {					
    					ArrayList<DatatypeDataModel> datatypeDataModelsList = new ArrayList<>();

    					for (Link datatypeLink : datatypeRegistry.getChildren()) {
    						
    							DatatypeDataModel datatypeDataModel = null;

    							datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
    									.filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
    									.orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 

    							datatypeDataModelsList.add(datatypeDataModel);
    						}
    					
    					Collections.sort(datatypeDataModelsList);

    					for(DatatypeDataModel datatypeDataModel : datatypeDataModelsList) {
    							Element datatypeElement;
    							if (exportFilterDecision != null && exportFilterDecision.getDatatypesFilterMap() != null
        								&& exportFilterDecision.getDatatypesFilterMap().containsKey(datatypeDataModel.getModel().getId())
        								&& exportFilterDecision.getDatatypesFilterMap().get(datatypeDataModel.getModel().getId())) {
    							if (exportFilterDecision != null && exportFilterDecision.getOveriddedDatatypesMap() != null
    									&& exportFilterDecision.getOveriddedDatatypesMap()
    									.containsKey(datatypeDataModel.getModel().getId())) {
    								datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
    										level + 1, 0,
    										exportFilterDecision.getOveriddedDatatypesMap().get(datatypeDataModel.getModel().getId()),documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());
    							} else {
    								datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
    										level + 1, 0,
    										exportConfiguration.getDatatypeExportConfiguration(), documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());
    							}
    							if (datatypeElement != null) {
    								datatypeRegistryElement.appendChild(datatypeElement);
    							}
    							}
    						
    					if(exportFilterDecision == null) {
//    							DatatypeDataModel datatypeDataModel = null;
    //
//    							datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
//    									.filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//    									.orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 


//    							Element datatypeElement;
    							datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
    									level + 1, 0,
    									exportConfiguration.getDatatypeExportConfiguration(), documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());

    							if (datatypeElement != null) {
    								datatypeRegistryElement.appendChild(datatypeElement);
    							}

    						}}
    					}
    				}
    			}   
    		return datatypeRegistryElement;
    		


    	} catch (Exception exception) {
    		throw new RegistrySerializationException(exception, section, datatypeRegistry);
    	}
    }


    @Override
    public Element SerializeValuesetRegistry(Section section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Registry valuesetRegistry = igDataModel.getModel().getValueSetRegistry();
        try {
            Element valuesetRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
            if (valuesetRegistry != null) {
                if (!valuesetRegistry.getChildren().isEmpty()) {
                 	ArrayList<Link> sorted = new ArrayList<>(valuesetRegistry.getChildren());
                	Collections.sort(sorted);
                    for (Link valuesetLink : sorted) {
                        ValuesetDataModel valuesetDataModel = igDataModel.getValuesets().stream()
                                .filter(vs -> valuesetLink.getId().equals(vs.getModel().getId())).findAny()
                                .orElseThrow(() -> new ValuesetNotFoundException(valuesetLink.getId()));
                        // SerializableValuesetStructure serializableValuesetStructure =
                        // valuesetsMap.get(valuesetLink.getId());
                        Element valuesetElement;
                        if (exportFilterDecision != null && exportFilterDecision.getValueSetFilterMap() != null
                                && exportFilterDecision.getValueSetFilterMap().containsKey(valuesetLink.getId())
                                && exportFilterDecision.getValueSetFilterMap().get(valuesetLink.getId())) {
                            
                            if (exportFilterDecision != null && exportFilterDecision.getOveriddedValueSetMap().keySet()
                                    .contains(valuesetLink.getId())) {
                                valuesetElement = valuesetSerializationService.serializeValueSet(valuesetDataModel,
                                        level + 1, valuesetLink.getPosition(),
                                        exportFilterDecision.getOveriddedValueSetMap().get(valuesetLink.getId()), exportConfiguration.isDeltaMode());
                            } else {
                                valuesetElement = valuesetSerializationService.serializeValueSet(valuesetDataModel,
                                        level + 1, valuesetLink.getPosition(),
                                        exportConfiguration.getValueSetExportConfiguration(), exportConfiguration.isDeltaMode());
                            }
                            if (valuesetElement != null) {
                                valuesetRegistryElement.appendChild(valuesetElement);
                            }
                        } else if(exportFilterDecision == null) {
                            valuesetElement = valuesetSerializationService.serializeValueSet(valuesetDataModel,
                                    level + 1, valuesetLink.getPosition(),
                                    exportConfiguration.getValueSetExportConfiguration(), exportConfiguration.isDeltaMode());
                            if (valuesetElement != null) {
                                valuesetRegistryElement.appendChild(valuesetElement);
                            }
                        }
                        
                    }
                }
            }
            return valuesetRegistryElement;
        } catch (Exception exception) {
            throw new RegistrySerializationException(exception, section, valuesetRegistry);
        }
    }
    


    @Override
    public Element SerializeConformanceProfileRegistry(Section section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Registry conformanceProfileRegistry = igDataModel.getModel().getConformanceProfileRegistry();
        try {
            Element conformanceProfileRegistryElement = SerializeCommonSection(section, level, igDataModel,
                    exportConfiguration);
            if (conformanceProfileRegistry != null) {
				if (!conformanceProfileRegistry.getChildren().isEmpty()) {					
//					ArrayList<ConformanceProfileDataModel> conformanceProfileDataModelsList = new ArrayList<>();

//					for (Link conformanceProfileLink : conformanceProfileRegistry.getChildren()) {
//							ConformanceProfileDataModel conformanceProfileModel = null;
//
//							conformanceProfileModel = igDataModel.getConformanceProfiles().stream()
//									.filter(dt -> conformanceProfileLink.getId().equals(dt.getModel().getId())).findAny()
//									.orElseThrow(() -> new ConformanceProfileNotFoundException(conformanceProfileLink.getId())); 
//
//							conformanceProfileDataModelsList.add(conformanceProfileModel);
////						}
//					}
					List<ConformanceProfileDataModel> conformanceProfileDataModelsList = igDataModel.getConformanceProfiles().stream().collect(Collectors.toList());
					Collections.sort(conformanceProfileDataModelsList);

					for(ConformanceProfileDataModel conformanceProfileDataModel : conformanceProfileDataModelsList) {
							Element conformanceProfileElement;
							if (exportFilterDecision != null && exportFilterDecision.getConformanceProfileFilterMap() != null
									&& exportFilterDecision.getConformanceProfileFilterMap().containsKey(conformanceProfileDataModel.getModel().getId())
									&& exportFilterDecision.getConformanceProfileFilterMap().get(conformanceProfileDataModel.getModel().getId())) {
							if (exportFilterDecision != null && exportFilterDecision.getOveriddedConformanceProfileMap() != null
									&& exportFilterDecision.getOveriddedConformanceProfileMap()
									.containsKey(conformanceProfileDataModel.getModel().getId())) {
								conformanceProfileElement = conformanceProfileSerializationService.serializeConformanceProfile(conformanceProfileDataModel, igDataModel,
										level + 1, 0,
										exportFilterDecision.getOveriddedConformanceProfileMap().get(conformanceProfileDataModel.getModel().getId()), exportConfiguration.isDeltaMode());

							} else {
								conformanceProfileElement = conformanceProfileSerializationService.serializeConformanceProfile(conformanceProfileDataModel,igDataModel,
										level + 1, 0,
										exportConfiguration.getConformamceProfileExportConfiguration(), exportConfiguration.isDeltaMode());
							}
							if (conformanceProfileElement != null) {
								conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
							}
							}
						
					if(exportFilterDecision == null) {
						conformanceProfileElement = conformanceProfileSerializationService.serializeConformanceProfile(conformanceProfileDataModel,igDataModel,
									level + 1, 0,
									exportConfiguration.getConformamceProfileExportConfiguration(), exportConfiguration.isDeltaMode());

							if (conformanceProfileElement != null) {
								conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
							}

						}}
					}
				}
            return conformanceProfileRegistryElement;
        } catch (Exception exception) {
        	exception.printStackTrace();
            throw new RegistrySerializationException(exception, section, conformanceProfileRegistry);
        }

    }

    @SuppressWarnings("unchecked")
	@Override
    public Element SerializeSegmentRegistry(Section section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Registry segmentRegistry = igDataModel.getModel().getSegmentRegistry();
        try {
            Element segmentRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
            if (segmentRegistry != null) {
				if (!segmentRegistry.getChildren().isEmpty()) {					
//					ArrayList<SegmentDataModel> segmentDataModelsList = new ArrayList<>();
//
//					for (Link segmentLink : segmentRegistry.getChildren()) {
//							SegmentDataModel segmentDataModel = null;
//
//							segmentDataModel = igDataModel.getSegments().stream()
//									.filter(s -> segmentLink.getId().equals(s.getModel().getId())).findAny()
//									.orElseThrow(() -> new SegmentNotFoundException(segmentLink.getId())); 
//
//							segmentDataModelsList.add(segmentDataModel);
//						
//					}
					List<SegmentDataModel> segmentDataModelsList = igDataModel.getSegments().stream().collect(Collectors.toList());
					Collections.sort(segmentDataModelsList);
					System.out.println("s");

		
					
					if(exportConfiguration.getCompositeProfileExportConfiguration().getGeneratedSegmentsFlavorsConfiguration().equals(GeneratedFlavorsConfiguration.NOEXPORT)) {
						segmentDataModelsList = segmentDataModelsList.stream().filter((s) -> {
							return !s.getModel().isGenerated();
						}).collect(Collectors.toList());
						Collections.sort(segmentDataModelsList);
						System.out.println("s");
					}
					

					for(SegmentDataModel segmentDataModel : segmentDataModelsList) {
							Element segmentElement;
							if(!segmentDataModel.getModel().isGenerated()) {
							if (exportFilterDecision != null && exportFilterDecision.getSegmentFilterMap() != null
									&& exportFilterDecision.getSegmentFilterMap().containsKey(segmentDataModel.getModel().getId())
									&& exportFilterDecision.getSegmentFilterMap().get(segmentDataModel.getModel().getId())) {
							if (exportFilterDecision != null && exportFilterDecision.getOveriddedSegmentMap() != null
									&& exportFilterDecision.getOveriddedSegmentMap()
									.containsKey(segmentDataModel.getModel().getId())) {
								segmentElement = segmentSerializationService.serializeSegment(igDataModel,segmentDataModel,
										level + 1, 0, exportFilterDecision.getOveriddedSegmentMap().get(segmentDataModel.getModel().getId()), exportFilterDecision, exportConfiguration.isDeltaMode());
							} else {
								segmentElement = segmentSerializationService.serializeSegment(igDataModel, segmentDataModel,
										level + 1, 0,
										exportConfiguration.getSegmentExportConfiguration(), exportFilterDecision, exportConfiguration.isDeltaMode());
							}
							if (segmentElement != null) {
								segmentRegistryElement.appendChild(segmentElement);
							}
							}
					if(exportFilterDecision == null) {
						segmentElement = segmentSerializationService.serializeSegment(igDataModel,segmentDataModel,
									level + 1, 0,
									exportConfiguration.getSegmentExportConfiguration(),exportFilterDecision , exportConfiguration.isDeltaMode());

							if (segmentElement != null) {
								segmentRegistryElement.appendChild(segmentElement);
							}
						}
							} else {
								segmentElement = segmentSerializationService.serializeSegment(igDataModel,segmentDataModel,
										level + 1, 0,
										exportConfiguration.getSegmentExportConfiguration(),exportFilterDecision , false);

								if (segmentElement != null) {
									segmentRegistryElement.appendChild(segmentElement);
								}
							}
						}
					}
				}
            return segmentRegistryElement;
        } catch (Exception exception) {
            throw new RegistrySerializationException(exception, section, segmentRegistry);
        }

    }





}
