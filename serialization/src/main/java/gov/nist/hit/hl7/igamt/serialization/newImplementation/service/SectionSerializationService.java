package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import nu.xom.Element;

public interface SectionSerializationService {
	
	public Element SerializeSection(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeCommonSection(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeTextSection(TextSection section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeProfile(TextSection section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeValuesetRegistry(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeSegmentRegistry(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeConformanceProfileRegistry(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);
	public Element SerializeDatatypeRegistry(Section section, int level, IgDataModel igDataModel, ExportConfiguration exportConfiguration);




}
