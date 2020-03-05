package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DatatypeExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ConformanceProfileDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
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
    private ValuesetSerializationService valuesetSerializationService;
    
    @Autowired
    private FroalaSerializationUtil frolaCleaning;


    @Override
    public Element SerializeSection(Section section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Element serializedSection = null;
        if (Type.TEXT.equals(section.getType())) {
            serializedSection = SerializeTextSection((TextSection) section, level, igDataModel, exportConfiguration);
        } else if (Type.PROFILE.equals(section.getType())) {
            serializedSection = SerializeProfile((TextSection) section, level, igDataModel, exportConfiguration,
                    exportFilterDecision);
        } else if (Type.DATATYPEREGISTRY.equals(section.getType())) {
            serializedSection = SerializeDatatypeRegistry(section, level, igDataModel, exportConfiguration,
                    exportFilterDecision);
        } else if (Type.SEGMENTREGISTRY.equals(section.getType())) {
            if (exportConfiguration.isIncludeSegmentTable()) {
                serializedSection = SerializeSegmentRegistry(section, level, igDataModel, exportConfiguration,
                        exportFilterDecision);
            }
        } else if (Type.CONFORMANCEPROFILEREGISTRY.equals(section.getType())) {
            if (exportConfiguration.isIncludeMessageTable()) {
                serializedSection = SerializeConformanceProfileRegistry(section, level, igDataModel,
                        exportConfiguration, exportFilterDecision);

            }
        } else if (Type.VALUESETREGISTRY.equals(section.getType())) {
            if (exportConfiguration.isIncludeValuesetsTable()) {
                serializedSection = SerializeValuesetRegistry(section, level, igDataModel, exportConfiguration,
                        exportFilterDecision);
            }
        }
        // } else if (Type.PROFILECOMPONENTREGISTRY.equals(section.getType())) {
        // if(exportConfiguration.isIncludeProfileComponentTable()) {
        // //TODO add profile component registry serialization
        // }
        // } else if (Type.COMPOSITEPROFILEREGISTRY.equals(section.getType())) {
        // if(exportConfiguration.isIncludeCompositeProfileTable()) {
        // //TODO add composite profile registry serialization
        // }

        return serializedSection;
    }
    //
    // }

    public Element SerializeCommonSection(Section section, int level, IgDataModel igDataModel,
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
    public Element SerializeTextSection(TextSection section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration) {
        Element textSectionElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
        if (section.getChildren() != null) {
            for (TextSection child : section.getChildren()) {
                Element childElement = SerializeTextSection(child, level + 1, igDataModel, exportConfiguration);
                if (childElement != null) {
                    textSectionElement.appendChild(childElement);
                }
            }
        }
        return textSectionElement;

    }

    @Override
    public Element SerializeProfile(TextSection section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Element profileElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
        if (section.getChildren() != null) {
            for (TextSection childSection : section.getChildren()) {
                if (childSection != null) {
                    Element childSectionElement = SerializeSection(childSection, level + 1, igDataModel,
                            exportConfiguration, exportFilterDecision);
                    if (childSectionElement != null) {
                        profileElement.appendChild(childSectionElement);
                    }
                }
            }
        }
        return profileElement;
    }

    @Override
    public Element SerializeDatatypeRegistry(Section section, int level, IgDataModel igDataModel,
            ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
            throws RegistrySerializationException {
        Registry datatypeRegistry = igDataModel.getModel().getDatatypeRegistry();
        try {
            Element datatypeRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
            if (datatypeRegistry != null) {
                if (!datatypeRegistry.getChildren().isEmpty()) {
                    for (Link datatypeLink : datatypeRegistry.getChildren()) {
                        if (exportFilterDecision != null && exportFilterDecision.getDatatypesFilterMap() != null
                                && exportFilterDecision.getDatatypesFilterMap().containsKey(datatypeLink.getId())
                                && exportFilterDecision.getDatatypesFilterMap().get(datatypeLink.getId())) {
                            DatatypeDataModel datatypeDataModel = igDataModel.getDatatypes().stream()
                                    .filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
                                    .orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId()));
                            Element datatypeElement;
                            if (exportFilterDecision != null && exportFilterDecision.getOveriddedDatatypesMap() != null
                                    && exportFilterDecision.getOveriddedDatatypesMap()
                                            .containsKey(datatypeLink.getId())) {
                                datatypeElement = datatypeSerializationService.serializeDatatype(igDataModel.getModel().getId(),datatypeDataModel,
                                        level + 1, datatypeLink.getPosition(),
                                        exportFilterDecision.getOveriddedDatatypesMap().get(datatypeLink.getId()));
                            } else {
                                datatypeElement = datatypeSerializationService.serializeDatatype(igDataModel.getModel().getId(),datatypeDataModel,
                                        level + 1, datatypeLink.getPosition(),
                                        exportConfiguration.getDatatypeExportConfiguration());
                            }
                            if (datatypeElement != null) {
                                datatypeRegistryElement.appendChild(datatypeElement);
                            }
                        } else if(exportFilterDecision == null) {
                            DatatypeDataModel datatypeDataModel = igDataModel.getDatatypes().stream()
                                    .filter(dt -> datatypeLink.getId().equals(dt.getModel().getId())).findAny()
                                    .orElseThrow(() -> new DatatypeNotFoundException(datatypeLink.getId()));
                            Element datatypeElement;
                                datatypeElement = datatypeSerializationService.serializeDatatype(igDataModel.getModel().getId(),datatypeDataModel,
                                        level + 1, datatypeLink.getPosition(),
                                        exportConfiguration.getDatatypeExportConfiguration());
                            
                            if (datatypeElement != null) {
                                datatypeRegistryElement.appendChild(datatypeElement);
                            }
                        
                        }
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
                    for (Link valuesetLink : valuesetRegistry.getChildren()) {
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
                                        exportFilterDecision.getOveriddedValueSetMap().get(valuesetLink.getId()));
                            } else {
                                valuesetElement = valuesetSerializationService.serializeValueSet(valuesetDataModel,
                                        level + 1, valuesetLink.getPosition(),
                                        exportConfiguration.getValueSetExportConfiguration());
                            }
                            if (valuesetElement != null) {
                                valuesetRegistryElement.appendChild(valuesetElement);
                            }
                        } else if(exportFilterDecision == null) {
                            valuesetElement = valuesetSerializationService.serializeValueSet(valuesetDataModel,
                                    level + 1, valuesetLink.getPosition(),
                                    exportConfiguration.getValueSetExportConfiguration());
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
                    for (Link conformanceProfileLink : conformanceProfileRegistry.getChildren()) {
                        ConformanceProfileDataModel conformanceProfileDataModel = igDataModel
                                .getConformanceProfiles().stream()
                                .filter(cp -> conformanceProfileLink.getId().equals(cp.getModel().getId()))
                                .findAny().orElseThrow(() -> new ConformanceProfileNotFoundException(
                                        conformanceProfileLink.getId()));
                        Element conformanceProfileElement;
                        if (exportFilterDecision != null
                                && exportFilterDecision.getConformanceProfileFilterMap() != null
                                && exportFilterDecision.getConformanceProfileFilterMap()
                                        .containsKey(conformanceProfileLink.getId())
                                && exportFilterDecision.getConformanceProfileFilterMap()
                                        .get(conformanceProfileLink.getId())) {
                    
                            if (exportFilterDecision != null && exportFilterDecision.getOveriddedConformanceProfileMap()
                                    .keySet().contains(conformanceProfileLink.getId())) {
                                conformanceProfileElement = conformanceProfileSerializationService
                                        .serializeConformanceProfile(conformanceProfileDataModel, igDataModel,
                                                level + 1, conformanceProfileLink.getPosition(),
                                                exportFilterDecision.getOveriddedConformanceProfileMap()
                                                        .get(conformanceProfileLink.getId()));
                            } else {
                                conformanceProfileElement = conformanceProfileSerializationService
                                        .serializeConformanceProfile(conformanceProfileDataModel, igDataModel,
                                                level + 1, conformanceProfileLink.getPosition(),
                                                exportConfiguration.getConformamceProfileExportConfiguration());
                            }
                            if (conformanceProfileElement != null) {
                                conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
                            }
                        } else if(exportFilterDecision == null) {
                             conformanceProfileElement = conformanceProfileSerializationService
                                    .serializeConformanceProfile(conformanceProfileDataModel, igDataModel,
                                            level + 1, conformanceProfileLink.getPosition(),
                                            exportConfiguration.getConformamceProfileExportConfiguration());
                             if (conformanceProfileElement != null) {
                                    conformanceProfileRegistryElement.appendChild(conformanceProfileElement);
                                }
                        }
                    }
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

            // In case need to go back to this again.
            // List<ValuesetDataModel> sortedList = vsMap.keySet().stream().sorted(new
            // Comparator<ValuesetDataModel>() {
            // public int compare(ValuesetDataModel vsDm1, ValuesetDataModel vsDm2) {
            // return vsDm1.getModel().getLabel().compareTo(vsDm2.getModel().getLabel());
            // };
            // }).collect(Collectors.toList());

            Element segmentRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
            if (segmentRegistry != null) {
                if (segmentRegistry.getChildren() != null && !segmentRegistry.getChildren().isEmpty()) {
                    for (Link segmentLink : segmentRegistry.getChildren()) {
                        if (exportFilterDecision != null
                                && exportFilterDecision.getSegmentFilterMap().containsKey(segmentLink.getId())
                                && exportFilterDecision.getSegmentFilterMap().get(segmentLink.getId())) {
                            SegmentDataModel segmentDataModel = igDataModel.getSegments().stream()
                                    .filter(seg -> segmentLink.getId().equals(seg.getModel().getId())).findAny()
                                    .orElseThrow(() -> new SegmentNotFoundException(segmentLink.getId()));
                            Segment segment = segmentDataModel.getModel();
                            Element segmentElement;
                            if (exportFilterDecision != null && exportFilterDecision.getOveriddedSegmentMap().keySet()
                                    .contains(segmentLink.getId())) {
                                segmentElement = segmentSerializationService.serializeSegment(igDataModel,
                                        segmentDataModel, level + 1, segmentLink.getPosition(),
                                        exportFilterDecision.getOveriddedSegmentMap().get(segmentLink.getId()), exportFilterDecision);
                            } else {
                                segmentElement = segmentSerializationService.serializeSegment(igDataModel,
                                        segmentDataModel, level + 1, segmentLink.getPosition(),
                                        exportConfiguration.getSegmentExportConfiguration(), exportFilterDecision);
                            }
                            if (segmentElement != null) {
                                segmentRegistryElement.appendChild(segmentElement);
                            }
                        } else if(exportFilterDecision == null) {
                            SegmentDataModel segmentDataModel = igDataModel.getSegments().stream()
                                    .filter(seg -> segmentLink.getId().equals(seg.getModel().getId())).findAny()
                                    .orElseThrow(() -> new SegmentNotFoundException(segmentLink.getId()));
                            Segment segment = segmentDataModel.getModel();
                            Element segmentElement;
                                segmentElement = segmentSerializationService.serializeSegment(igDataModel,
                                        segmentDataModel, level + 1, segmentLink.getPosition(),
                                        exportConfiguration.getSegmentExportConfiguration(), exportFilterDecision);
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
