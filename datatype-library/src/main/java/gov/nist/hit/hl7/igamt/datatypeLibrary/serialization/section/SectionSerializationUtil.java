package gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.section;

import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

public class SectionSerializationUtil {

	public static Element serializeSection(Section section, int level, DatatypeRegistry datatypeRegistry,DatatypeRegistry derivedDatatypeRegistry
		      ,Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap, Map<String, String> valuesetNamesMap,
		      Set<String> bindedDatatypes, Set<String> bindedComponents) throws SerializationException {
		    if (section != null) {
		      try {
		        SerializableSection serializableSection =
		            SerializableSectionFactory.getSerializableSection(section, level, datatypeRegistry,
		      	          derivedDatatypeRegistry, datatypesMap, datatypeNamesMap, valuesetNamesMap,bindedDatatypes, bindedComponents);
		        if (serializableSection != null) {
		          return serializableSection.serialize();
		        }
		      } catch (Exception exception) {
		        throw new SerializationException(exception, Type.SECTION,section.getLabel());
		      }
		    }
		    return null;
		  }

}
