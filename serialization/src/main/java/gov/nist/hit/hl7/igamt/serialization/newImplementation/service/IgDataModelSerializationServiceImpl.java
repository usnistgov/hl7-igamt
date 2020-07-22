package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import org.hl7.fhir.r4.model.ValueSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructureDataModel;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Section;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.AbstractDomainExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DocumentMetadataConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ResourceExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.serialization.exception.RegistrySerializationException;
import gov.nist.hit.hl7.igamt.serialization.util.DateSerializationUtil;
import gov.nist.hit.hl7.igamt.serialization.util.FroalaSerializationUtil;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class IgDataModelSerializationServiceImpl implements IgDataModelSerializationService {

	@Autowired
	private SectionSerializationService sectionSerializationService;
	
	@Autowired
	private FroalaSerializationUtil frolaCleaning;

	@Override
	public Element serializeDocument(DocumentStructureDataModel documentStructureDataModel, ExportConfiguration exportConfiguration, ExportFilterDecision exportFilterDecision) throws RegistrySerializationException {
		//		if(exportConfiguration.getAbstractDomainExportConfiguration() == null) {System.out.println("Export IG document export null ici");}
		DocumentStructure documentStructure = documentStructureDataModel.getModel();
		Element igDocumentElement = serializeAbstractDomain(documentStructure, Type.IGDOCUMENT, 1, documentStructure.getName(), exportConfiguration.getAbstractDomainExportConfiguration());
		Element metadataElement = serializeDocumentMetadata(documentStructure.getMetadata(), documentStructure.getDomainInfo(),
				documentStructure.getPublicationInfo(), exportConfiguration.getDocumentMetadataConfiguration());
		if (metadataElement != null) {
			igDocumentElement.appendChild(metadataElement);
		}

		for (Section section : documentStructure.getContent()) {
			// startLevel is the base header level in the html/export. 1 = h1, 2 = h2...
			int startLevel = 1;
			Element sectionElement = sectionSerializationService.SerializeSection(section, startLevel, documentStructureDataModel, exportConfiguration, exportFilterDecision);
			igDocumentElement.appendChild(sectionElement);
		}
		return igDocumentElement;
	}

	public Element serializeDocumentMetadata(DocumentMetadata metadata, DomainInfo domainInfo,
			PublicationInfo publicationInfo, DocumentMetadataConfiguration documentMetadataConfiguration) {
		Element metadataElement = new Element("Metadata");
		metadataElement.addAttribute(new Attribute("title", metadata.getTitle() != null ? metadata.getTitle() : ""));
		metadataElement.addAttribute(new Attribute("topics", metadata.getTopics() != null ? metadata.getTopics() : ""));
		metadataElement.addAttribute(new Attribute("description",
				metadata.getSpecificationName() != null ? metadata.getSpecificationName() : ""));
		metadataElement.addAttribute(
				new Attribute("identifier", metadata.getIdentifier() != null ? metadata.getIdentifier() : ""));
		metadataElement.addAttribute(new Attribute("subTitles",
				metadata.getSubTitle() != null ? metadata.getSubTitle() : ""));
		metadataElement
		.addAttribute(new Attribute("orgName", metadata.getOrgName() != null ? metadata.getOrgName() : ""));
		metadataElement.addAttribute(
				new Attribute("coverPicture", metadata.getCoverPicture() != null ? "aade49bd-1af7-4061-81d2-60b8fb6eee60b.png" : ""));
		metadataElement
		.addAttribute(new Attribute("subTitle", metadata.getSubTitle() != null ? metadata.getSubTitle() : ""));

		metadataElement.addAttribute(new Attribute("hl7Version",
				domainInfo != null && domainInfo.getVersion() != null ? domainInfo.getVersion() : ""));
		String domainCompatibilityVersions = "";
		if (domainInfo != null && domainInfo.getCompatibilityVersion() != null) {
			domainCompatibilityVersions = String.join(",", domainInfo.getCompatibilityVersion());
		}
		metadataElement.addAttribute(new Attribute("domainCompatibilityVersions", domainCompatibilityVersions));
		metadataElement.addAttribute(new Attribute("scope",
				domainInfo != null && domainInfo.getScope() != null ? domainInfo.getScope().name() : ""));
		metadataElement.addAttribute(new Attribute("publicationVersion",
				publicationInfo != null && publicationInfo.getPublicationVersion() != null
				? publicationInfo.getPublicationVersion()
						: ""));
		String publicationDate = "";
		if (publicationInfo != null && publicationInfo.getPublicationDate() != null) {
			publicationDate = DateSerializationUtil.serializeDate(publicationInfo.getPublicationDate());
		}
		metadataElement.addAttribute(new Attribute("publicationDate", publicationDate));
		// TODO add appVersion
		return metadataElement;
	}


	public Element serializeAbstractDomain(AbstractDomain abstractDomain, Type type, int position, String title, AbstractDomainExportConfiguration abstractDomainExportConfiguration) {
		Element element = getElement(type, position, abstractDomain.getId(), title);
		if (abstractDomain != null) {
			if (abstractDomain.getComment() != null && !abstractDomain.getComment().isEmpty()) {
				if(abstractDomainExportConfiguration.isComment()) {
					Element commentElement = new Element("Comment");
					commentElement.appendChild(this.formatStringData(abstractDomain.getComment()));
					element.appendChild(commentElement);
				}}
						if(abstractDomainExportConfiguration.isCreatedFrom()) {
			element.addAttribute(new Attribute("createdFrom",
					abstractDomain.getCreatedFrom() != null ? abstractDomain.getCreatedFrom() : ""));}
						if(abstractDomainExportConfiguration.isPublicationDate()) {
			element.addAttribute(
					new Attribute("publicationDate",
							abstractDomain.getPublicationInfo() != null
							? (abstractDomain.getPublicationInfo().getPublicationDate() != null
							? this.formatStringData(
									abstractDomain.getPublicationInfo().getPublicationDate().toString())
									: "")
									: ""));}
			element.addAttribute(new Attribute("description",
					abstractDomain.getDescription() != null ? this.formatStringData(abstractDomain.getDescription())
							: ""));
						if(abstractDomainExportConfiguration.isVersion()) {
			element.addAttribute(
					new Attribute("domainCompatibilityVersion",
							abstractDomain.getDomainInfo() != null
							? (abstractDomain.getDomainInfo().getCompatibilityVersion() != null
							? this.formatStringData(
									abstractDomain.getDomainInfo().getCompatibilityVersion().toString())
									: "")
									: ""));}
			element.addAttribute(
					new Attribute("name", abstractDomain.getName() != null ? abstractDomain.getName(): ""));
			element.addAttribute(new Attribute("id",
					abstractDomain.getId() != null && abstractDomain.getId() != null ? abstractDomain.getId() : ""));

			element.addAttribute(new Attribute("username",
					abstractDomain.getUsername() != null ? abstractDomain.getUsername() : ""));
						if(abstractDomainExportConfiguration != null && abstractDomainExportConfiguration.isAuthorNotes()) {
			element.addAttribute(new Attribute("authorNotes",
					abstractDomain.getAuthorNotes() != null ? frolaCleaning.cleanFroalaInput(abstractDomain.getAuthorNotes()): ""));}
						if(abstractDomainExportConfiguration != null && abstractDomainExportConfiguration.isUsageNotes()) {
			element.addAttribute(new Attribute("usageNotes",
					abstractDomain.getUsageNotes() != null ? frolaCleaning.cleanFroalaInput(abstractDomain.getUsageNotes()) : ""));}
		}
		return element;
	}

	@Override
	public Element serializeResource(Resource resource, Type type, int position, ResourceExportConfiguration resourceExportConfiguration) {
		Element element = serializeAbstractDomain(resource,type,position, resource.getName(), resourceExportConfiguration);
		if (resource != null && element != null) {
			if(resourceExportConfiguration.isPreDef()) {
				element.addAttribute(new Attribute("postDef",
						resource.getPostDef() != null && !resource.getPostDef().isEmpty()
						? this.formatStringData(resource.getPostDef())
								: ""));}
			if(resourceExportConfiguration.isPostDef()) {
				element.addAttribute(new Attribute("preDef",
						resource.getPreDef() != null && !resource.getPreDef().isEmpty()
						? this.formatStringData(resource.getPreDef())
								: ""));}
//			element.addAttribute(new Attribute("type", type.getValue()));
		}
		return element;
	}


	public Element getSectionElement(Element resourceElement, Resource resource, int level, AbstractDomainExportConfiguration abstractDomainExportConfiguration) {
		Element element = serializeAbstractDomain(resource, Type.SECTION, level, resource.getName(), abstractDomainExportConfiguration);
		element.addAttribute(new Attribute("h", String.valueOf(level)));
		String title = resource.getLabel();
		if(resource instanceof Valueset) {
		  title += '-'+ resource.getName();
		}else {
          title += '-'+ resource.getDescription();
		}
		element.addAttribute(
				new Attribute("title", title != null ? title: ""));
		element.addAttribute(new Attribute("description",
				resource.getDescription() != null ? resource.getDescription() : ""));
		element.appendChild(resourceElement);
		return element;
	}



	public String formatStringData(String str) {
		return frolaCleaning.cleanFroalaInput(str);
	}

	public String getElementName(Type type) {
		String elementName = "";
		switch (type) {
		case SECTION:
			elementName = "Section";
			break;
		case VALUESET:
			elementName = "Valueset";
			break;
		case DATATYPE:
			elementName = "Datatype";
			break;
		case SEGMENT:
			elementName = "Segment";
			break;
		case CONFORMANCEPROFILE:
			elementName = "ConformanceProfile";
			break;
		case COMPOSITEPROFILE:
			elementName = "CompositeProfile";
			break;
		case PROFILECOMPONENT:
			elementName = "ProfileComponent";
			break;
		case IGDOCUMENT:
			elementName = "Document";
			break;
		case DATATYPELIBRARY:
			elementName = "Document";
			break;
		default:
			elementName = "Section";
			break;
		}
		return elementName;
	}

	@Override
	public Element getElement(Type type, int position, String id, String title) {
		Element element = new Element(getElementName(type));
		element.addAttribute(new Attribute("id", id));
		element.addAttribute(new Attribute("position", String.valueOf(position)));
		element.addAttribute(new Attribute("title", title != null ? title : ""));
		return element;
	}

	@Override
	public Element serializeSegment(Segment segment, ExportConfiguration exportConfiguration) {
		// TODO Auto-generated method stub
		return null;
	}










}
