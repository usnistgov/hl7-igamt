package gov.nist.hit.hl7.igamt.datatypeLibrary.serialization;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.section.SerializableSectionFactory;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

public class SerializableProfile extends SerializableSection {

	private Map<String, Datatype> datatypesMap;
	  private Map<String, String> datatypeNamesMap;
	  private Map<String, String> valuesetNamesMap;
	  private DatatypeRegistry datatypeRegistry;
	  private DatatypeRegistry derivedDatatypeRegistry;
	  private Set<String> bindedDatatypes;
	  private Set<String> bindedComponents;

	  /**
	   * @param section
	   */
	  public SerializableProfile(Section section, int level, DatatypeRegistry datatypeRegistry, DatatypeRegistry derivedDatatypeRegistry,
		      Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap, Map<String, String> valuesetNamesMap,
		      Set<String> bindedDatatypes, Set<String> bindedComponents) {
	    super(section, level);
	    this.datatypesMap = datatypesMap;
	    this.datatypeNamesMap = datatypeNamesMap;
	    this.valuesetNamesMap = valuesetNamesMap;
	    this.datatypeRegistry = datatypeRegistry;
	    this.derivedDatatypeRegistry = derivedDatatypeRegistry;
	    this.bindedDatatypes = bindedDatatypes;
	    this.bindedComponents = bindedComponents;
	  }

	  /*
	   * (non-Javadoc)
	   * 
	   * @see gov.nist.hit.hl7.igamt.serialization.domain.SerializableElement#serialize()
	   */
	  @Override
	  public Element serialize() throws SerializationException {
	    Element profileElement = super.getElement();
	    if (((TextSection) super.getSection()).getChildren() != null) {
	      for (Section section : ((TextSection) super.getSection()).getChildren()) {
	    	  	if(section.getType().equals(Type.DERIVEDDATATYPEREGISTRY)) {
	    	  		this.bindedDatatypes = identifyDatatypesByScope(derivedDatatypeRegistry);
	    	  	} if(section.getType().equals(Type.DATATYPEREGISTRY))  {
	    	  		this.bindedDatatypes = identifyDatatypesByScope(datatypeRegistry);
	    	  	}
	        SerializableSection childSection =
	            SerializableSectionFactory.getSerializableSection(section, this.getChildLevel(), datatypeRegistry,
	                derivedDatatypeRegistry, datatypesMap, datatypeNamesMap, valuesetNamesMap,
	                this.bindedDatatypes, this.bindedComponents);
	        if (childSection != null) {
	          Element childSectionElement = childSection.serialize();
	          if (childSectionElement != null) {
	            profileElement.appendChild(childSectionElement);
	          }
	        }
	      }
	    }
	    return profileElement;
	  }

	private Set<String> identifyDatatypesByScope(DatatypeRegistry datatypeRegistry) {
		Set<String> bindedDatatypes = new HashSet<>();
		for(Link datatypeLink : datatypeRegistry.getChildren()) {
				bindedDatatypes.add(datatypeLink.getId());
		}
		return bindedDatatypes;
	}


}
