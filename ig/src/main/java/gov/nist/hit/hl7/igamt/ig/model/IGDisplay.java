package gov.nist.hit.hl7.igamt.ig.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import gov.nist.hit.hl7.igamt.ig.domain.IgMetaData;

public class IGDisplay {
	
	private IgMetaData metadata;
    private List<TreeNode> toc =new ArrayList<TreeNode>();
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

  public List<TreeNode> getToc() {
    return toc;
  }

  public void setToc(List<TreeNode> toc) {
    this.toc = toc;
  }

}
