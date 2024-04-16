package gov.nist.hit.hl7.igamt.valueset.model;

import java.util.Date;

public class CodeSetVersionListInfo {
	 
	private String id;
	private Date dateCommitted;
	private String version;
	private String comment;
	
	
	public CodeSetVersionListInfo() {
		super();
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getDateCommitted() {
		return dateCommitted;
	}
	public void setDateCommitted(Date dateCommitted) {
		this.dateCommitted = dateCommitted;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	

}
