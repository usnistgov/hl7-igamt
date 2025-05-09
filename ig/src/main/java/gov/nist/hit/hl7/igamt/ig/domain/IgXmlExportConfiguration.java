package gov.nist.hit.hl7.igamt.ig.domain;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.HashMap;
import java.util.Map;

@Document
public class IgXmlExportConfiguration {
	@Id
	private String id;
	private String igId;
	private String username;
	private Map<String, Map<String, ExternalValueSetExportMode>> externalValueSetXmlExportMode;

	public Map<String, Map<String, ExternalValueSetExportMode>> getExternalValueSetXmlExportMode() {
		if(externalValueSetXmlExportMode == null) {
			this.externalValueSetXmlExportMode = new HashMap<>();
		}
		return externalValueSetXmlExportMode;
	}

	public void setExternalValueSetXmlExportMode(Map<String, Map<String, ExternalValueSetExportMode>> externalValueSetXmlExportMode) {
		this.externalValueSetXmlExportMode = externalValueSetXmlExportMode;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIgId() {
		return igId;
	}

	public void setIgId(String igId) {
		this.igId = igId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}
