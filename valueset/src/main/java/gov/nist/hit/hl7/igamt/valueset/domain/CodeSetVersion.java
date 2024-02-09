package gov.nist.hit.hl7.igamt.valueset.domain;

import java.sql.Date;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class CodeSetVersion {
	
	@Id
	private String id;
	
	private String version;
	
	private boolean exposed; 
	
	private Date dateCommited;
	
	private String comments;
	
	private Set<Code> codes;
	
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

	public Date getDateCommited() {
		return dateCommited;
	}

	public void setDateCommited(Date dateCommited) {
		this.dateCommited = dateCommited;
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


}
