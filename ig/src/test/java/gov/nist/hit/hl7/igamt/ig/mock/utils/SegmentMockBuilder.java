package gov.nist.hit.hl7.igamt.ig.mock.utils;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.slicing.domain.Slicing;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingItem;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class SegmentMockBuilder extends ResourceMockBuilder<SegmentMockBuilder> {
	private IgMockBuilder ig;
	private String ext;
	private BindingMockBuilder<SegmentMockBuilder> bindingMockBuilder;
	private ResourceBinding resourceBinding;
	private final Set<Field> fields = new HashSet<>();
	private Set<Slicing> slicings = new HashSet<>();
	private DynamicMappingInfo dynamicMappingInfo;
	private boolean custom;

	public SegmentMockBuilder() {
	}

	public SegmentMockBuilder(IgMockBuilder ig) {
		this.ig = ig;
	}

	public SegmentMockBuilder addField(String name, Usage usage, int min, String max, String minLength, String maxLength, String confLength, LengthType lengthType, String constantValue, String datatype) {
		Field field = new Field();
		int position = fields.size() + 1;
		String id = String.valueOf(position);
		field.setId(id);
		field.setPosition(position);
		field.setName(name);
		field.setUsage(usage);
		field.setMinLength(minLength);
		field.setMaxLength(maxLength);
		field.setConfLength(confLength);
		field.setLengthType(lengthType);
		field.setMin(min);
		field.setMax(max);
		field.setConstantValue(constantValue);
		Ref datatypeRef = new Ref();
		datatypeRef.setId(datatype);
		field.setRef(datatypeRef);
		fields.add(field);
		return this;
	}

	public SegmentMockBuilder addFieldWithConfLengthAndConstantValue(String name, Usage usage, int min, String max, String confLength, String constantValue, String datatype) {
		return this.addField(name, usage, min, max, "NA", "NA", confLength, LengthType.ConfLength, constantValue, datatype);
	}

	public SegmentMockBuilder addFieldWithLengthAndConstantValue(String name, Usage usage, int min, String max, String minLength, String maxLength, String constantValue, String datatype) {
		return this.addField(name, usage, min, max, minLength, maxLength, "NA", LengthType.Length, constantValue, datatype);
	}

	public SegmentMockBuilder addFieldWithConfLength(String name, Usage usage, int min, String max, String confLength, String datatype) {
		return this.addField(name, usage, min, max, "NA", "NA", confLength, LengthType.ConfLength, null, datatype);
	}

	public SegmentMockBuilder addFieldWithLength(String name, Usage usage, int min, String max, String minLength, String maxLength, String datatype) {
		return this.addField(name, usage, min, max, minLength, maxLength, "NA", LengthType.Length, null, datatype);
	}

	public SegmentMockBuilder addFieldNoLength(String name, Usage usage, int min, String max, String datatype) {
		return this.addField(name, usage, min, max, "NA", "NA", "NA", LengthType.UNSET, null, datatype);
	}

	public SegmentMockBuilder withDynamicMapping(String referenceField, String variesField, Map<String, String> valueToId) {
		dynamicMappingInfo = new DynamicMappingInfo();
		dynamicMappingInfo.setReferenceFieldId(referenceField);
		dynamicMappingInfo.setVariesFieldId(variesField);
		dynamicMappingInfo.setItems(valueToId.values().stream().map(s -> new DynamicMappingItem(s, s))
		                                     .collect(Collectors.toSet())
		);
		return this;
	}

	public SegmentMockBuilder withSlicing(Set<Slicing> slicing) {
		this.slicings = slicing;
		return this;
	}

	public SegmentMockBuilder withNameExtAndVersion(String name, String ext, String version) {
		this.withName(name);
		this.withExt(ext);
		this.domainInfo.setVersion(version);
		return this;
	}

	public SegmentMockBuilder withNameAndVersion(String name, String version) {
		this.withName(name);
		this.domainInfo.setVersion(version);
		return this;
	}

	public SegmentMockBuilder asUser() {
		this.domainInfo.setScope(Scope.USER);
		this.custom = false;
		return this;
	}

	public SegmentMockBuilder asHL7() {
		this.domainInfo.setScope(Scope.HL7STANDARD);
		this.custom = false;
		return this;
	}

	public SegmentMockBuilder asUserCustom(String fixedExt) {
		this.domainInfo.setScope(Scope.USERCUSTOM);
		this.withFixedExtension(fixedExtension);
		this.custom = true;
		return this;
	}

	public IgMockBuilder add() throws Exception {
		if(ig == null) {
			throw new Exception("This builder is not in an IG context");
		}
		ig.withSegment(this);
		return ig;
	}

	protected IgMockBuilder getIg() {
		return ig;
	}

	protected void setIg(IgMockBuilder ig) {
		this.ig = ig;
	}

	public Segment build() {
		if(ig != null && !this.domainInfo.getScope().equals(Scope.HL7STANDARD)) {
			this.withDocumentInfo(new DocumentInfo(ig.id, DocumentType.IGDOCUMENT));
			if(this.username == null || this.username.isEmpty()) {
				this.withUsername(ig.username);
			}
		}
		Segment segment = new Segment();
		this.buildResource(segment);
		if(resourceBinding != null) {
			segment.setBinding(resourceBinding);
		} else if(this.bindingMockBuilder != null) {
			segment.setBinding(this.bindingMockBuilder.build());
		}
		segment.setChildren(fields);
		segment.setDynamicMappingInfo(dynamicMappingInfo);
		segment.setExt(ext);
		segment.setCustom(custom);
		segment.setSlicings(slicings);
		return segment;
	}

	private SegmentMockBuilder withExt(String ext) {
		this.ext = ext;
		return this;
	}

	public BindingMockBuilder<SegmentMockBuilder> createResourceBinding() {
		return new BindingMockBuilder<>(ig, this);
	}

	@Override
	public SegmentMockBuilder withResourceBinding(BindingMockBuilder<SegmentMockBuilder> builder) {
		builder.setIg(this.ig);
		builder.setResource(this);
		this.bindingMockBuilder = builder;
		return this;
	}

	@Override
	public SegmentMockBuilder withResourceBinding(ResourceBinding resourceBinding) {
		this.resourceBinding = resourceBinding;
		return this;
	}
}
