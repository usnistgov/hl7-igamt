/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.ig.serialization.sections;

import java.util.Map;

import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.serialization.SerializableConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatypeRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.serialization.SerializableSegmentRegistry;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.shared.domain.Registry;
import gov.nist.hit.hl7.igamt.shared.domain.Section;
import gov.nist.hit.hl7.igamt.shared.domain.TextSection;
import gov.nist.hit.hl7.igamt.shared.domain.Type;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.serialization.SerializableValuesetRegistry;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 5, 2018.
 */
public class SerializableSectionFactory {

  public static SerializableSection getSerializableSection(Section section, Map<String,Datatype> datatypesMap, Map<String, String> datatypeNamesMap, Map<String,Valueset> valuesetsMap, Map<String, Segment> segmentsMap, Map<String, ConformanceProfile> conformanceProfilesMap) {
    SerializableSection serializableSection = null;
    if(Type.TEXT.equals(section.getType())) {
      serializableSection = new SerializableTextSection((TextSection)section);
    } else if(Type.DATATYPEREGISTRY.equals(section.getType())) {
      serializableSection = new SerializableDatatypeRegistry((Registry) section, datatypesMap, datatypeNamesMap);
    } else if(Type.VALUESETREGISTRY.equals(section.getType())) {
      serializableSection = new SerializableValuesetRegistry((Registry) section, valuesetsMap);
    } else if(Type.SEGMENTRGISTRY.equals(section.getType())) {
      serializableSection = new SerializableSegmentRegistry((Registry) section, segmentsMap, datatypeNamesMap);
    } else if(Type.CONFORMANCEPROFILEREGISTRY.equals(section.getType())) {
      serializableSection = new SerializableConformanceProfileRegistry((Registry) section, conformanceProfilesMap, datatypeNamesMap);
    } else if(Type.PROFILECOMPONENTREGISTRY.equals(section.getType())) {
      
    } else if(Type.COMPOSITEPROFILEREGISTRY.equals(section.getType())) {
      
    } else {
      serializableSection = new SerializableSection(section) {
        @Override
        public Element serialize() throws SerializationException {
          return this.getElement();
        }
      };
    }
    return serializableSection;
  }
}
