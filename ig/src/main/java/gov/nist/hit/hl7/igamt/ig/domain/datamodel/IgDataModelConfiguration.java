package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import gov.nist.hit.hl7.igamt.ig.domain.ExternalValueSetExportMode;

import java.util.HashMap;
import java.util.Map;

public class IgDataModelConfiguration {
	private Map<String, ExternalValueSetExportMode> externalValueSetExportMode;

	public Map<String, ExternalValueSetExportMode> getExternalValueSetExportMode() {
		if(externalValueSetExportMode == null) {
			return new HashMap<>();
		}
		return externalValueSetExportMode;
	}

	public void setExternalValueSetExportMode(Map<String, ExternalValueSetExportMode> externalValueSetExportMode) {
		this.externalValueSetExportMode = externalValueSetExportMode;
	}
}
