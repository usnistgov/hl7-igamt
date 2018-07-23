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
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.segment.serialization.SerializableSegmentRegistry;
import gov.nist.hit.hl7.igamt.serialization.domain.SerializableSection;
import gov.nist.hit.hl7.igamt.serialization.domain.sections.SerializableTextSection;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import gov.nist.hit.hl7.igamt.valueset.serialization.SerializableValuesetRegistry;
import gov.nist.hit.hl7.igamt.valueset.serialization.SerializableValuesetStructure;
import nu.xom.Element;

/**
 *
 * @author Maxence Lefort on Apr 5, 2018.
 */
public class SerializableSectionFactory {

  public static SerializableSection getSerializableSection(Section section, int level,
      Map<String, Datatype> datatypesMap, Map<String, String> datatypeNamesMap,
      Map<String, SerializableValuesetStructure> valuesetsMap, Map<String, String> valuesetNamesMap,
      Map<String, Segment> segmentsMap, Map<String, ConformanceProfile> conformanceProfilesMap,
      ValueSetRegistry valueSetRegistry, DatatypeRegistry datatypeRegistry,
      SegmentRegistry segmentRegistry, ConformanceProfileRegistry conformanceProfileRegistry,
      ProfileComponentRegistry profileComponentRegistry,
      CompositeProfileRegistry compositeProfileRegistry, Set<String> bindedGroupsAndSegmentRefs,
      Set<String> bindedFields, Set<String> bindedSegments, Set<String> bindedDatatypes,
      Set<String> bindedComponents, Set<String> bindedValueSets, ExportConfiguration exportConfiguration) {
    SerializableSection serializableSection = null;
    if (Type.TEXT.equals(section.getType())) {
      serializableSection = new SerializableTextSection((TextSection) section, level);
    } else if (Type.PROFILE.equals(section.getType())) {
      serializableSection = new SerializableProfile(section, level, datatypesMap, datatypeNamesMap,
          valuesetsMap, valuesetNamesMap, segmentsMap, conformanceProfilesMap, valueSetRegistry,
          datatypeRegistry, segmentRegistry, conformanceProfileRegistry, profileComponentRegistry,
          compositeProfileRegistry, bindedGroupsAndSegmentRefs, bindedFields, bindedSegments,
          bindedDatatypes, bindedComponents, bindedValueSets, exportConfiguration);
    } else if (Type.DATATYPEREGISTRY.equals(section.getType())) {
      if(exportConfiguration.isIncludeDatatypeTable()) {
      serializableSection = new SerializableDatatypeRegistry(section, level, datatypeRegistry,
          datatypesMap, datatypeNamesMap, valuesetNamesMap, bindedDatatypes, bindedComponents);
      }
    } else if (Type.VALUESETREGISTRY.equals(section.getType())) {
      if(exportConfiguration.isIncludeValuesetsTable()) {
        serializableSection =
            new SerializableValuesetRegistry(section, level, valueSetRegistry, valuesetsMap, bindedValueSets);
      }
    } else if (Type.SEGMENTREGISTRY.equals(section.getType())) {
      if(exportConfiguration.isIncludeSegmentTable()) {
      serializableSection = new SerializableSegmentRegistry(section, level, segmentRegistry,
          segmentsMap, datatypeNamesMap, valuesetNamesMap, bindedSegments, bindedFields);
      }
    } else if (Type.CONFORMANCEPROFILEREGISTRY.equals(section.getType())) {
      if(exportConfiguration.isIncludeMessageTable()) {
      serializableSection = new SerializableConformanceProfileRegistry(section, level,
          conformanceProfileRegistry, conformanceProfilesMap, segmentsMap, valuesetNamesMap, bindedGroupsAndSegmentRefs);
      }
    } else if (Type.PROFILECOMPONENTREGISTRY.equals(section.getType())) {
      if(exportConfiguration.isIncludeProfileComponentTable()) {
        //TODO add profile component registry serialization
      }
    } else if (Type.COMPOSITEPROFILEREGISTRY.equals(section.getType())) {
      if(exportConfiguration.isIncludeCompositeProfileTable()) {
        //TODO add composite profile registry serialization
      }
    } else {
      serializableSection = new SerializableSection(section, level) {
        @Override
        public Element serialize() throws SerializationException {
          return this.getElement();
        }
      };
    }
    return serializableSection;
  }
}
