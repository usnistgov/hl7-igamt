package gov.nist.hit.hl7.igamt.ig.mock.utils;

import gov.nist.hit.hl7.igamt.common.base.domain.*;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;

import java.util.Date;


public abstract class ResourceMockBuilder<T extends ResourceMockBuilder<?>> {
	protected String id;
	protected Date creationDate = new Date();
	protected Date updateDate;
	protected String name;
	protected String origin;
	protected DomainInfo domainInfo = new DomainInfo();
	protected String username;
	protected String createdFrom;
	protected Status status;
	protected String from;
	protected boolean derived;
	protected String fixedExtension;
	protected DocumentInfo documentInfo;

	protected Resource buildResource(Resource resource) {
		resource.setId(id);
		resource.setCreationDate(creationDate);
		resource.setUpdateDate(updateDate);
		resource.setName(name);
		resource.setOrigin(origin);
		resource.setDomainInfo(domainInfo);
		resource.setUsername(username);
		resource.setDocumentInfo(documentInfo);
		resource.setFixedExtension(fixedExtension);
		resource.setDerived(derived);
		resource.setStatus(status);
		resource.setFrom(from);
		return resource;
	}

	public abstract T withResourceBinding(BindingMockBuilder<T> bindingMockBuilder);

	public abstract T withResourceBinding(ResourceBinding resourceBinding);

	public T withId(String id) {
		this.id = id;
		return (T) this;
	}
	protected ResourceMockBuilder withCreationDate(Date creationDate) {
		this.creationDate = creationDate;
		return this;
	}
	protected ResourceMockBuilder withUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
		return this;
	}
	protected ResourceMockBuilder withName(String name) {
		this.name = name;
		return this;
	}
	protected ResourceMockBuilder withOrigin(String origin) {
		this.origin = origin;
		return this;
	}
	protected ResourceMockBuilder withDomainInfo(DomainInfo domainInfo) {
		this.domainInfo = domainInfo;
		return this;
	}
	protected ResourceMockBuilder withUsername(String username) {
		this.username = username;
		return this;
	}
	protected ResourceMockBuilder withCreatedFrom(String createdFrom) {
		this.createdFrom = createdFrom;
		return this;
	}
	protected ResourceMockBuilder withStatus(Status status) {
		this.status = status;
		return this;
	}
	protected ResourceMockBuilder withFrom(String from) {
		this.from = from;
		return this;
	}
	protected ResourceMockBuilder withDerived(boolean derived) {
		this.derived = derived;
		return this;
	}
	protected ResourceMockBuilder withFixedExtension(String fixedExtension) {
		this.fixedExtension = fixedExtension;
		return this;
	}
	protected ResourceMockBuilder withDocumentInfo(DocumentInfo documentInfo) {
		this.documentInfo = documentInfo;
		return this;
	}


}
