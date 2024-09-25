package gov.nist.hit.hl7.igamt.ig.mock.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroupRegistry;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.mock.model.IgMock;
import gov.nist.hit.hl7.igamt.ig.mock.model.ResourceSet;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;
import org.bson.types.ObjectId;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

public class IgMockBuilder {
	protected boolean defaultTemplate;
	protected String id = new ObjectId().toString();
	protected Audience audience;
	protected DomainInfo domainInfo = new DomainInfo();
	protected DocumentMetadata metadata = new DocumentMetadata();
	protected String username;
	protected List<DatatypeMockBuilder> datatypes = new ArrayList<>();
	protected List<Valueset> valueSets = new ArrayList<>();
	protected List<ConformanceProfileMockBuilder> conformanceProfiles = new ArrayList<>();
	protected List<SegmentMockBuilder> segments = new ArrayList<>();
	protected List<CoConstraintGroup> coConstraintGroups = new ArrayList<>();

	public IgMockBuilder useDefaultTemplate(boolean toggle) {
		this.defaultTemplate = toggle;
		return this;
	}

	public IgMockBuilder withPrivateAudience(String username) {
		this.audience = new PrivateAudience();
		((PrivateAudience) this.audience).setEditor(username);
		this.username = username;
		return this;
	}

	public IgMockBuilder withPrivateAudience(String username, Set<String> viewers) {
		this.audience = new PrivateAudience();
		((PrivateAudience) this.audience).setEditor(username);
		((PrivateAudience) this.audience).setViewers(viewers);
		domainInfo.setScope(Scope.USER);
		this.username = username;
		return this;
	}

	public IgMockBuilder withPrivateAudience(String username, String... viewers) {
		this.audience = new PrivateAudience();
		((PrivateAudience) this.audience).setEditor(username);
		((PrivateAudience) this.audience).setViewers(new HashSet<>(Arrays.asList(viewers)));
		domainInfo.setScope(Scope.USER);
		this.username = username;
		return this;
	}

	public IgMockBuilder withPublicAudience() {
		this.audience = new PublicAudience();
		domainInfo.setScope(Scope.USER);
		return this;
	}

	public IgMockBuilder withWorkspaceAudience(String workspaceId, String folderId) {
		this.audience = new WorkspaceAudience();
		((WorkspaceAudience) this.audience).setWorkspaceId(workspaceId);
		((WorkspaceAudience) this.audience).setFolderId(folderId);
		domainInfo.setScope(Scope.USER);
		return this;
	}

	public IgMockBuilder withUsername(String username) {
		this.username = username;
		return this;
	}

	public IgMockBuilder withTitle(String title) {
		this.metadata.setTitle(title);
		return this;
	}

	public DatatypeMockBuilder createDatatype() {
		return new DatatypeMockBuilder(this);
	}
	public SegmentMockBuilder createSegment() {
		return new SegmentMockBuilder(this);
	}
	public ConformanceProfileMockBuilder createConformanceProfile() {
		return new ConformanceProfileMockBuilder(this);
	}

	public IgMockBuilder withDatatype(DatatypeMockBuilder builder) {
		builder.setIg(this);
		this.datatypes.add(builder);
		return this;
	}

	public IgMockBuilder withSegment(SegmentMockBuilder builder) {
		builder.setIg(this);
		this.segments.add(builder);
		return this;
	}

	public IgMockBuilder withConformanceProfile(ConformanceProfileMockBuilder builder) {
		builder.setIg(this);
		this.conformanceProfiles.add(builder);
		return this;
	}

	public IgMock build() throws IOException {
		Ig ig = new Ig();
		ig.setId(id);
		ig.setUsername(username);
		ig.setAudience(audience);
		ig.setMetadata(metadata);
		ig.setDomainInfo(domainInfo);
		ig.setCreationDate(new Date());

		if(defaultTemplate) {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			List<SectionTemplate> igTemplates = objectMapper.readValue(
					IgService.class.getResourceAsStream("/IgTemplate.json"), new TypeReference<List<SectionTemplate>>() {}
			);
			Set<TextSection> content = new HashSet<TextSection>();
			for (SectionTemplate template : igTemplates) {
				content.add(createSectionContent(template));
			}
			ig.setContent(content);
		}

		ConformanceProfileRegistry conformanceProfileRegistry = new ConformanceProfileRegistry();
		Set<ConformanceProfile> conformanceProfileList = this.conformanceProfiles.stream().map(ConformanceProfileMockBuilder::build).collect(Collectors.toSet());
		conformanceProfileRegistry.setChildren(createLinkSet(conformanceProfileList));
		ig.setConformanceProfileRegistry(conformanceProfileRegistry);

		SegmentRegistry segmentRegistry = new SegmentRegistry();
		Set<Segment> segmentList = this.segments.stream().map(SegmentMockBuilder::build).collect(Collectors.toSet());
		segmentRegistry.setChildren(createLinkSet(segmentList));
		ig.setSegmentRegistry(segmentRegistry);

		DatatypeRegistry datatypeRegistry = new DatatypeRegistry();
		Set<Datatype> datatypeList = this.datatypes.stream().map(DatatypeMockBuilder::build).collect(Collectors.toSet());
		datatypeRegistry.setChildren(createLinkSet(datatypeList));
		ig.setDatatypeRegistry(datatypeRegistry);

		ValueSetRegistry valueSetRegistry = new ValueSetRegistry();
		Set<Valueset> valueSetList = new HashSet<>();
		valueSetRegistry.setChildren(createLinkSet(valueSetList));
		ig.setValueSetRegistry(valueSetRegistry);

		CoConstraintGroupRegistry coConstraintGroupRegistry = new CoConstraintGroupRegistry();
		Set<CoConstraintGroup> coConstraintGroupList = new HashSet<>();
		coConstraintGroupRegistry.setChildren(createLinkSet(coConstraintGroupList));
		ig.setCoConstraintGroupRegistry(coConstraintGroupRegistry);

		return new IgMock(ig, new ResourceSet(
				datatypeList,
				segmentList,
				conformanceProfileList,
				valueSetList,
				coConstraintGroupList
		));
	}

	private <T extends Resource> Set<Link> createLinkSet(Set<T> resources) {
		Set<Link> links = new HashSet<>();
		int i = 0;
		for(T resource : resources) {
			links.add(new Link(resource, i++));
		}
		return links;
	}

	private TextSection createSectionContent(SectionTemplate template) {
		TextSection section = new TextSection();
		section.setId(new ObjectId().toString());
		section.setType(Type.fromString(template.getType()));
		section.setDescription("");
		section.setLabel(template.getLabel());
		section.setPosition(template.getPosition());

		if (template.getChildren() != null) {
			Set<TextSection> children = new HashSet<TextSection>();
			for (SectionTemplate child : template.getChildren()) {
				children.add(createSectionContent(child));
			}
			section.setChildren(children);
		}
		return section;
	}
}
