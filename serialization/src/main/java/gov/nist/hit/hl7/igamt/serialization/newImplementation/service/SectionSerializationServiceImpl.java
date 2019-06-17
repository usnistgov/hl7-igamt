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
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;

import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class SectionSerializationServiceImpl implements SectionSerializationService {
	
	  private Set<Element> conformanceStatements = new HashSet<>();
	  private Set<Element> predicates = new HashSet<>();

	@Autowired
	private IgDataModelSerializationService igDataModelSerializationService;
	
	@Override
	public Element SerializeSection(Section section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration) {
		Element serializedSection = null;			
		 if (Type.TEXT.equals(section.getType())) {
		       serializedSection = SerializeTextSection((TextSection) section, level, igDataModel, exportConfiguration);
		    } else if (Type.PROFILE.equals(section.getType())) {
		    		serializedSection =  SerializeProfile((TextSection) section, level, igDataModel, exportConfiguration);
		    }
//		    } else if (Type.DATATYPEREGISTRY.equals(section.getType())) {
//		      if(exportConfiguration.isIncludeDatatypeTable()) {
//		    	  serializedSection =  SerializeDatatypeRegistry(section, level, igDataModel.getModel().getDatatypeRegistry(), igDataModel, exportConfiguration);
//		      }
//		    } else if (Type.VALUESETREGISTRY.equals(section.getType())) {
//		      if(exportConfiguration.isIncludeValuesetsTable()) {
//		        serializableSection =
//		            new SerializableValuesetRegistry(section, level, valueSetRegistry, valuesetsMap, bindedValueSets, exportConfiguration.getMaxCodeNumber());
//		      }
//		    } else if (Type.SEGMENTREGISTRY.equals(section.getType())) {
//		      if(exportConfiguration.isIncludeSegmentTable()) {
//		      serializableSection = new SerializableSegmentRegistry(section, level, segmentRegistry,
//		          segmentsMap,datatypesMap, datatypeNamesMap, valuesetNamesMap, valuesetLabelMap, bindedSegments, bindedFields, coConstraintService, exportConfiguration);
//		      }
//		    } else if (Type.CONFORMANCEPROFILEREGISTRY.equals(section.getType())) {
//		      if(exportConfiguration.isIncludeMessageTable()) {
//		      serializableSection = new SerializableConformanceProfileRegistry(section, level,
//		          conformanceProfileRegistry, conformanceProfilesMap, segmentsMap, valuesetNamesMap, valuesetLabelMap, bindedGroupsAndSegmentRefs);
//		      }
//		    } else if (Type.PROFILECOMPONENTREGISTRY.equals(section.getType())) {
//		      if(exportConfiguration.isIncludeProfileComponentTable()) {
//		        //TODO add profile component registry serialization
//		      }
//		    } else if (Type.COMPOSITEPROFILEREGISTRY.equals(section.getType())) {
//		      if(exportConfiguration.isIncludeCompositeProfileTable()) {
//		        //TODO add composite profile registry serialization
//		      }
		 return serializedSection;
		    } 
//		    
//}

	
	public Element SerializeCommonSection(Section section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration) {
	    Element sectionElement = igDataModelSerializationService.getElement(Type.SECTION, section.getPosition(), section.getId(), section.getLabel());
	    if(section.getDescription() != null && !section.getDescription().isEmpty()) {
	      Element sectionContentElement = new Element("SectionContent");
	      sectionContentElement.appendChild(section.getDescription());
	      sectionElement.appendChild(sectionContentElement);
	    }
	    sectionElement.addAttribute(
	        new Attribute("type", section.getType() != null ? section.getType().name() : ""));
	    sectionElement.addAttribute(new Attribute("h", String.valueOf(level)));
	    return sectionElement;
	  
	}
	

	@Override
	public Element SerializeTextSection(TextSection section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration) {
	    Element textSectionElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
	    if (section.getChildren() != null) {
	      for (TextSection child : section.getChildren()) {
	        Element childElement = SerializeTextSection(child, level+1, igDataModel, exportConfiguration);
	        if (childElement != null) {
	          textSectionElement.appendChild(childElement);
	        }
	      }
	    }
	    return textSectionElement;
	  
	}

	@Override
	public Element SerializeProfile(TextSection section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration) {
	    Element profileElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
	    if (section.getChildren() != null) {
	      for (TextSection childSection : section.getChildren()) {
	        if (childSection != null) {
	          Element childSectionElement = SerializeSection(childSection, level+1, igDataModel, exportConfiguration);
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
			ExportConfiguration exportConfiguration) {
//	    Registry datatypeRegistry = igDataModel.getModel().getDatatypeRegistry();
//	    try {
//	      Element datatypeRegistryElement = SerializeCommonSection(section, level, igDataModel, exportConfiguration);
//	      if (datatypeRegistry != null) {
//	        if (!datatypeRegistry.getChildren().isEmpty()) {
//	          for (Link datatypeLink : datatypeRegistry.getChildren()) {
//	        	  	for(DatatypeDataModel datatypeDataModel : igDataModel.getDatatypes()) {
//	              if (datatypeDataModel.getModel().getId().equals(datatypeLink.getId())) {
//	                Datatype datatype = datatypeDataModel.getModel();
//	                SerializableDatatype serializableDatatype =
//	                    new SerializableDatatype(datatype, String.valueOf(datatypeLink.getPosition()),
//	                        this.getChildLevel(), datatypeNamesMap, valuesetNamesMap, valuesetLabelMap, bindedComponents);
//	                if(serializableDatatype != null) {
//	                  this.serializableDatatypes.add(serializableDatatype);
//	                  Element datatypeElement = serializableDatatype.serialize();
//	                  if (datatypeElement != null) {
//	                    datatypeRegistryElement.appendChild(datatypeElement);
//	                  }
//	                }
//	              } else {
//	                throw new DatatypeNotFoundException(datatypeLink.getId());
//	              }
//	          }
//	          }
//	        }
//	      }
//	      return datatypeRegistryElement;
//	    } catch (Exception exception) {
//	      throw new RegistrySerializationException(exception, super.getSection(), datatypeRegistry);
//	    }
	  return null;
	}
	
	

	@Override
	public Element SerializeValuesetRegistry(Section section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Element SerializeSegmentRegistry(Section section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Element SerializeConformanceProfileRegistry(Section section, int level, IgDataModel igDataModel,
			ExportConfiguration exportConfiguration) {
		// TODO Auto-generated method stub
		return null;
	}

}
