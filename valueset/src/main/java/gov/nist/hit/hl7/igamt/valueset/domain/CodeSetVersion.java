package gov.nist.hit.hl7.igamt.valueset.domain;

import java.util.Date;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class CodeSetVersion {



	@Id
	private String id;
	
	private String version;
	
	private boolean exposed; 
	
	private Date dateCommitted;
	
	@CreatedDate
	private Date dateCreated;
	
	@LastModifiedDate
	private Date dateUpdated;
		
	private String comments;
	
	private Set<Code> codes;
	
	private boolean deprecated;
	
	public CodeSetVersion() {
		super();
	}

	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public boolean isExposed() {
		return exposed;
	}

	public void setExposed(boolean exposed) {
		this.exposed = exposed;
	}

	public Date getDateCommitted() {
		return dateCommitted;
	}

	public void setDateCommitted(Date dateCommited) {
		this.dateCommitted = dateCommited;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Set<Code> getCodes() {
		return codes;
	}

	public void setCodes(Set<Code> codes) {
		this.codes = codes;
	}


	public Date getDateCreated() {
		return dateCreated;
	}


	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	
	
	public Date getDateUpdated() {
		return dateUpdated;
	}


	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}


	public boolean isDeprecated() {
		return deprecated;
	}


	public void setDeprecated(boolean deprecated) {
		this.deprecated = deprecated;
	}

}
