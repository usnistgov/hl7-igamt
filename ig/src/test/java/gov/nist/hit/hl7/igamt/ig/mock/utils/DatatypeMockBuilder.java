package gov.nist.hit.hl7.igamt.ig.mock.utils;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;

import java.util.HashSet;
import java.util.Set;

public class DatatypeMockBuilder extends ResourceMockBuilder<DatatypeMockBuilder> {
	private IgMockBuilder ig;
	private String ext;
	private BindingMockBuilder<DatatypeMockBuilder> bindingMockBuilder;
	private ResourceBinding resourceBinding;
	private boolean complex;
	private final Set<Component> components = new HashSet<>();

	public DatatypeMockBuilder() {
	}

	public DatatypeMockBuilder(IgMockBuilder ig) {
		this.ig = ig;
	}

	public DatatypeMockBuilder asComplex() {
		this.complex = true;
		return this;
	}

	public DatatypeMockBuilder addComponent(String name, Usage usage, String minLength, String maxLength, String confLength, LengthType lengthType, String constantValue, String datatype) {
		this.asComplex();
		Component component = new Component();
		int position = components.size() + 1;
		String id = String.valueOf(position);
		component.setId(id);
		component.setPosition(position);
		component.setName(name);
		component.setUsage(usage);
		component.setMinLength(minLength);
		component.setMaxLength(maxLength);
		component.setConfLength(confLength);
		component.setLengthType(lengthType);
		component.setConstantValue(constantValue);
		Ref datatypeRef = new Ref();
		datatypeRef.setId(datatype);
		component.setRef(datatypeRef);
		components.add(component);
		return this;
	}

	public DatatypeMockBuilder addComponentWithConfLengthAndConstantValue(String name, Usage usage, String confLength, String constantValue, String datatype) {
		return this.addComponent(name, usage, "NA", "NA", confLength, LengthType.ConfLength, constantValue, datatype);
	}

	public DatatypeMockBuilder addComponentWithLengthAndConstantValue(String name, Usage usage, String minLength, String maxLength, String constantValue, String datatype) {
		return this.addComponent(name, usage, minLength, maxLength, "NA", LengthType.ConfLength, constantValue, datatype);
	}

	public DatatypeMockBuilder addComponentWithConfLength(String name, Usage usage, String confLength, String datatype) {
		return this.addComponent(name, usage, "NA", "NA", confLength, LengthType.ConfLength, null, datatype);
	}

	public DatatypeMockBuilder addComponentWithLength(String name, Usage usage, String minLength, String maxLength, String datatype) {
		return this.addComponent(name, usage, minLength, maxLength, "NA", LengthType.ConfLength, null, datatype);
	}

	public DatatypeMockBuilder withNameExtAndVersion(String name, String ext, String version) {
		this.withName(name);
		this.withExt(ext);
		this.domainInfo.setVersion(version);
		return this;
	}

	public DatatypeMockBuilder withNameAndVersion(String name, String version) {
		this.withName(name);
		this.domainInfo.setVersion(version);
		return this;
	}

	public DatatypeMockBuilder asUser() {
		this.domainInfo.setScope(Scope.USER);
		return this;
	}

	public DatatypeMockBuilder asHL7() {
		this.domainInfo.setScope(Scope.HL7STANDARD);
		return this;
	}

	public IgMockBuilder add() throws Exception {
		if(ig == null) {
			throw new Exception("This builder is not in an IG context");
		}
		ig.withDatatype(this);
		return ig;
	}

	protected IgMockBuilder getIg() {
		return ig;
	}

	protected void setIg(IgMockBuilder ig) {
		this.ig = ig;
	}

	public Datatype build() {
		if(ig != null && !this.domainInfo.getScope().equals(Scope.HL7STANDARD)) {
			this.withDocumentInfo(new DocumentInfo(ig.id, DocumentType.IGDOCUMENT));
			if(this.username == null || this.username.isEmpty()) {
				this.withUsername(ig.username);
			}
		}
		if(this.complex) {
			ComplexDatatype datatype = new ComplexDatatype();
			datatype.setComponents(components);
			return this.build(datatype);
		} else {
			return this.build(new Datatype());
		}
	}

	private DatatypeMockBuilder withExt(String ext) {
		this.ext = ext;
		return this;
	}

	private Datatype build(Datatype datatype) {
		this.buildResource(datatype);
		if(resourceBinding != null) {
			datatype.setBinding(resourceBinding);
		} else if(this.bindingMockBuilder != null) {
			datatype.setBinding(this.bindingMockBuilder.build());
		}
		datatype.setExt(ext);
		return datatype;
	}

	public BindingMockBuilder<DatatypeMockBuilder> createResourceBinding() {
		return new BindingMockBuilder<>(ig, this);
	}

	@Override
	public DatatypeMockBuilder withResourceBinding(BindingMockBuilder<DatatypeMockBuilder> builder) {
		builder.setIg(this.ig);
		builder.setResource(this);
		this.bindingMockBuilder = builder;
		return this;
	}

	@Override
	public DatatypeMockBuilder withResourceBinding(ResourceBinding resourceBinding) {
		this.resourceBinding = resourceBinding;
		return this;
	}
}
