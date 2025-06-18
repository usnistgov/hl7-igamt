package gov.nist.hit.hl7.igamt.valueset.domain;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Audience;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class CodeSet {
	
	@Id
	private String id;

    private Audience audience;
    
    private String latest;
    
    private Date dateUpdated;
    
    private String name;
    
    private String description;
    
    private String username;

	private boolean disableKeyProtection;

    private Set<String> codeSetVersions = new HashSet<>();

	public CodeSet() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Audience getAudience() {
		return audience;
	}

	public void setAudience(Audience audience) {
		this.audience = audience;
	}

	public String getLatest() {
		return latest;
	}

	public void setLatest(String latest) {
		this.latest = latest;
	}

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isDisableKeyProtection() {
		return disableKeyProtection;
	}

	public void setDisableKeyProtection(boolean disableKeyProtection) {
		this.disableKeyProtection = disableKeyProtection;
	}

	public Set<String> getCodeSetVersions() {
		return codeSetVersions;
	}

	public void setCodeSetVersions(Set<String> codeSetVersions) {
		this.codeSetVersions = codeSetVersions;
	}
}
