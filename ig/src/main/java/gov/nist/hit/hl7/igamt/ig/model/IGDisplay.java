package gov.nist.hit.hl7.igamt.ig.model;

import java.util.Date;

import gov.nist.hit.hl7.igamt.ig.domain.IgMetaData;

public class IGDisplay {
	
	private IgMetaData metadata;
	private IgToc toc;
	private Date dateUpdated;
	private String author;

	public IGDisplay() {
		// TODO Auto-generated constructor stub
	}

	public IgMetaData getMetadata() {
		return metadata;
	}

	public void setMetadata(IgMetaData metadata) {
		this.metadata = metadata;
	}

	public IgToc getToc() {
		return toc;
	}

	public void setToc(IgToc toc) {
		this.toc = toc;
	}

	public Date getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

}
