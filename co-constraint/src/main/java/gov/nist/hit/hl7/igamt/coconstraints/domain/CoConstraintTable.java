package gov.nist.hit.hl7.igamt.coconstraints.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document
public class CoConstraintTable {
	
	@Id
  	private String id;
	private boolean supportGroups;
	private String segment;
	private CoConstraintTableHeaders headers;
	private CoConstraintTableContent content;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public boolean isSupportGroups() {
		return supportGroups;
	}
	public void setSupportGroups(boolean supportGroups) {
		this.supportGroups = supportGroups;
	}
	public CoConstraintTableHeaders getHeaders() {
		return headers;
	}
	public void setHeaders(CoConstraintTableHeaders headers) {
		this.headers = headers;
	}
	public CoConstraintTableContent getContent() {
		return content;
	}
	public void setContent(CoConstraintTableContent content) {
		this.content = content;
	}
	public String getSegment() {
		return segment;
	}
	public void setSegment(String segment) {
		this.segment = segment;
	}
	
	public CoConstraintTable clone(){
		CoConstraintTable table = new CoConstraintTable();
		table.supportGroups = supportGroups;
		table.segment = segment;
		table.headers = headers.clone();
		table.content = content.clone();
		return table;
	}

}
