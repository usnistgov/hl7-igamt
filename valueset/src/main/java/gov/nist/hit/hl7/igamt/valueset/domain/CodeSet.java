package gov.nist.hit.hl7.igamt.valueset.domain;

import java.util.Date;
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
    
    private boolean exposed;
    
    private String latest;
    
    private Date dateUpdated;
    
    private String slug;
    
    private String name;
    
    private String description;
    
    private String username;

	private boolean disableKeyProtection;
    
    @DBRef
    private Set<CodeSetVersion> codeSetVersions;

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

	public boolean isExposed() {
		return exposed;
	}

	public void setExposed(boolean exposed) {
		this.exposed = exposed;
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

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public Set<CodeSetVersion> getCodeSetVersions() {
		return codeSetVersions;
	}

	public void setCodeSetVersions(Set<CodeSetVersion> codeSetVersions) {
		this.codeSetVersions = codeSetVersions;
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
}
