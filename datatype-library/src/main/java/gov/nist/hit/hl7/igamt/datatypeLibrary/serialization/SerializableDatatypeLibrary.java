package gov.nist.hit.hl7.igamt.datatypeLibrary.serialization;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.section.SectionSerializationUtil;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableAbstractDomain;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableDocumentMetadata;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Element;

public class SerializableDatatypeLibrary extends SerializableAbstractDomain {
	
	  private Map<String, Datatype> datatypesMap;
	  private Map<String, String> datatypeNamesMap;
	  private Map<String, String> valuesetNamesMap;
	  private Set<String> bindedDatatypes = new HashSet<>();
	  private Set<String> bindedComponents = new HashSet<>();


	public SerializableDatatypeLibrary(DatatypeLibrary datatypeLibrary, String position, Map<String, Datatype> datatypesMap,
			Map<String, Valueset> valuesetsMap, Set<String> bindedDatatypes, Set<String> bindedComponents ) {
		super(datatypeLibrary, position);
//		this.datatypeNamesMap = datatypeNamesMap;
		this.datatypesMap = datatypesMap;
		this.bindedComponents = bindedComponents;
		this.bindedDatatypes = bindedDatatypes;
	}

	@Override
	public Element serialize() throws SerializationException {
		Element datatypeLibraryElement = super.getElement(Type.DATATYPELIBRARY);
		DatatypeLibrary datatypeLibrary = (DatatypeLibrary) super.getAbstractDomain();
		SerializableDocumentMetadata serializableDocumentMetadata =
		        new SerializableDocumentMetadata(datatypeLibrary.getMetadata(),datatypeLibrary.getDomainInfo(),datatypeLibrary.getPublicationInfo());
		    if (serializableDocumentMetadata != null) {
		      Element metadataElement = serializableDocumentMetadata.serialize();
		      if (metadataElement != null) {
		    	  datatypeLibraryElement.appendChild(metadataElement);
		      }
		    }
		    
		    for (Section section : datatypeLibrary.getContent()) {
		        // startLevel is the base header level in the html/export. 1 = h1, 2 = h2...
		        int startLevel = 1;
		        Element sectionElement =
		            SectionSerializationUtil.serializeSection(section, startLevel, datatypeLibrary.getDatatypeRegistry(), datatypesMap, datatypeNamesMap, 
		            		valuesetNamesMap, bindedDatatypes, bindedComponents);
		        if (sectionElement != null) {
		        	datatypeLibraryElement.appendChild(sectionElement);
		        }
		      }
		
		return datatypeLibraryElement;
	}
	
	 private void populateNamesMap() {
		    datatypeNamesMap = new HashMap<>();
		    if (datatypesMap != null) {
		      for (String datatypeId : datatypesMap.keySet()) {
		        Datatype datatype = datatypesMap.get(datatypeId);
		        if (datatype != null) {
		          datatypeNamesMap.put(datatypeId, datatype.getName());
		        }
		      }
		    }
		  }

	@Override
	public Map<String, String> getIdPathMap() {
		// TODO Auto-generated method stub
		return null;
	}

}
