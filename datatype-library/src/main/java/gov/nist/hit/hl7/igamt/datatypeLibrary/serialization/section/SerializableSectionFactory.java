package gov.nist.hit.hl7.igamt.datatypeLibrary.serialization.section;

import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.serialization.SerializableConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatypeRegistry;
import gov.nist.hit.hl7.igamt.ig.serialization.sections.SerializableProfile;
import gov.nist.hit.hl7.igamt.ig.serialization.sections.SerializableTextSection;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.serialization.SerializableSegmentRegistry;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.serialization.SerializableValuesetRegistry;
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
	    } else if (Type.DATATYPEREGISTRY.equals(section.getType())) {
	      serializableSection = new SerializableDatatypeRegistry(section, level, datatypeRegistry,
	          datatypesMap, datatypeNamesMap, valuesetNamesMap,bindedDatatypes, bindedComponents);
	    } 
	    return serializableSection;
	  }

}
