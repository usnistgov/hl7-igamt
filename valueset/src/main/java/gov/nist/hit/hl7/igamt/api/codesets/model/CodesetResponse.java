package gov.nist.hit.hl7.igamt.api.codesets.model;

import java.util.List;

public class CodesetResponse {
    private String identifier;
    private String name;
    private VersionMetadata latestStableVersion;
    private List<VersionMetadata> versions;
    private List<ExternalCode> codes;
    private String codeMatchValue;

    public CodesetResponse() {
    }

    public String getId() {
        return identifier;
    }

    public void setId(String id) {
        this.identifier = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public VersionMetadata getLatestStableVersion() {
        return latestStableVersion;
    }

    public void setLatestStableVersion(VersionMetadata latestStableVersion) {
        this.latestStableVersion = latestStableVersion;
    }

    public List<VersionMetadata> getVersions() {
        return versions;
    }

    public void setVersions(List<VersionMetadata> versions) {
        this.versions = versions;
    }



    public String getCodeMatchValue() {
        return codeMatchValue;
    }

    public void setCodeMatchValue(String codeMatchValue) {
        this.codeMatchValue = codeMatchValue;
    }

	public List<ExternalCode> getCodes() {
		return codes;
	}

	public void setCodes(List<ExternalCode> codes) {
		this.codes = codes;
	}
}