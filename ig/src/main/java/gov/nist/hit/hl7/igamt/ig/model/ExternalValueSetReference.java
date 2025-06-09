package gov.nist.hit.hl7.igamt.ig.model;

import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

public class ExternalValueSetReference {
	private DisplayElement display;
	private String URL;

	public ExternalValueSetReference(DisplayElement display, String URL) {
		this.display = display;
		this.URL = URL;
	}

	public ExternalValueSetReference() {}

	public DisplayElement getDisplay() {
		return display;
	}

	public void setDisplay(DisplayElement display) {
		this.display = display;
	}

	public String getURL() {
		return URL;
	}

	public void setURL(String URL) {
		this.URL = URL;
	}
}
