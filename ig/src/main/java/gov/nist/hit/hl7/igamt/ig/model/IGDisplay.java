package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.ig.domain.IgMetaData;

public class IGDisplay {
	
	private IgMetaData metadata;
	private IgToc toc;

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

}
