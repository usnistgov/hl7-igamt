package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

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
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DatatypeExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
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
//         	else if (Type.COMPOSITEPROFILEREGISTRY.equals(section.getType())) {
//                serializedSection = SerializeCompositeProfileRegistry(section, level, (IgDataModel) documentStructureDataModel, exportConfiguration,
//                        exportFilterDecision);
//            } 
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
    private Element SerializeProfileComponentRegistry(Section section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException {

        Registry profileComponentRegistry = igDataModel.getModel().getProfileComponentRegistry();
        try {
            Element profileComponentRegistryElement = SerializeCommonSection(section, level, igDataModel,
                    exportConfiguration);
            if (profileComponentRegistry != null) {
				if (!profileComponentRegistry.getChildren().isEmpty()) {					
					ArrayList<ProfileComponentDataModel> profileComponentDataModelsList = new ArrayList<>();

					for (Link profileComponentLink : profileComponentRegistry.getChildren()) {
//						if (exportFilterDecision != null && exportFilterDecision.getConformanceProfileFilterMap() != null
//								&& exportFilterDecision.getConformanceProfileFilterMap().containsKey(conformanceProfileLink.getId())
//								&& exportFilterDecision.getConformanceProfileFilterMap().get(conformanceProfileLink.getId())) {
							ProfileComponentDataModel profileComponentModel = null;

							profileComponentModel = igDataModel.getProfileComponents().stream()
									.filter(dt -> profileComponentLink.getId().equals(dt.getModel().getId())).findAny()
									.orElseThrow(() -> new ConformanceProfileNotFoundException(profileComponentLink.getId())); 

							profileComponentDataModelsList.add(profileComponentModel);
//						}
					}
					Collections.sort(profileComponentDataModelsList);

					for(ProfileComponentDataModel conformanceProfileDataModel : profileComponentDataModelsList) {
							Element profileComponentElement;
							if (exportFilterDecision != null && exportFilterDecision.getProfileComponentFilterMap() != null
									&& exportFilterDecision.getProfileComponentFilterMap().containsKey(conformanceProfileDataModel.getModel().getId())
									&& exportFilterDecision.getProfileComponentFilterMap().get(conformanceProfileDataModel.getModel().getId())) {
							if (exportFilterDecision != null && exportFilterDecision.getOveriddedProfileComponentMap() != null
									&& exportFilterDecision.getOveriddedProfileComponentMap()
									.containsKey(conformanceProfileDataModel.getModel().getId())) {
								profileComponentElement = profileComponentSerializationService.serializeProfileComponent(conformanceProfileDataModel, igDataModel,
										level + 1, 0,
										exportFilterDecision.getOveriddedProfileComponentMap().get(conformanceProfileDataModel.getModel().getId()), false);
								System.out.println("We in the IF else 2");

							} else {
								System.out.println("We in the IF else 2");
								profileComponentElement = profileComponentSerializationService.serializeProfileComponent(conformanceProfileDataModel, igDataModel, level+1, 0, exportConfiguration.getProfileComponentExportConfiguration(), false);
							}
							if (profileComponentElement != null) {
								profileComponentRegistryElement.appendChild(profileComponentElement);
							}
							}
						
					if(exportFilterDecision == null) {
//							DatatypeDataModel datatypeDataModel = null;
//
//							datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
//									.filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//									.orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 


//							Element datatypeElement;
						profileComponentElement = profileComponentSerializationService.serializeProfileComponent(conformanceProfileDataModel,igDataModel,
									level + 1, 0,
									exportConfiguration.getProfileComponentExportConfiguration(), false);

							if (profileComponentElement != null) {
								profileComponentRegistryElement.appendChild(profileComponentElement);
							}

						}}
					}
				}
            return profileComponentRegistryElement;
        } catch (Exception exception) {
        	exception.printStackTrace();
            throw new RegistrySerializationException(exception, section, profileComponentRegistry);
        }

    
	}
	//
    // }

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
            for (TextSection child : section.getChildren()) {
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
            for (TextSection childSection : section.getChildren()) {
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

//    @Override
//    public Element SerializeDatatypeRegistry(Section section, int level, DocumentStructureDataModel documentStructureDataModel,
//            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
//            throws RegistrySerializationException {
//    		Registry datatypeRegistry = null;
//        if(documentStructureDataModel instanceof IgDataModel) {
//         datatypeRegistry = ((IgDataModel) documentStructureDataModel).getModel().getDatatypeRegistry();
//        }else if(documentStructureDataModel instanceof DatatypeLibraryDataModel) {
//             datatypeRegistry = ((DatatypeLibraryDataModel) documentStructureDataModel).getModel().getDatatypeRegistry();
//        }
//        try {
//            Element datatypeRegistryElement = SerializeCommonSection(section, level, documentStructureDataModel, exportConfiguration);
//            if (datatypeRegistry != null) {
//                if (!datatypeRegistry.getChildren().isEmpty()) {
//                	ArrayList<Link> sorted = new ArrayList<>(datatypeRegistry.getChildren());
//                	Collections.sort(sorted);
//                    for (Link datatypeLink : sorted) {
//                        if (exportFilterDecision != null && exportFilterDecision.getDatatypesFilterMap() != null
//                                && exportFilterDecision.getDatatypesFilterMap().containsKey(datatypeLink.getId())
//                                && exportFilterDecision.getDatatypesFilterMap().get(datatypeLink.getId())) {
//                        	DatatypeDataModel datatypeDataModel = null;
//                        	
//                        	if(documentStructureDataModel instanceof IgDataModel) {
//                        		datatypeDataModel = ((IgDataModel) documentStructureDataModel).getDatatypes().stream()
//                                        .filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//                                        .orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId()));
//                        		}else if(documentStructureDataModel instanceof DatatypeLibraryDataModel) {
//                        			datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
//                                            .filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//                                            .orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 
//
//                        			}
//                        	
//                            Element datatypeElement;
//                            if (exportFilterDecision != null && exportFilterDecision.getOveriddedDatatypesMap() != null
//                                    && exportFilterDecision.getOveriddedDatatypesMap()
//                                            .containsKey(datatypeLink.getId())) {
//                                datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
//                                        level + 1, datatypeLink.getPosition(),
//                                        exportFilterDecision.getOveriddedDatatypesMap().get(datatypeLink.getId()),documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());
//                            } else {
//                                datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
//                                        level + 1, datatypeLink.getPosition(),
//                                        exportConfiguration.getDatatypeExportConfiguration(), documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());
//                            }
//                            if (datatypeElement != null) {
//                                datatypeRegistryElement.appendChild(datatypeElement);
//                            }
//                        } else if(exportFilterDecision == null) {
//           	DatatypeDataModel datatypeDataModel = null;
//                        	
//                        	if(documentStructureDataModel instanceof IgDataModel) {
//                        		datatypeDataModel = ((IgDataModel) documentStructureDataModel).getDatatypes().stream()
//                                        .filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//                                        .orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId()));
//                        		}else if(documentStructureDataModel instanceof DatatypeLibraryDataModel) {
//                        			datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
//                                            .filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//                                            .orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 
//                        			}
//                          
//                            Element datatypeElement;
//                                datatypeElement = datatypeSerializationService.serializeDatatype(documentStructureDataModel.getModel().getId(),datatypeDataModel,
//                                        level + 1, datatypeLink.getPosition(),
//                                        exportConfiguration.getDatatypeExportConfiguration(), documentStructureDataModel.getModel().getType(), exportConfiguration.isDeltaMode());
//                            
//                            if (datatypeElement != null) {
//                                datatypeRegistryElement.appendChild(datatypeElement);
//                            }
//                        
//                        }
//                    }
//                }
//            }
//            return datatypeRegistryElement;
//        } catch (Exception exception) {
//            throw new RegistrySerializationException(exception, section, datatypeRegistry);
//        }
//    }
//    
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
    					ArrayList<DatatypeDataModel> datatypeDataModelsList = new ArrayList<>();

    					for (Link datatypeLink : datatypeRegistry.getChildren()) {
    					
    							DatatypeDataModel datatypeDataModel = null;

    							datatypeDataModel = ((IgDataModel) documentStructureDataModel).getDatatypes().stream()
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
    
//    @Override
//    public Element SerializeConformanceProfileRegistry(Section section, int level, IgDataModel igDataModel,
//            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
//            throws RegistrySerializationException {
//        Registry conformanceProfileRegistry = igDataModel.getModel().getConformanceProfileRegistry();
//        try {
//            Element conformanceProfileRegistryElement = SerializeCommonSection(section, level, igDataModel,
//                    exportConfiguration);
//            if (conformanceProfileRegistry != null) {
//                if (!conformanceProfileRegistry.getChildren().isEmpty()) {
//                	ArrayList<Link> sorted = new ArrayList<>(conformanceProfileRegistry.getChildren());
//                	Collections.sort(sorted);
//                    for (Link conformanceProfileLink : sorted) {
//                        ConformanceProfileDataModel conformanceProfileDataModel = igDataModel
//                                .getConformanceProfiles().stream()
//                                .filter(cp -> conformanceProfileLink.getId().equals(cp.getModel().getId()))
//                                .findAny().orElseThrow(() -> new ConformanceProfileNotFoundException(
//                                        conformanceProfileLink.getId()));
//                        Element conformanceProfileElement;
//                        if (exportFilterDecision != null
//                                && exportFilterDecision.getConformanceProfileFilterMap() != null
//                                && exportFilterDecision.getConformanceProfileFilterMap()
//                                        .containsKey(conformanceProfileLink.getId())
//                                && exportFilterDecision.getConformanceProfileFilterMap()
//                                        .get(conformanceProfileLink.getId())) {
//                    
//                            if (exportFilterDecision != null && exportFilterDecision.getOveriddedConformanceProfileMap()
//                                    .keySet().contains(conformanceProfileLink.getId())) {
//                                conformanceProfileElement = conformanceProfileSerializationService
//                                        .serializeConformanceProfile(conformanceProfileDataModel, igDataModel,
//                                                level + 1, conformanceProfileLink.getPosition(),
//                                                exportFilterDecision.getOveriddedConformanceProfileMap()
//                                                        .get(conformanceProfileLink.getId()), exportConfiguration.isDeltaMode());
//                            } else {
//                                conformanceProfileElement = conformanceProfileSerializationService
//                                        .serializeConformanceProfile(conformanceProfileDataModel, igDataModel,
//                                                level + 1, conformanceProfileLink.getPosition(),
//                                                exportConfiguration.getConformamceProfileExportConfiguration(), exportConfiguration.isDeltaMode());
//                            }
//                            if (conformanceProfileElement != null) {
//                                conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
//                            }
//                        } else if(exportFilterDecision == null) {
//                             conformanceProfileElement = conformanceProfileSerializationService
//                                    .serializeConformanceProfile(conformanceProfileDataModel, igDataModel,
//                                            level + 1, conformanceProfileLink.getPosition(),
//                                            exportConfiguration.getConformamceProfileExportConfiguration(), exportConfiguration.isDeltaMode());
//                             if (conformanceProfileElement != null) {
//                                    conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
//                                }
//                        }
//                    }
//                }
//            }
//            return conformanceProfileRegistryElement;
//        } catch (Exception exception) {
//        	exception.printStackTrace();
//            throw new RegistrySerializationException(exception, section, conformanceProfileRegistry);
//        }
//
//    }

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
					ArrayList<ConformanceProfileDataModel> conformanceProfileDataModelsList = new ArrayList<>();

					for (Link conformanceProfileLink : conformanceProfileRegistry.getChildren()) {
//						if (exportFilterDecision != null && exportFilterDecision.getConformanceProfileFilterMap() != null
//								&& exportFilterDecision.getConformanceProfileFilterMap().containsKey(conformanceProfileLink.getId())
//								&& exportFilterDecision.getConformanceProfileFilterMap().get(conformanceProfileLink.getId())) {
							ConformanceProfileDataModel conformanceProfileModel = null;

							conformanceProfileModel = igDataModel.getConformanceProfiles().stream()
									.filter(dt -> conformanceProfileLink.getId().equals(dt.getModel().getId())).findAny()
									.orElseThrow(() -> new ConformanceProfileNotFoundException(conformanceProfileLink.getId())); 

							conformanceProfileDataModelsList.add(conformanceProfileModel);
//						}
					}
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
								System.out.println("We in the IF else 2");

							} else {
								System.out.println("We in the IF else 2");
								conformanceProfileElement = conformanceProfileSerializationService.serializeConformanceProfile(conformanceProfileDataModel,igDataModel,
										level + 1, 0,
										exportConfiguration.getConformamceProfileExportConfiguration(), exportConfiguration.isDeltaMode());
							}
							if (conformanceProfileElement != null) {
								conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
							}
							}
						
					if(exportFilterDecision == null) {
//							DatatypeDataModel datatypeDataModel = null;
//
//							datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
//									.filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//									.orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 


//							Element datatypeElement;
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

    @Override
    public Element SerializeSegmentRegistry(Section section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Registry segmentRegistry = igDataModel.getModel().getSegmentRegistry();
        try {
            Element segmentRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
            if (segmentRegistry != null) {
				if (!segmentRegistry.getChildren().isEmpty()) {					
					ArrayList<SegmentDataModel> segmentDataModelsList = new ArrayList<>();

					for (Link segmentLink : segmentRegistry.getChildren()) {
							SegmentDataModel segmentDataModel = null;

							segmentDataModel = igDataModel.getSegments().stream()
									.filter(s -> segmentLink.getId().equals(s.getModel().getId())).findAny()
									.orElseThrow(() -> new SegmentNotFoundException(segmentLink.getId())); 

							segmentDataModelsList.add(segmentDataModel);
						
					}
					Collections.sort(segmentDataModelsList);

					for(SegmentDataModel segmentDataModel : segmentDataModelsList) {
							Element segmentElement;
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
//							DatatypeDataModel datatypeDataModel = null;
//
//							datatypeDataModel = ((DatatypeLibraryDataModel) documentStructureDataModel).getDatatypes().stream()
//									.filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
//									.orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId())); 


//							Element datatypeElement;
						segmentElement = segmentSerializationService.serializeSegment(igDataModel,segmentDataModel,
									level + 1, 0,
									exportConfiguration.getSegmentExportConfiguration(),exportFilterDecision , exportConfiguration.isDeltaMode());

							if (segmentElement != null) {
								segmentRegistryElement.appendChild(segmentElement);
							}
						}}
					}
				}
            return segmentRegistryElement;
        } catch (Exception exception) {
            throw new RegistrySerializationException(exception, section, segmentRegistry);
        }

    }





}
