package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.AbstractDomainExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.NewExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ResourceExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.DatatypeDataModel;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.exception.SerializationException;
import nu.xom.Element;

public interface IgDataModelSerializationService {

	public Element serializeIgDocument(IgDataModel igDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision)
		      throws SerializationException;
	
	public Element serializeAbstractDomain(AbstractDomain abstractDomain, Type type, int position, String title, AbstractDomainExportConfiguration abstractDomainExportConfiguration);
	
	public Element getElement(Type type, int level, String id, String title);
		
	public Element serializeSegment(Segment segment, ExportConfiguration exportConfiguration );
	
	public Element serializeResource(Resource resource, Type type, int position, ResourceExportConfiguration ResourceExportConfiguration);

	public Element getSectionElement(Element element, Resource resource, int level, AbstractDomainExportConfiguration abstracDomainExportConfiguration);

	




	  

}


