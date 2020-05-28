package gov.nist.hit.hl7.igamt.common.base.domain;

import java.util.HashSet;
import java.util.Set;

public class DocumentStructure extends AbstractDomain{

	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	protected DocumentMetadata metadata;
	protected Set<TextSection> content = new HashSet<TextSection>();
	
	  
	
	public DocumentStructure(String id, String version, String name, PublicationInfo publicationInfo,
		      DomainInfo domainInfo, String username, String comment, String description) {
		    super(id, version, name, publicationInfo, domainInfo, username, comment, description);
		    // TODO Auto-generated constructor stub
		  }
	
	public DocumentStructure() {
	    super();
	    // TODO Auto-generated constructor stub
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
		// TODO Auto-generated method stub
		return null;
	}

	public Registry getDatatypeRegistry() {
		// TODO Auto-generated method stub
		return null;
	}

}
