package gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.section;

import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.SerializableProfile;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.domain.sections.SerializableTextSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

public class SerializableSectionFactory {

//	Section section, int level, DatatypeRegistry datatypeRegistry,
//    Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap,
//    Map<String, String> valuesetNamesMap, Set<String> bindedDatatypes, Set<String> bindedComponents

	  public static SerializableSection getSerializableSection(Section section, int level, DatatypeRegistry datatypeRegistry,
	      Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap, Map<String, String> valuesetNamesMap,
	      Set<String> bindedDatatypes, Set<String> bindedComponents) {
	    SerializableSection serializableSection = null;
	    if (Type.TEXT.equals(section.getType())) {
	      serializableSection = new SerializableTextSection((TextSection) section, level);
	    } else if (Type.PROFILE.equals(section.getType())) {
	    		serializableSection = new SerializableProfile(section, level, datatypeRegistry, datatypesMap, datatypeNamesMap, valuesetNamesMap, bindedDatatypes, bindedComponents);
	    } else if (Type.DATATYPEREGISTRY.equals(section.getType())) {
	      serializableSection = new SerializableDatatypeRegistry(section, level, datatypeRegistry,
	          datatypesMap, datatypeNamesMap, valuesetNamesMap,bindedDatatypes, bindedComponents);
	    } 
	    return serializableSection;
	  }

}
