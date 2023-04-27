package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.HashSet;
import java.util.Set;


public class DocumentStructure extends AbstractDomain {

	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	protected DocumentMetadata metadata;
	protected Set<TextSection> content = new HashSet<TextSection>();
	protected DocumentConfig documentConfig = new DocumentConfig();
	
	protected Boolean draft;
	
	protected Boolean deprecated = false;
	
	public Boolean getDeprecated() {
		return deprecated;
	}

	public void setDeprecated(Boolean deprecated) {
		this.deprecated = deprecated;
	}

	public DocumentStructure(String id, String version, String name, PublicationInfo publicationInfo,
		      DomainInfo domainInfo, String username, String comment, String description) {
		    super(id, version, name, publicationInfo, domainInfo, username, comment, description);
	}
	
	public DocumentStructure() {
	    super();
	    documentConfig = new DocumentConfig();
	}
	  
	public DocumentMetadata getMetadata() {
		return metadata;
	}

	public void setMetadata(DocumentMetadata metadata) {
		this.metadata = metadata;
	}

	public Set<TextSection> getContent() {
		return content;
	}

	public void setContent(Set<TextSection> content) {
		this.content = content;
	}

	@Override
	public String getLabel() {
		return null;
	}

	public Registry getDatatypeRegistry() {
		return null;
	}
	
	public Boolean getDraft() {
		return draft;
	}

	public void setDraft(Boolean draft) {
		this.draft = draft;
	}
	
	public DocumentConfig getDocumentConfig() {
		return documentConfig;
	}

	public void setDocumentConfig(DocumentConfig documentConfig) {
		this.documentConfig = documentConfig;
	}

}
