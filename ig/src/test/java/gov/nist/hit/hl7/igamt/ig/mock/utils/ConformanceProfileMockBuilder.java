package gov.nist.hit.hl7.igamt.ig.mock.utils;

import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintBindingSegment;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintTableConditionalBinding;
import gov.nist.hit.hl7.igamt.coconstraints.model.StructureElementRef;
import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.Group;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRef;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.SegmentRefOrGroup;

import java.util.*;

public class ConformanceProfileMockBuilder extends ResourceMockBuilder<ConformanceProfileMockBuilder> {
	private IgMockBuilder ig;
	private BindingMockBuilder<ConformanceProfileMockBuilder> bindingMockBuilder;
	private ResourceBinding resourceBinding;
	private final Set<SegmentRefOrGroup> structure = new HashSet<>();
	private Set<Slicing> slicings = new HashSet<>();
	private final List<CoConstraintBinding> coConstraintBindings = new ArrayList<>();
	private boolean custom;

	public ConformanceProfileMockBuilder() {
	}

	public ConformanceProfileMockBuilder(IgMockBuilder ig) {
		this.ig = ig;
	}

	public ConformanceProfileMockBuilder addSegRef(String name, Usage usage, int min, String max, String segment) {
		SegmentRef segmentRef = new SegmentRef();
		int position = structure.size() + 1;
		String id = String.valueOf(position);
		segmentRef.setId(id);
		segmentRef.setPosition(position);
		segmentRef.setName(name);
		segmentRef.setUsage(usage);
		segmentRef.setMin(min);
		segmentRef.setMax(max);
		Ref ref = new Ref();
		ref.setId(segment);
		segmentRef.setRef(ref);
		structure.add(segmentRef);
		return this;
	}

	public ConformanceProfileMockBuilder addGroup(Group group) {
		structure.add(group);
		return this;
	}

	public CpGroupBuilder createGroup(String name, Usage usage, int min, String max) {
		return new CpGroupBuilder(this, name, usage, min, max, "", structure.size() + 1);
	}

	public ConformanceProfileMockBuilder withSlicing(Set<Slicing> slicing) {
		this.slicings = slicing;
		return this;
	}

	public ConformanceProfileMockBuilder withNameExtAndVersion(String name, String ext, String version) {
		this.withName(name);
		this.withName(ext);
		this.domainInfo.setVersion(version);
		return this;
	}

	public ConformanceProfileMockBuilder asUser() {
		this.domainInfo.setScope(Scope.USER);
		this.custom = false;
		return this;
	}

	public ConformanceProfileMockBuilder asHL7() {
		this.domainInfo.setScope(Scope.HL7STANDARD);
		this.custom = false;
		return this;
	}

	public ConformanceProfileMockBuilder asUserCustom(String fixedExt) {
		this.domainInfo.setScope(Scope.USERCUSTOM);
		this.withFixedExtension(fixedExtension);
		this.custom = true;
		return this;
	}

	public IgMockBuilder add() throws Exception {
		if(ig == null) {
			throw new Exception("This builder is not in an IG context");
		}
		ig.withConformanceProfile(this);
		return ig;
	}

	protected IgMockBuilder getIg() {
		return ig;
	}

	protected void setIg(IgMockBuilder ig) {
		this.ig = ig;
	}

	public ConformanceProfile build() {
		if(ig != null) {
			this.withDocumentInfo(new DocumentInfo(ig.id, DocumentType.IGDOCUMENT));
			if(this.username == null || this.username.isEmpty()) {
				this.withUsername(ig.username);
			}
		}
		ConformanceProfile conformanceProfile = new ConformanceProfile();
		this.buildResource(conformanceProfile);
		if(resourceBinding != null) {
			conformanceProfile.setBinding(resourceBinding);
		} else if(this.bindingMockBuilder != null) {
			conformanceProfile.setBinding(this.bindingMockBuilder.build());
		}
		conformanceProfile.setChildren(structure);
		conformanceProfile.setCustom(custom);
		conformanceProfile.setSlicings(slicings);
		return conformanceProfile;
	}

	public BindingMockBuilder<ConformanceProfileMockBuilder> createResourceBinding() {
		return new BindingMockBuilder<>(ig, this);
	}

	public ConformanceProfileMockBuilder addBinding(String contextPath, String segmentPath, String segmentName, CoConstraintTableConditionalBinding... tables) {
		CoConstraintBinding context = null;
		for(CoConstraintBinding binding: coConstraintBindings) {
			if(binding.getContext().getPathId().equals(contextPath)) {
				context = binding;
			}
		}
		if(context == null) {
			context = new CoConstraintBinding();
			context.setContext(new StructureElementRef(contextPath));
			coConstraintBindings.add(context);
		}
		CoConstraintBindingSegment segment = null;
		if(context.getBindings() != null) {
			for(CoConstraintBindingSegment binding: context.getBindings()) {
				if(binding.getSegment().getPathId().equals(contextPath)) {
					segment = binding;
				}
			}
		} else {
			context.setBindings(new ArrayList<>());
		}
		if(segment == null) {
			segment = new CoConstraintBindingSegment();
			segment.setName(segmentName);
			segment.setSegment(new StructureElementRef(segmentPath));
			context.getBindings().add(segment);
		}
		segment.setTables(Arrays.asList(tables));
		return this;
	}

	@Override
	public ConformanceProfileMockBuilder withResourceBinding(BindingMockBuilder<ConformanceProfileMockBuilder> builder) {
		builder.setIg(this.ig);
		builder.setResource(this);
		this.bindingMockBuilder = builder;
		return this;
	}

	@Override
	public ConformanceProfileMockBuilder withResourceBinding(ResourceBinding resourceBinding) {
		this.resourceBinding = resourceBinding;
		return this;
	}
}
