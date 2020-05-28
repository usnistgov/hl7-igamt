package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructureDataModel;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import nu.xom.Element;

public interface SectionSerializationService {
	
	public Element SerializeSection(Section section, int level, DocumentStructureDataModel documentStructureDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException;
	public Element SerializeCommonSection(Section section, int level, DocumentStructureDataModel documentStructureDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeTextSection(TextSection section, int level, DocumentStructureDataModel documentStructureDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeProfile(TextSection section, int level, DocumentStructureDataModel documentStructureDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException;
	public Element SerializeValuesetRegistry(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException;
	public Element SerializeSegmentRegistry(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException;
	public Element SerializeConformanceProfileRegistry(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException;
	public Element SerializeDatatypeRegistry(Section section, int level, DocumentStructureDataModel documentStructureDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException;

}
